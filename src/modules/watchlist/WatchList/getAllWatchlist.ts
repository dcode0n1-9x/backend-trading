import type { PrismaClient } from "../../../../generated/prisma/client";
import { HttpResponse } from "../../../utils/response/success";

interface IRegisterProp {
    prisma: PrismaClient;
    userId: string;
}

export async function getWatchListUser({ prisma, userId }: IRegisterProp) {
    try {
        // If you expect only one default watchlist per user prefer findFirst
        const watchlist = await prisma.watchlist.findFirst({
            where: { userId },
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
        //! In case the user deletes the group and everything we create a new watchlist : Could break off.
        const topInstruments = await prisma.instrument.findMany({
            orderBy: { tickSize: "desc" },
            take: 5,
            select: { id: true },
        });
        const created = await prisma.watchlist.create({
            data: {
                userId,
                name: "Default Watchlist",
                isDefault: true,
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
