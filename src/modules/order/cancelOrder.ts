import type { PrismaClient } from "../../../generated/prisma/client";
import { HttpResponse } from "../../utils/response/success";


interface RegisterData {
    orderId: string
    quantity: number;
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
    userId : string 
}

export async function cancelOrder({ prisma, data , userId }: IRegisterProp) {
    const { orderId, quantity } = data;
    const cancelOrder = await prisma.order.update({
        where: { id: orderId , userId },
        data: {
            cancelledBy: "USER",
            cancelledQuantity: quantity,
            status: "CANCELLED"
        }
    })
    if (!cancelOrder) {
        return new HttpResponse(400, "UNABLE_TO_CANCEL_ORDER").toResponse()
    }
    return new HttpResponse(200, "ORDER_CANCELLED_SUCCESSFULLY")
}
