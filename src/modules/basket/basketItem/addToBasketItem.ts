import { OrderType } from './../../../../generated/prisma/client/enums';

import type { Exchange, PrismaClient, ProductType, TransactionType } from "../../../../generated/prisma/client";
import { HttpResponse } from "../../../utils/response/success";
import { checkInstrument } from '../../../helpers/helpers';


interface RegisterData {
    basketId: string;
    instrumentId: string;
    tradingSymbol: string;
    exchange: Exchange;
    transactionType: TransactionType;
    orderType: OrderType;
    quantity: number;
    price: number;
    triggeredPrice: string;
    product: ProductType;
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
}

export async function createBasketItem({ prisma, data }: IRegisterProp) {
    try {
        const instrumentExist = await checkInstrument(data.instrumentId);
        if (!instrumentExist) { 
            return new HttpResponse(400, "INVALID_INSTRUMENT_ID").toResponse();
        }
        const createBasketItem = await prisma.basketItem.create({
            data
        });
        if (!createBasketItem) {
            return new HttpResponse(500, "BASKET_ITEM_CREATION_FAILED").toResponse();
        }
        return new HttpResponse(200, "BASKET_ITEM_CREATED_SUCCESSFULLY", { basketItemId: createBasketItem.id }).toResponse();
    } catch (error) {
        return new HttpResponse(500, "BASKET_ITEM_CREATION_FAILED").toResponse();
    }
}
