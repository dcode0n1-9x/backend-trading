import type { PrismaClient } from "../../../../generated/prisma/client";
import { HttpResponse } from "../../../utils/response/success";


interface RegisterData {
    watchlistItemId: string;
    sortOrder?: number;
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
}

export async function updateWatchlistItem({ prisma, data }: IRegisterProp) {
    const { watchlistItemId, sortOrder } = data;
    const updateData: Partial<{ groupId: string; instrumentId: string, sortOrder: number }> = {};
    if (sortOrder) updateData.sortOrder = sortOrder;
    const updatedWatchlistItem = await prisma.watchlistItem.update({
        where: { id: watchlistItemId },
        data: updateData
    });
    if (!updatedWatchlistItem) {
        return new HttpResponse(500, "WATCHLIST_ITEM_UPDATE_FAILED").toResponse();
    }
    return new HttpResponse(200, "WATCHLIST_ITEM_UPDATED_SUCCESSFULLY", { watchlistItemId: updatedWatchlistItem.id }).toResponse();
}
