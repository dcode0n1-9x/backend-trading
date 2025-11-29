import { Prisma, PrismaClient } from "../../../generated/prisma/client";
import { HttpResponse } from "../../utils/response/success";



interface GetAllBasketData {
    sort?: 'asc' | 'desc';
    cursor?: string; // Holding ID for cursor pagination
    limit?: number;
    search?: string;
}
interface MarginDetailsProps {
    prisma: PrismaClient;
    data: GetAllBasketData;
    userId: string;
}
export async function getAllBasket({
    prisma,
    data,
    userId
}: MarginDetailsProps) {
    const { search, cursor, sort = 'desc', limit = 20 } = data;

    const whereClause: Prisma.BasketWhereInput = {
        userId,
        ...(search && {
            items: {
                some: {
                    OR: [
                        { tradingSymbol: { contains: search, mode: Prisma.QueryMode.insensitive } },
                    ]
                }
            }
        })
    };

    const getBaskets = await prisma.basket.findMany({
        where: whereClause,
        select: {
            id: true,
            name: true,
            description: true,
            totalValue: true,
            items: {
                select: {
                    instrumentId: true,
                    tradingSymbol: true,
                    exchange: true,
                    quantity: true,
                    transactionType: true,
                    triggerPrice: true,
                    price: true,
                    product: true,
                    orderType: true,
                    sortOrder: true,
                },
                orderBy: {
                    sortOrder: 'asc'
                }
            }
        },
        orderBy: {
            createdAt: sort
        },
        take: limit,
        ...(cursor && {
            cursor: { id: cursor },
            skip: 1
        })
    });

    if (!getBaskets || getBaskets.length === 0) {
        throw new Error("BASKETS_NOT_FOUND");
    }
    
    return new HttpResponse(200, "BASKETS_FETCHED_SUCCESSFULLY", getBaskets).toResponse();
}
