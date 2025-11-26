import type { PrismaClient } from "../../../generated/prisma/client";
import { sendMessage } from "../../utils/kakfa.utils";
import { HttpResponse } from "../../utils/response/success";


interface RegisterData {
    userId: string;
    alertId: string;
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
}

export async function deleteAlert({ prisma, data }: IRegisterProp) {
    const { alertId } = data;
    const deleteAlert = await prisma.alert.delete({
        where: { id: alertId, userId: data.userId, isTriggered: false },
    });
    if (!deleteAlert) {
        return new HttpResponse(500, "ALERT_DELETION_FAILED").toResponse();
    }
    await sendMessage("alert.deleted", data.userId, { alert: deleteAlert });
    return new HttpResponse(200, "ALERT_DELETED_SUCCESSFULLY", { alertId: deleteAlert.id }).toResponse();
}
