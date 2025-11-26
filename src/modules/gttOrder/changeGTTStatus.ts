import type { GTTStatus, PrismaClient } from "../../../generated/prisma/client";
import { HttpResponse } from "../../utils/response/success";


interface RegisterData {
    gttOrderId: string;
    status : GTTStatus;
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
    userId: string
}

export async function changeGTTStatus({ prisma, data, userId }: IRegisterProp) {
    const { gttOrderId, status } = data;
    const updateOrder = await prisma.gTTOrder.update({
        where: { id: gttOrderId, userId: userId },
        data: { status },
        select : { id: true }
    })
    if (!updateOrder) {
        return new HttpResponse(500, "UNABLE_TO_UPDATE_ORDER").toResponse();
    }
    return new HttpResponse(200, "ORDER_UPDATED_SUCCESSFULLY", { gttOrderId: updateOrder.id }).toResponse();
}
