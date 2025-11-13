import type { AlertType, PrismaClient } from "../../../generated/prisma";
import { HttpResponse } from "../../utils/response/success";


interface RegisterData {
    instrumentId: string
    alertType: AlertType;
    message: string;
    triggerPrice: number
    condition: string;
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
    userId: string
}

export async function createAlert({ prisma, data, userId }: IRegisterProp) {
    try {
        const createAlert = await prisma.alert.create({
            data: {
                userId,
                ...data
            }
        });
        if (!createAlert) {
            return new HttpResponse(500, "ALERT_CREATION_FAILED").toResponse();
        }
        return new HttpResponse(200, "ALERT_CREATED_SUCCESSFULLY", { alertId: createAlert.id }).toResponse();
    } catch (error) {
        return new HttpResponse(500, "ALERT_CREATION_FAILED").toResponse();
    }
}
