import { Exchange, GTTType, OrderType, ProductType, TriggerType, type PrismaClient } from "../../../generated/prisma/client";
import { checkInstrument } from "../../helpers/helpers";
import { HttpResponse } from "../../utils/response/success";


interface RegisterData {
    gttType: GTTType,
    instrumentId: string,
    tradingSymbol: string,
    exchange: Exchange
    triggerType: TriggerType
    triggerPrice: number
    lastPrice: number
    quantity: number
    product: ProductType
    orderType: OrderType
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
    userId: string
}

// GOOD TILL TRIGGERED ORDER CREATION: you to set a price-based trigger for a limit order that remains active for up to one year,
export async function createGttOrder({ prisma, data, userId }: IRegisterProp) {
    const checkStock = await checkInstrument(data.instrumentId)
    if (!checkStock) {
        return new HttpResponse(400, "INVALID_INSTRUMENT_ID").toResponse();
    }
    const createGttOrders = await prisma.gTTOrder.create({
        data: {
            userId,
            ...data
        }
    })
    if (!createGttOrders) {
        return new HttpResponse(500, "GTT_ORDER_CREATION_FAILED").toResponse();
    }
    return new HttpResponse(200, "GTT_ORDER_CREATED_SUCCESSFULLY", { gttOrderId: createGttOrders.id }).toResponse();
}
