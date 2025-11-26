import type { PrismaClient} from "../../../../generated/prisma/client";
import { HttpResponse } from "../../../utils/response/success";


interface RegisterData {
    name: string;
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
    userId: string;
}

export async function createWatchList({ prisma, data, userId }: IRegisterProp) {
    const { name } = data;
    const create = await prisma.watchlist.create({
        data: {
            userId,
            name,
        }
    });
    if (!create) {
        return new HttpResponse(500, "WATCHLIST_CREATION_FAILED").toResponse();
    }
    return new HttpResponse(200, "WATCHLIST_CREATED_SUCCESSFULLY", { watchlistId: create.id }).toResponse();
}
