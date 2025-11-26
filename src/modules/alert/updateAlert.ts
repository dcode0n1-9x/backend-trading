import type { AlertType, PrismaClient } from "../../../generated/prisma/client";
import { sendMessage } from "../../utils/kakfa.utils";
import { HttpResponse } from "../../utils/response/success";


interface RegisterData {
    alertId: string;
    alertType?: AlertType;
    instrumentId?: string;
    message?: string;
    triggerPrice?: number;
    condition?: string;
    isRead?: boolean;
    isTriggered?: boolean;
    // triggeredAt?: Date;
    // expiresAt?: Date;
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
    userId: string;
}



export async function updateAlert({ prisma, data, userId }: IRegisterProp) {
    const { alertId, alertType } = data;
    const updateData: Partial<{ alertType: AlertType, instrumentId: string, message: string, triggerPrice: number, condition: string, isRead: boolean, isTriggered: boolean, triggeredAt: Date, expiresAt: Date }> = {};


    if (alertType) updateData.alertType = alertType;
    if (data.instrumentId) updateData.instrumentId = data.instrumentId;
    if (data.message) updateData.message = data.message;
    if (data.triggerPrice) updateData.triggerPrice = data.triggerPrice;
    if (data.condition) updateData.condition = data.condition;
    if (data.isRead) updateData.isRead = data.isRead;
    if (data.isTriggered) updateData.isTriggered = data.isTriggered;
    // if (data.triggeredAt) updateData.triggeredAt = data.triggeredAt;
    // if (data.expiresAt) updateData.expiresAt = data.expiresAt;
    const updatedAlert = await prisma.alert.update({
        where: { id: alertId, userId, isTriggered: false },
        data: updateData
    });
    if (!updatedAlert) {
        return new HttpResponse(500, "ALERT_UPDATE_FAILED").toResponse();
    }
    await sendMessage("alert.updated", userId, { alert: updatedAlert });
    return new HttpResponse(200, "ALERT_UPDATED_SUCCESSFULLY", { alertId: updatedAlert.id }).toResponse();
}
