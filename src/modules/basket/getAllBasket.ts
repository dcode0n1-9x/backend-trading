import { PrismaClient } from "../../../generated/prisma";
import { HttpResponse } from "../../utils/response/success";


interface MarginDetailsProps {
    prisma: PrismaClient;
    userId: string;
}

export async function getAllBasket({
    prisma,
    userId
}: MarginDetailsProps) {
    const getBaskets = await prisma.basket.findMany({
        where: { userId },
        select: {
            items: {
                select: {
                    
                }
            }
        }
    });
    if (!getBaskets || getBaskets.length === 0) {
        throw new Error("BASKETS_NOT_FOUND");
    }
    return new HttpResponse(200, "BASKETS_FETCHED_SUCCESSFULLY", getBaskets).toResponse();
}
