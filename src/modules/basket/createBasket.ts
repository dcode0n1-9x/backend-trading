import type { PrismaClient, Segment } from "../../../generated/prisma";
import { HttpResponse } from "../../utils/response/success";


interface RegisterData {
    name: string;
    watchlistId: string;
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
    userId : string
}

export async function createBasket({ prisma, data , userId }: IRegisterProp) {
    try {
        const createBasket = await prisma.basket.create({
            data: {
                userId ,
                name: data.name,
            }
        });
        if (!createBasket) {
            return new HttpResponse(500, "BASKET_CREATION_FAILED").toResponse();
        }
        return new HttpResponse(200, "BASKET_CREATED_SUCCESSFULLY", { basketId: createBasket.id }).toResponse();
    } catch (error) {
        return new HttpResponse(500, "BASKET_CREATION_FAILED").toResponse();
    }
}
