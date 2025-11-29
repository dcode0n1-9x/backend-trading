import type { PrismaClient, ProductType, Prisma } from "../../../generated/prisma/client";
import { HttpResponse } from "../../utils/response/success";

interface GetHoldingData {
    sort?: 'asc' | 'desc';
    cursor?: string; // Holding ID for cursor pagination
    limit?: number;
    search?: string;
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: GetHoldingData;
}

export async function getAllInstrument({ prisma, data }: IRegisterProp) {
    const { search, cursor, sort = 'desc', limit = 20 } = data;
    const whereClause: Prisma.InstrumentWhereInput = {
        ...(search && {
            OR: [
                { instrumentToken: { contains: search, mode: 'insensitive' } },
                { exchangeToken: { contains: search, mode: 'insensitive' } },
                { name: { contains: search, mode: 'insensitive' } },
                { tradingSymbol: { contains: search, mode: 'insensitive' } },
            ]
        })
    };

    // Cursor-based pagination query
    const instruments = await prisma.instrument.findMany({
        where: whereClause,
        orderBy: {
            createdAt: sort
        },
        ...(cursor && {
            cursor: { id: cursor },
            skip: 1 // Skip the cursor itself
        }),
        take: limit,
        select : {
            instrumentToken: true,
            exchangeToken: true,
            name: true,
            segment: true,
            tradingSymbol: true,
            exchange: true,
            instrumentType: true,
            id: true,
        }
    });

    if (!instruments || instruments.length === 0) {
        return new HttpResponse(404, "INSTRUMENT_NOT_FOUND", {
            instruments: [],
            pagination: {
                nextCursor: null,
                hasMore: false,
                count: 0
            }
        }).toResponse();
    }

    // Calculate next cursor
    const nextCursor = instruments.length === limit ? instruments[instruments.length - 1].id : null;

    return new HttpResponse(200, "INSTRUMENT_FOUND", {
        instruments,
        pagination: {
            nextCursor,
            hasMore: instruments.length === limit,
            count: instruments.length
        }
    }).toResponse();
}
