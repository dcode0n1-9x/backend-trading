import type {
    Exchange,
    OrderType,
    OrderValidity,
    OrderVariety,
    PrismaClient,
    ProductType,
    TransactionType,
} from "../../../generated/prisma/client";
import { HttpResponse } from "../../utils/response/success";
import { sendMessage } from "../../utils/kakfa.utils";
interface RegisterData {
    variety: OrderVariety;
    orderType: OrderType;
    transactionType: TransactionType;
    validity: OrderValidity;
    product: ProductType;
    exchange: Exchange;
    tradingSymbol: string;
    instrumentId: string;
    quantity: number;
    price: number;
}
interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
    userId: string;
}
// simple config for now – lift this out later into proper risk config
const PRODUCT_MARGIN: Record<ProductType, number> = {
    CNC: 1,     // full cash
    MIS: 0.2,   // 20% intraday margin (example)
    NRML: 0.3,  // 30% overnight (example)
};
export async function createOrder({ prisma, data, userId }: IRegisterProp) {
    const {
        instrumentId,
        price,
        quantity,
        product,
        transactionType,
        tradingSymbol,
    } = data;
    const instrument = await prisma.instrument.findUnique({
        where: { id: instrumentId, isActive: true },
        select: {
            tradingSymbol: true,
            tickSize: true,
            lotSize: true,
            lastPrice: true,
        }
    });
    if (!instrument) {
        return new HttpResponse(400, "INVALID_OR_INACTIVE_INSTRUMENT").toResponse();
    }
    // 1) TRADING SYMBOL CHECK
    if (tradingSymbol !== instrument.tradingSymbol) {
        return new HttpResponse(400, "TRADING_SYMBOL_MISMATCH").toResponse();
    }
    // 2) PRICE & QUANTITY VALIDATION
    const tickSize = instrument.tickSize ?? 0.05;
    const lotSize = instrument.lotSize ?? 1;
    const tickMultiple = Math.round(price / tickSize);
    const tickError = Math.abs(price - tickMultiple * tickSize);
    if (tickError > 1e-6) {
        return new HttpResponse(400, "INVALID_TICK_SIZE").toResponse();
    }
    if (quantity <= 0 || quantity % lotSize !== 0) {
        return new HttpResponse(400, "INVALID_QUANTITY_FOR_LOT_SIZE").toResponse();
    }
    // 3) SIMPLE PRICE BAND CHECK
    if (instrument.lastPrice > 0) {
        const maxMovePct = 0.5;
        const lower = instrument.lastPrice * (1 - maxMovePct);
        const upper = instrument.lastPrice * (1 + maxMovePct);
        if (price < lower || price > upper) {
            return new HttpResponse(400, "PRICE_OUT_OF_ALLOWED_RANGE").toResponse();
        }
    }
    // 4) REQUIRED MARGIN
    const notional = price * quantity;
    const marginFactor = PRODUCT_MARGIN[product] ?? 1;
    const requiredMargin = notional * marginFactor;
    // 5) CNC SELL: CHECK HOLDINGS
    if (product === "CNC" && transactionType === "SELL") {
        const holding = await prisma.holding.findUnique({
            where: {
                userId_instrumentId_product: {
                    userId,
                    instrumentId,
                    product: "CNC",
                },
            },
        });
        if (!holding || holding.quantity < quantity) {
            return new HttpResponse(400, "INSUFFICIENT_HOLDINGS").toResponse();
        }
    }
    try {
        // 6) TRANSACTION – lock funds + create order atomically
        const createdOrder = await prisma.$transaction(async (tx) => {
            const wallet = await tx.wallet.findUnique({
                where: { userId },
            });
            console.log("Wallet fetched in DB transaction:", wallet);
            if (!wallet) {
                throw new Error("WALLET_NOT_FOUND");
            }
            // NOTE: if equality is allowed, use `<` instead of `<=`
            if (wallet.availableBalance < requiredMargin) {
                throw new Error("INSUFFICIENT_BALANCE");
            }
            await tx.wallet.update({
                where: {
                    userId,
                    availableBalance: { gte: requiredMargin }
                },
                data: {
                    availableBalance: { decrement: requiredMargin },
                    lockedBalance: { increment: requiredMargin },
                },
            });
            const orderId = Math.floor(Math.random() * 1_000_000_000);
            const order = await tx.order.create({
                data: {
                    userId,
                    orderId,
                    pendingQuantity: quantity,
                    ...data,
                },
            });
            console.log("Order created in DB transaction:", order);
            return order;
        });
        // Only reached if the transaction succeeded
        //! Rust Order requies to be in the snake_case.
        await sendMessage("order.create", userId, {
            order_id: createdOrder.orderId,
            instrument_id: createdOrder.instrumentId,
            // user_id: createdOrder.userId,
            side: createdOrder.transactionType,
            quantity: createdOrder.quantity,
            price: createdOrder.price,
            time_in_force: createdOrder.validity,
        });         
        return new HttpResponse(200, "ORDER_HAS_BEEN_INITIATED", {
            orderId: createdOrder.orderId,
        }).toResponse();
    } catch (err) {
        if (err instanceof Error) {
            if (err.message === "WALLET_NOT_FOUND") {
                return new HttpResponse(400, "WALLET_NOT_FOUND").toResponse();
            }
            if (err.message === "INSUFFICIENT_BALANCE") {
                return new HttpResponse(400, "INSUFFICIENT_BALANCE").toResponse();
            }
        }
        console.log(err)
        return new HttpResponse(500, "ORDER_CREATION_FAILED").toResponse();
    }
}
