import type { PrismaClient, ProductType, Prisma } from "../../../generated/prisma/client";
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

export async function getHolding({ prisma, userId, data }: IRegisterProp) {
    const { type, search, cursor, sort = 'desc', limit = 20 } = data;

    // Build dynamic where clause
    const whereClause: Prisma.HoldingWhereInput = {
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
    const holdings = await prisma.holding.findMany({
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

    if (!holdings || holdings.length === 0) {
        return new HttpResponse(404, "HOLDING_NOT_FOUND", {
            data: [],
            pagination: {
                nextCursor: null,
                hasMore: false,
                count: 0
            }
        }).toResponse();
    }

    // Calculate next cursor
    const nextCursor = holdings.length === limit ? holdings[holdings.length - 1].id : null;

    return new HttpResponse(200, "HOLDING_FOUND", {
        data: holdings,
        pagination: {
            nextCursor,
            hasMore: holdings.length === limit,
            count: holdings.length
        }
    }).toResponse();
}
