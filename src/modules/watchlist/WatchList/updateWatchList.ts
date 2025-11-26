import type { PrismaClient } from "../../../../generated/prisma/client";
import { HttpResponse } from "../../../utils/response/success";


interface RegisterData {
    name: string;
    watchlistId: string;
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
    userId: string;
}

export async function updateWatchList({ prisma, data  }: IRegisterProp) {
    const { name, watchlistId } = data;
    try {
        const updateWatchList = await prisma.watchlist.update({
            where: { id: watchlistId },
            data: { name }
        });
        if (!updateWatchList) {
            return new HttpResponse(500, "WATCHLIST_UPDATE_FAILED").toResponse();
        }
        return new HttpResponse(200, "WATCHLIST_UPDATED_SUCCESSFULLY", { watchlistId: updateWatchList.id }).toResponse();
    }catch (error) {
        return new HttpResponse(500, "WATCHLIST_UPDATE_FAILED").toResponse();
    }
}
