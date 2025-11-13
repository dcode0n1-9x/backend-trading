import { OrderType } from './../../../../generated/prisma/index.d';

import type { Exchange, PrismaClient, ProductType, TransactionType } from "../../../../generated/prisma";
import { HttpResponse } from "../../../utils/response/success";


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
        const createBasketItem = await prisma.basketItem.create({
            data
        });
        if (!createBasketItem) {
            return new HttpResponse(500, "WATCHLIST_GROUP_CREATION_FAILED").toResponse();
        }
        return new HttpResponse(200, "WATCHLIST_GROUP_CREATED_SUCCESSFULLY", { watchlistGroupId: createBasketItem.id }).toResponse();
    } catch (error) {
        return new HttpResponse(500, "WATCHLIST_GROUP_CREATION_FAILED").toResponse();
    }
}
