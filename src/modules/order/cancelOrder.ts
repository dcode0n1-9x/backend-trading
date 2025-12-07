import type { PrismaClient } from "../../../generated/prisma/client";
import { sendMessage } from "../../utils/kakfa.utils";
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
    const { orderId} = data;
    const cancelOrder = await prisma.order.update({
        where: { id: orderId , userId , OR : [
            { status : "PENDING" },
            { status : "OPEN" }
        ] },
        data: {
            cancelledBy: "USER",
            status: "CANCELLED"
        }
    })
    if (!cancelOrder) {
        return new HttpResponse(400, "UNABLE_TO_CANCEL_ORDER").toResponse()
    }
    await sendMessage("order.cancelled", userId, { 
        order_id: cancelOrder.orderId, 
        instrument_id : cancelOrder.instrumentId    ,
    })
    return new HttpResponse(200, "ORDER_CANCELLED_SUCCESSFULLY")
}
