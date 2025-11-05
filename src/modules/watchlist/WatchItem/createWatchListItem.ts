import type { PrismaClient } from "../../../../generated/prisma";
import { HttpResponse } from "../../../utils/response/success";


interface RegisterData {
    groupId: string;
    instrumentId: string;
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
}

export async function createWatchListItem({ prisma, data }: IRegisterProp) {
    const { groupId, instrumentId } = data;
    const createWatchListItem = await prisma.watchlistItem.create({
        data: {
            groupId,
            instrumentId,
        }
    });
    if (!createWatchListItem) {
        return new HttpResponse(500, "WATCHLIST_ITEM_CREATION_FAILED").toResponse();
    }
    return new HttpResponse(200, "WATCHLIST_ITEM_CREATED_SUCCESSFULLY", { watchlistItemId: createWatchListItem.id }).toResponse();
}
