import type { PrismaClient } from "../../../../generated/prisma/client";
import { HttpResponse } from "../../../utils/response/success";


interface RegisterData {
    watchlistGroupId: string;
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
}

export async function deleteWatchGroup({ prisma, data }: IRegisterProp) {
    const { watchlistGroupId } = data;
    const deleteWatchGroup = await prisma.watchlistGroup.delete({
        where: { id: watchlistGroupId },
    });
    if (!deleteWatchGroup) {
        return new HttpResponse(500, "WATCHLIST_GROUP_DELETION_FAILED").toResponse();
    }
    return new HttpResponse(200, "WATCHLIST_GROUP_DELETED_SUCCESSFULLY", { watchlistGroupId: deleteWatchGroup.id }).toResponse();
}
