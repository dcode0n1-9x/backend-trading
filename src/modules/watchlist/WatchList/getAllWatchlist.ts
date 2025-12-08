import type { PrismaClient } from "../../../../generated/prisma/client";
import { WatchlistCreateArgs, WatchlistCreateInput } from "../../../../generated/prisma/models";
import { HttpResponse } from "../../../utils/response/success";


interface QueryParams {
    sequence: number;
}
interface IRegisterProp {
    prisma: PrismaClient;
    data: QueryParams;
    userId: string;
}

export async function getWatchListUser({ prisma, data, userId }: IRegisterProp) {
    try {
        let { sequence } = data;
        // If you expect only one default watchlist per user prefer findFirst
        const watchlist = await prisma.watchlist.findFirst({
            where: { userId, sequence },
            include: {
                groups: {
                    include: {
                        items: {
                            include: { instrument: true },
                            orderBy: { sortOrder: "asc" },
                        },
                    },
                    orderBy: { sortOrder: "asc" },
                },
            },
        });
        if (watchlist) {
            return new HttpResponse(200, "WATCHLIST_FOUND", watchlist).toResponse();
        }
        if(sequence > 1){
            return new HttpResponse(200 , "WATCHLIST_FOUND" , {
                id : `test-watchlist-${sequence}`,
                userId,
                name : `Watchlist Default ${sequence}`,
                isDefault : false,
                groups : []
            })
        }
        //! In case the user deletes the group and everything we create a new watchlist : Could break off.
        const topInstruments = await prisma.instrument.findMany({
            orderBy: { tickSize: "desc" },
            take: 5,
            select: { id: true },
        });
        const created = await prisma.watchlist.create<WatchlistCreateArgs>({
            data: {
                userId,
                name: "Default Watchlist",
                isDefault: true,
                sequence: 1,
                groups: {
                    create: {
                        name: "Default Group",
                        color: 1,
                        items: {
                            createMany: {
                                data: topInstruments.map((it, idx) => ({
                                    instrumentId: it.id,
                                    sortOrder: idx + 1,
                                })),
                            },
                        },
                    },
                },
            },
            include: {
                groups: {
                    include: {
                        items: {
                            include: { instrument: true },
                            orderBy: { sortOrder: "asc" },
                        },
                    },
                    orderBy: { sortOrder: "asc" },
                },
            },
        });

        return new HttpResponse(201, "WATCHLIST_CREATED", created).toResponse();
    } catch (err) {
        console.error("getWatchListUser error:", err);
        return new HttpResponse(500, "INTERNAL_ERROR").toResponse();
    }
}
