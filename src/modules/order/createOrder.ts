import { hash } from "crypto";
import type { Exchange, OrderType, OrderValidity, OrderVariety, PrismaClient, ProductType, TransactionType } from "../../../generated/prisma";
import { redis } from "../../config/redis/redis.config";
import { HttpResponse } from "../../utils/response/success";

interface RegisterData {
    variety: OrderVariety
    orderType: OrderType
    transactionType: TransactionType
    validity: OrderValidity
    product: ProductType
    exchange: Exchange
    tradingSymbol: string;
    instrumentId: string;
    quantity: number
    price: number
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
    userId: string;
}

export async function createOrder({ prisma, data, userId }: IRegisterProp) {
    const createOrder = await prisma.order.create({
        data: {
            userId,
            placedBy: "H",
            orderId: "asdadasd",
            pendingQuantity: data.quantity,
            status: "PENDING",
            ...data
        }
    })
    if(!createOrder){
        return new HttpResponse(400 , "UNABLE_TO_CREATE_ORDER").toResponse()
    }
    // send this to kafka to send the entire data to the order book and as soon as it is in the order book we want to notify the user that your order has been placed usually takes less time but still.
    return new HttpResponse(200 , "ORDER_HAS_BEEN_INITIATED")
}
