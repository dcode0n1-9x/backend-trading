import type { PrismaClient } from "../../../../generated/prisma/client";
import { HttpResponse } from "../../../utils/response/success";


interface RegisterData {
    name: string;
    sequence: number;
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
    userId: string;
}

export async function createWatchList({ prisma, data, userId }: IRegisterProp) {
    const { name, sequence } = data;
    if (sequence > 1) {
        const create = await prisma.watchlist.create({
            data: {
                userId,
                name,
                sequence
            }
        });
        if (!create) {
            return new HttpResponse(500, "WATCHLIST_CREATION_FAILED").toResponse();
        }
        return new HttpResponse(200, "WATCHLIST_CREATED_SUCCESSFULLY", { watchlistId: create.id }).toResponse();
    }
    return new HttpResponse(400, "ALREADY_CREATED").toResponse();
}
