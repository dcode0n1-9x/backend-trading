import type { PrismaClient } from "../../../../generated/prisma/client";
import { HttpResponse } from "../../../utils/response/success";

interface IRegisterProp {
    prisma: PrismaClient;
    userId: string;
}

export async function getWatchListUser({ prisma, userId }: IRegisterProp) {
    let watchlist = await prisma.watchlist.findMany({
        where: {
            userId,
        },
        include: {
            groups: {
                include: {
                    items: {
                        include: {
                            instrument: true
                        },
                        orderBy: {
                            sortOrder: 'asc' // Order items within each group
                        }
                    }
                },
                orderBy: {
                    sortOrder: 'asc' 
                }
            }
        }
    });
    if (!watchlist) {
        return new HttpResponse(404, "WATCHLIST_NOT_FOUND").toResponse();
    }
    return new HttpResponse(200, "WATCHLIST_FOUND", watchlist).toResponse();
}
