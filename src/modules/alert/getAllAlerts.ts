import { PrismaClient } from "../../../generated/prisma";
import { HttpResponse } from "../../utils/response/success";


interface MarginDetailsProps {
    prisma: PrismaClient;
    userId: string;
}

export async function getAllAlerts({
    prisma,
    userId
}: MarginDetailsProps) {
    const getAlerts = await prisma.alert.findMany({
        where: { userId }
    });
    if (!getAlerts || getAlerts.length === 0) {
        throw new Error("ALERTS_NOT_FOUND");
    }
    return new HttpResponse(200, "ALERTS_FETCHED_SUCCESSFULLY", getAlerts).toResponse();
}
