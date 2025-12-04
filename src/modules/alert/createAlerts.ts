import type { AlertType, PrismaClient } from "../../../generated/prisma/client";
import { checkInstrument } from "../../helpers/helpers";
import { sendMessage } from "../../utils/kakfa.utils";
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
        const check = await checkInstrument(data.instrumentId)
        if (!check) {
            return new HttpResponse(400, "INVALID_INSTRUMENT_ID").toResponse();
        }
        const createAlert = await prisma.alert.create({
            data: {
                userId,
                ...data
            },
            select: {
                id: true,
                userId: true,
                instrumentId: true,
                alertType: true,
                message: true,
            }
        })
        if (!createAlert) {
            return new HttpResponse(500, "ALERT_CREATION_FAILED").toResponse();
        }
        await sendMessage("alert.create", userId, { alert: createAlert })
        return new HttpResponse(200, "ALERT_CREATED_SUCCESSFULLY", { alertId: createAlert.id }).toResponse();
    } catch (error) {
        return new HttpResponse(500, "ALERT_CREATION_FAILED", error).toResponse();
    }
}
