import { Prisma, type PrismaClient } from "../../../generated/prisma/client";
import { HttpResponse } from "../../utils/response/success";


interface RegisterData {
    name: string;
    basketId: string;
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
}

export async function updateBasketName({ prisma, data }: IRegisterProp) {
    const { name, basketId } = data;
    const updatedBasket = await prisma.basket.update<Prisma.BasketUpdateArgs>({
        where: { id: basketId },
        data: { name }
    });
    if (!updatedBasket) {
        return new HttpResponse(500, "BASKET_UPDATE_FAILED").toResponse();
    }
    return new HttpResponse(200, "BASKET_NAME_UPDATED_SUCCESSFULLY", { basketId: updatedBasket.id }).toResponse();
}
