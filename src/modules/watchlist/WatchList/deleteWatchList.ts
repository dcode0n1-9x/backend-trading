import type { PrismaClient, Segment } from "../../../../generated/prisma";
import { HttpResponse } from "../../../utils/response/success";


interface RegisterData {
    watchlistId: string;
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
}

export async function deleteWatchList({ prisma, data }: IRegisterProp) {
    const { watchlistId } = data;
    const deleteWatchList = await prisma.watchlist.delete({
        where: { id: watchlistId },
    });
    if (!deleteWatchList) {
        return new HttpResponse(500, "WATCHLIST_DELETION_FAILED").toResponse();
    }
    return new HttpResponse(200, "WATCHLIST_DELETED_SUCCESSFULLY", { watchlistId: deleteWatchList.id }).toResponse();
}
