import type { PrismaClient } from "../../../generated/prisma/client";
import { HttpResponse } from "../../utils/response/success";


interface RegisterData {
    orderId: string;
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
    userId: string
}

export async function deleteOrder({ prisma, data, userId }: IRegisterProp) {
    const { orderId } = data;
    const deleteOrder = await prisma.order.delete({
        where: { id: orderId, userId: userId },
    });
    if (!deleteOrder) {
        return new HttpResponse(500, "UNABLE_TO_DELETE_ORDER").toResponse();
    }
    return new HttpResponse(200, "ORDER_DELETED_SUCCESSFULLY", { orderId: deleteOrder.id }).toResponse();
}
