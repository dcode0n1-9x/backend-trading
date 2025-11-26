import { Prisma, PrismaClient } from "../../../generated/prisma/client";
import { HttpResponse } from "../../utils/response/success";



interface GetAllBasketData {
    sort?: 'asc' | 'desc';
    cursor?: string; // Holding ID for cursor pagination
    limit?: number;
    search?: string;
}


interface GttOrdersProps {
    prisma: PrismaClient;
    data: GetAllBasketData;
    userId: string;
}

export async function getAllGTTOrder({
    prisma,
    data,
    userId
}: GttOrdersProps) {
    const { search, cursor, sort = 'desc', limit = 20 } = data;
    const whereClause: Prisma.GTTOrderWhereInput = {
        userId,
        ...(search && {
            OR: [
                { tradingSymbol: { contains: search, mode: Prisma.QueryMode.insensitive } },
            ]
        })
};

const getGTTOrders = await prisma.gTTOrder.findMany({
    where: whereClause,
    select: {
        instrumentId: true,
        tradingSymbol: true,
        exchange: true,
        quantity: true,
        triggerPrice: true,
        product: true,
        orderType: true,
        status: true
    },
    orderBy: {
        createdAt: sort
    },
    ...(cursor && {
        cursor: { id: cursor },
        skip: 1 // Skip the cursor itself
    }),
    take: limit,
});
if (!getGTTOrders || getGTTOrders.length === 0) {
    throw new Error("GTT_ORDERS_NOT_FOUND");
}
return new HttpResponse(200, "GTT_ORDERS_FETCHED_SUCCESSFULLY", getGTTOrders).toResponse();
}
