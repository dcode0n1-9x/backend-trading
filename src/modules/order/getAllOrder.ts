import type { PrismaClient, ProductType, Prisma } from "../../../generated/prisma";
import { HttpResponse } from "../../utils/response/success";

interface GetHoldingData {
    type?: ProductType;
    sort?: 'asc' | 'desc';
    cursor?: string; // Holding ID for cursor pagination
    limit?: number;
    search?: string;
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: GetHoldingData;
    userId: string;
}

export async function getOrders({ prisma, userId, data }: IRegisterProp) {
    const { type, search, cursor, sort = 'desc', limit = 20 } = data;

    // Build dynamic where clause
    const whereClause: Prisma.OrderWhereInput = {
        userId,
        ...(type && { product: type }),
        ...(search && {
            instrument: {
                OR: [
                    { tradingSymbol: { contains: search, mode: 'insensitive' } },
                    { name: { contains: search, mode: 'insensitive' } },
                    { isin: { contains: search, mode: 'insensitive' } },
                    { instrumentToken: { contains: search, mode: 'insensitive' } }
                ]
            }
        })
    };

    // Cursor-based pagination query
    const orders = await prisma.order.findMany({
        where: whereClause,
        orderBy: {
            createdAt: sort
        },
        ...(cursor && {
            cursor: { id: cursor },
            skip: 1 // Skip the cursor itself
        }),
        take: limit,
        include: {
            instrument: {
                select: {
                    id: true,
                    instrumentToken: true,
                    tradingSymbol: true,
                    name: true,
                    exchange: true,
                    segment: true,
                    instrumentType: true,
                    tickSize: true,
                    lotSize: true,
                    lastPrice: true,
                    isin: true
                }
            },
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true
                }
            }
        }
    });

    if (!orders || orders.length === 0) {
        return new HttpResponse(404, "ORDER_NOT_FOUND", {
            data: [],
            pagination: {
                nextCursor: null,
                hasMore: false,
                count: 0
            }
        }).toResponse();
    }

    // Calculate next cursor
    const nextCursor = orders.length === limit ? orders[orders.length - 1].id : null;

    return new HttpResponse(200, "ORDER_FOUND", {
        data: orders,
        pagination: {
            nextCursor,
            hasMore: orders.length === limit,
            count: orders.length
        }
    }).toResponse();
}
