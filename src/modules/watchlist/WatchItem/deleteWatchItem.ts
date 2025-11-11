import type { PrismaClient, Segment } from "../../../../generated/prisma";
import { HttpResponse } from "../../../utils/response/success";


interface RegisterData {
    watchlistItemId: string;
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
}

export async function deleteWatchlistItem({ prisma, data }: IRegisterProp) {
    const { watchlistItemId } = data;
    const deleteWatchItem = await prisma.watchlistItem.delete({
        where: { id: watchlistItemId},
    });
    if (!deleteWatchItem) {
        return new HttpResponse(500, "WATCHLIST_ITEM_DELETION_FAILED").toResponse();
    }
    return new HttpResponse(200, "WATCHLIST_ITEM_DELETED_SUCCESSFULLY", { watchlistItemId: deleteWatchItem.id }).toResponse();
}
