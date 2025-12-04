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
        where: { id: instrumentId, isActive: true }, select: {
            tradingSymbol: true,
            tickSize: true,
            lotSize: true,
            lastPrice: true,
        }
    });
    if (!instrument) {
        return new HttpResponse(400, "INVALID_OR_INACTIVE_INSTRUMENT").toResponse();
    }
    //! 1) Checks whether I am trading the same thingy as instrument
    if (tradingSymbol !== instrument.tradingSymbol) {
        return new HttpResponse(400, "TRADING_SYMBOL_MISMATCH").toResponse();
    }
    //! 2) Validate price and quantity`
    const tickSize = instrument.tickSize ?? 0.05;
    const lotSize = instrument.lotSize ?? 1;
    const tickMultiple = Math.round(price / tickSize);
    const tickError = Math.abs(price - tickMultiple * tickSize);
    if (tickError > 1e-6) {
        return new HttpResponse(400, "INVALID_TICK_SIZE").toResponse();
    }
    // quantity must be multiple of lot size
    if (quantity <= 0 || quantity % lotSize !== 0) {
        return new HttpResponse(400, "INVALID_QUANTITY_FOR_LOT_SIZE").toResponse();
    }
    // 3) Very simple price band check (you can improve later)
    if (instrument.lastPrice > 0) {
        const maxMovePct = 0.5; // allow +/- 50% for now
        const lower = instrument.lastPrice * (1 - maxMovePct);
        const upper = instrument.lastPrice * (1 + maxMovePct);
        if (price < lower || price > upper) {
            return new HttpResponse(400, "PRICE_OUT_OF_ALLOWED_RANGE").toResponse();
        }
    }

    // 4) Compute required margin / cash
    const notional = price * quantity; // NOTE: consider Decimal later
    const marginFactor = PRODUCT_MARGIN[product] ?? 1;
    const requiredMargin = notional * marginFactor;

    // 5) CNC SELL: check holdings (simple version)
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
    // 6) Transaction: lock funds + create order atomically
    const result = await prisma.$transaction(async (tx) => {
        // Reload wallet inside the tx
        const wallet = await tx.wallet.findUnique({
            where: { userId },
        });
        if (!wallet) {
            throw new Error("WALLET_NOT_FOUND");
        }
        // Available must be >= required margin
        if (wallet.availableBalance <= requiredMargin) {
            throw new Error("INSUFFICIENT_BALANCE")
        }
        // Lock margin: move from available -> locked
        await tx.wallet.update({
            where: { userId },
            data: {
                availableBalance: { decrement: requiredMargin },
                lockedBalance: { increment: requiredMargin },
            },
        });

        // Use a better order ID – random is okay for now but collision-prone
        const orderId = "ID-" + Math.floor(Math.random() * 1_000_000_000);

        const createOrder = await tx.order.create({
            data: {
                userId,
                placedBy: "H",
                orderId,
                pendingQuantity: quantity,
                ...data,
            },
        });

        return createOrder;
    }).catch((err) => {
        if (err instanceof Error) {
            if (err.message == "WALLET_NOT_FOUND") {
                return new HttpResponse(400, "WALLET_NOT_FOUND").toResponse();
            }
            if (err.message == "INSUFFICIENT_BALANCE") {
                return new HttpResponse(400, "INSUFFICIENT_BALANCE").toResponse();
            }
        }
        return new HttpResponse(500, "ORDER_CREATION_FAILED").toResponse();
    });

    if (result && result.status && result.status !== 200) {
        return result
    }
    const createOrder = result as any  // the Prisma order
    // 7) Publish to Kafka (non-transactional, after DB is committed)
    // Define a clean DTO for the engine instead of dumping the whole Prisma object
    await sendMessage("order.create", userId, {
        orderId: createOrder.orderId,
        userId: createOrder.userId,
        instrumentId: createOrder.instrumentId,
        tradingSymbol: createOrder.tradingSymbol,
        exchange: createOrder.exchange,
        product: createOrder.product,
        variety: createOrder.variety,
        orderType: createOrder.orderType,
        transactionType: createOrder.transactionType,
        quantity: createOrder.quantity,
        price: createOrder.price,
        validity: createOrder.validity,
        // any other engine-relevant fields
    });

    return new HttpResponse(200, "ORDER_HAS_BEEN_INITIATED", {
        orderId: createOrder.orderId,
    }).toResponse();
}
