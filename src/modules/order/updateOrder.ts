import { OrderType, OrderValidity, PrismaClient } from "../../../generated/prisma/client";
import { HttpResponse } from "../../utils/response/success";
interface IModifyOrderData {
    orderId: string;
    quantity?: number;           // NEW TOTAL quantity
    price?: number;
    triggerPrice?: number;
    orderType?: OrderType;
    disclosedQuantity?: number;
    validity?: OrderValidity;
}
interface IModifyOrderProp {
    prisma: PrismaClient;
    data: IModifyOrderData;
    userId: string; // For validation
}
export async function updateOrder({ prisma, data, userId }: IModifyOrderProp) {
    const { orderId, quantity, price, triggerPrice, orderType, disclosedQuantity, validity } = data;
    return await prisma.$transaction(async (tx) => {
        // Fetch current order
        const currentOrder = await tx.order.findUnique({
            where: { id: orderId },
            select: {
                id: true,
                orderId: true,
                userId: true,
                quantity: true,
                filledQuantity: true,
                pendingQuantity: true,
                cancelledQuantity: true,
                price: true,
                triggerPrice: true,
                disclosedQuantity: true,
                orderType: true,
                validity: true,
                status: true,
                variety: true,
                transactionType: true,
                tradingSymbol: true,
                exchange: true,
                product: true,
                statusMessage: true,
                modificationCount: true 
            }
        });
        // Validation 1: Order exists
        if (!currentOrder) {
            return new HttpResponse(400, "ORDER_NOT_FOUND").toResponse();
        }
        // Validation 2: User owns the order
        if (currentOrder.userId !== userId) {
            return new HttpResponse(403, "UNAUTHORIZED_ORDER_ACCESS").toResponse();
        }
        // Validation 3: Order status allows modification
        const modifiableStatuses = ["OPEN", "TRIGGER_PENDING", "MODIFIED"];
        if (!modifiableStatuses.includes(currentOrder.status)) {
            return new HttpResponse(400, `CANNOT_MODIFY_ORDER_STATUS_${currentOrder.status}`, {
                message: `Orders with status ${currentOrder.status} cannot be modified`
            }).toResponse();
        }
        // Validation 4: IOC orders cannot be modified (Zerodha rule)
        if (currentOrder.validity === "IOC") {
            return new HttpResponse(400, "IOC_ORDERS_CANNOT_BE_MODIFIED").toResponse();
        }
        // Validation 5: Maximum 25 modifications (Zerodha limit)
        const modificationCount = currentOrder.modificationCount || 0;
        if (modificationCount >= 25) {
            return new HttpResponse(400, "MAX_MODIFICATION_LIMIT_EXCEEDED", {
                message: "Maximum 25 modifications allowed per order. Please cancel and place new order."
            }).toResponse();
        }
        // Validation 6: At least one field must be provided for modification
        if (!quantity && !price && !triggerPrice && !orderType && !disclosedQuantity && !validity) {
            return new HttpResponse(400, "NO_MODIFICATION_PARAMETERS").toResponse();
        }
        // Prepare update data
        const updateData: any = {
            exchangeUpdateTime: new Date(),
            modificationCount: modificationCount + 1
        };
        // Handle QUANTITY modification (most critical)
        if (quantity !== undefined) {
            // Validation: New quantity cannot be less than filled
            if (quantity < currentOrder.filledQuantity) {
                return new HttpResponse(400, "QUANTITY_LESS_THAN_FILLED", {
                    message: `Cannot reduce quantity below filled quantity. Filled: ${currentOrder.filledQuantity}, Requested: ${quantity}`
                }).toResponse();
            }
            // Validation: Quantity must be positive
            if (quantity <= 0) {
                return new HttpResponse(400, "INVALID_QUANTITY").toResponse();
            }
            // Calculate new pending quantity
            const newPendingQuantity = quantity - currentOrder.filledQuantity;
            updateData.quantity = quantity;
            updateData.pendingQuantity = newPendingQuantity;
            // If reducing to exactly filled quantity, complete the order
            if (quantity === currentOrder.filledQuantity) {
                updateData.status = "COMPLETE";
                updateData.pendingQuantity = 0;
                // Remove from orderbook
                await removeFromOrderBook(tx, currentOrder);
                await tx.order.update({
                    where: { id: orderId },
                    data: updateData
                });
                return new HttpResponse(200, "ORDER_COMPLETED", {
                    orderId: currentOrder.orderId,
                    message: "Remaining quantity cancelled, order completed"
                }).toResponse();
            }
            // Remove old pending quantity from orderbook
            if (currentOrder.pendingQuantity > 0) {
                await removeFromOrderBook(tx, currentOrder);
            }
        }
        // Handle PRICE modification
        if (price !== undefined) {
            // Validation: Price required for LIMIT orders
            if ((orderType === "LIMIT" || currentOrder.orderType === "LIMIT") && price <= 0) {
                return new HttpResponse(400, "INVALID_PRICE").toResponse();
            }
            updateData.price = price;
        }
        // Handle TRIGGER PRICE modification
        if (triggerPrice !== undefined) {
            // Validation: Trigger price for SL orders
            const isSLOrder = (orderType === "SL" || orderType === "SLM") ||
                (currentOrder.orderType === "SL" || currentOrder.orderType === "SLM");
            if (isSLOrder && triggerPrice <= 0) {
                return new HttpResponse(400, "INVALID_TRIGGER_PRICE").toResponse();
            }
            updateData.triggerPrice = triggerPrice;
        }
        // Handle ORDER TYPE modification
        if (orderType !== undefined) {
            // Validation: Order type transitions
            if (orderType === "MARKET") {
                updateData.price = 0; // Market orders don't have price
            }
            if (orderType === "SL" || orderType === "SLM") {
                if (!triggerPrice && currentOrder.triggerPrice <= 0) {
                    return new HttpResponse(400, "TRIGGER_PRICE_REQUIRED_FOR_SL").toResponse();
                }
            }
            updateData.orderType = orderType;
        }
        // Handle DISCLOSED QUANTITY modification
        if (disclosedQuantity !== undefined) {
            if (disclosedQuantity < 0 || disclosedQuantity > (quantity || currentOrder.quantity)) {
                return new HttpResponse(400, "INVALID_DISCLOSED_QUANTITY").toResponse();
            }
            updateData.disclosedQuantity = disclosedQuantity;
        }
        // Handle VALIDITY modification
        if (validity !== undefined) {
            // Cannot modify TO IOC (Zerodha rule)
            if (validity === "IOC") {
                return new HttpResponse(400, "CANNOT_MODIFY_TO_IOC").toResponse();
            }
            updateData.validity = validity;
        }
        // Set status to MODIFIED (unless already partially filled)
        if (currentOrder.filledQuantity > 0) {
            updateData.status = "PARTIALLY_FILLED"; // Keep partially filled status
        } else {
            updateData.status = "MODIFIED";
        }
        updateData.statusMessage = "Order modified successfully";
        // Update the order
        const updatedOrder = await tx.order.update({
            where: { id: orderId },
            data: updateData
        });
        // Re-add to orderbook with new parameters (loses queue position)
        const newPendingQty = updateData.pendingQuantity ?? currentOrder.pendingQuantity;
        if (newPendingQty > 0) {
            await addToOrderBook(tx, {
                orderId: updatedOrder.id,
                exchangeOrderId: currentOrder.orderId,
                userId: currentOrder.userId,
                quantity: newPendingQty,
                price: updateData.price ?? currentOrder.price,
                triggerPrice: updateData.triggerPrice ?? currentOrder.triggerPrice,
                orderType: updateData.orderType ?? currentOrder.orderType,
                transactionType: currentOrder.transactionType,
                tradingSymbol: currentOrder.tradingSymbol,
                exchange: currentOrder.exchange,
                product: currentOrder.product
            });
        }
        return new HttpResponse(200, "ORDER_MODIFIED_SUCCESSFULLY", {
            orderId: updatedOrder.orderId,
            modifications: {
                quantity: quantity !== undefined ? { old: currentOrder.quantity, new: quantity } : undefined,
                price: price !== undefined ? { old: currentOrder.price, new: price } : undefined,
                orderType: orderType !== undefined ? { old: currentOrder.orderType, new: orderType } : undefined,
                pendingQuantity: updateData.pendingQuantity ?? currentOrder.pendingQuantity,
                filledQuantity: currentOrder.filledQuantity
            },
            modificationCount: modificationCount + 1,
            maxModifications: 25,
            queuePositionLost: true // Important: Zerodha loses queue position on modification
        }).toResponse();
    });
}
// Helper: Remove order from orderbook
async function removeFromOrderBook(tx: any, order: any) {
    // This depends on your orderbook implementation
    // Example for Redis-based orderbook:
    // Remove from order book table/cache
    await tx.orderBook.deleteMany({
        where: {
            orderId: order.id,
            status: "PENDING"
        }
    });
    // Emit event for matching engine
    // await eventEmitter.emit('ORDER_REMOVED', {
    //     orderId: order.orderId,
    //     side: order.transactionType,
    //     price: order.price,
    //     exchange: order.exchange,
    //     symbol: order.tradingSymbol
    // });
}
// Helper: Add order to orderbook
async function addToOrderBook(tx: any, orderData: any) {
    // Add to orderbook (goes to back of queue at price level)
    const timestamp = new Date();
    await tx.orderBook.create({
        data: {
            orderId: orderData.orderId,
            exchangeOrderId: orderData.exchangeOrderId,
            userId: orderData.userId,
            quantity: orderData.quantity,
            price: orderData.price,
            triggerPrice: orderData.triggerPrice,
            orderType: orderData.orderType,
            side: orderData.transactionType,
            tradingSymbol: orderData.tradingSymbol,
            exchange: orderData.exchange,
            product: orderData.product,
            status: "PENDING",
            timestamp: timestamp,
            queuePosition: null // Will be calculated by matching engine
        }
    });
    // Emit event for matching engine to process
    // await eventEmitter.emit('ORDER_MODIFIED', {
    //     orderId: orderData.exchangeOrderId,
    //     side: orderData.transactionType,
    //     price: orderData.price,
    //     quantity: orderData.quantity,
    //     timestamp: timestamp
    // });
}
