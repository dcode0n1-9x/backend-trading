import { PrismaClient } from "../../../../generated/prisma";
import { HttpResponse } from "../../../utils/response/success";

interface InputProps {
    basketId: string;
}

interface MarginDetailsProps {
    prisma: PrismaClient;
    data: InputProps
    userId: string;
}

export async function getAllBasketItems({
    prisma,
    data,
    userId
}: MarginDetailsProps) {
    const getBasketItems = await prisma.basketItem.findMany({
        where: {
            basketId: data.basketId,
            basket: {
                userId: userId,
            }
        },
    });
    if (!getBasketItems || getBasketItems.length === 0) {
        throw new Error("BASKET_ITEM_NOT_FOUND");
    }
    return new HttpResponse(200, "BASKET_ITEMS_FETCHED_SUCCESSFULLY", getBasketItems).toResponse();
}
