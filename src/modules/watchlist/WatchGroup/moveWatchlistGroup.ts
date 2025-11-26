import type { PrismaClient } from "../../../../generated/prisma/client";
import { HttpResponse } from "../../../utils/response/success";


interface RegisterData {
    watchListId: string;
    groupId :  string;
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
}

export async function moveWatchlistGroup({ prisma, data }: IRegisterProp) {
    const { watchListId, groupId } = data;
    const updatedWatchGroup = await prisma.watchlistGroup.update({
        where: { id: groupId },
        data : {
            watchlistId : watchListId
        }
    });
    if (!updatedWatchGroup) {
        return new HttpResponse(500, "WATCHGROUP_UPDATE_FAILED").toResponse();
    }
    return new HttpResponse(200, "WATCHGROUP_UPDATED_SUCCESSFULLY", { watchgroupId: updatedWatchGroup.id }).toResponse();
}
