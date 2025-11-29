import { Prisma, PrismaClient } from "../../../generated/prisma/client";
import { AlertType } from "../../../generated/prisma/enums";
import { HttpResponse } from "../../utils/response/success";


interface AlertDetailsProps {
    prisma: PrismaClient;
    data: GetAlertData;
    userId: string;

}

interface GetAlertData {
    type?: AlertType
    sort?: 'asc' | 'desc';
    cursor?: string; // Holding ID for cursor pagination
    limit?: number;
    search?: string;
}

export async function getAllAlerts({
    prisma,
    data,
    userId
}: AlertDetailsProps) {
    const { type, search, cursor, sort = 'desc', limit = 20 } = data;
    const whereClause: Prisma.AlertWhereInput = {
        userId,
        ...(type && { alertType: type }),
        ...(search && {
            message: { contains: search, mode: Prisma.QueryMode.insensitive },
        })
    };
    const getAlerts = await prisma.alert.findMany<Prisma.AlertFindManyArgs>({
        where: whereClause,
        orderBy: {
            createdAt: sort
        },
        ...(cursor && {
            cursor: { id: cursor },
            skip: 1 // Skip the cursor itself
        }),
        take: limit,
        select: {
            id: true,
            instrumentId: true,
            alertType: true,
            message: true,
            triggerPrice: true,
            condition: true,
            createdAt: true,
        }
    });
    if (!getAlerts || getAlerts.length === 0) {
        return new HttpResponse(404, "ORDER_NOT_FOUND", {
            alerts: [],
            pagination: {
                nextCursor: null,
                hasMore: false,
                count: 0
            }
        }).toResponse();
    }
    const nextCursor = getAlerts.length === limit ? getAlerts[getAlerts.length - 1].id : null;

    return new HttpResponse(200, "ORDER_FOUND", {
        alerts: getAlerts,
        pagination: {
            nextCursor,
            hasMore: getAlerts.length === limit,
            count: getAlerts.length
        }
    }).toResponse();
}
