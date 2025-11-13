import type { PrismaClient } from "../../../../generated/prisma";
import { HttpResponse } from "../../../utils/response/success";


interface RegisterData {
    name: string;
    watchlistId: string;
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
}

export async function createWatchListGroup({ prisma, data }: IRegisterProp) {
    try {
        const createWatchGroup = await prisma.watchlistGroup.create({
            data: {
                name: data.name,
                watchlistId: data.watchlistId,
            }
        });
        if (!createWatchGroup) {
            return new HttpResponse(500, "WATCHLIST_GROUP_CREATION_FAILED").toResponse();
        }
        return new HttpResponse(200, "WATCHLIST_GROUP_CREATED_SUCCESSFULLY", { watchlistGroupId: createWatchGroup.id }).toResponse();
    } catch (error) {
        return new HttpResponse(500, "WATCHLIST_GROUP_CREATION_FAILED").toResponse();
    }
}
