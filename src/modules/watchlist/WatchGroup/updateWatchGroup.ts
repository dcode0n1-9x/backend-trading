import type { PrismaClient } from "../../../../generated/prisma";
import { HttpResponse } from "../../../utils/response/success";


interface RegisterData {
    color?: number;
    name?: string;
    sortOrder?: number;
    watchListGroupId: string;
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
}

export async function updateWatchGroup({ prisma, data }: IRegisterProp) {
    const { name, watchListGroupId , color} = data;
    const updateData: Partial<{ name: string; color: number , sortOrder : number }> = {};
    if (name) updateData.name = name;
    if (color) updateData.color = color;
    if (data.sortOrder) updateData.sortOrder = data.sortOrder;
    const updatedWatchGroup = await prisma.watchlistGroup.update({
        where: { id: watchListGroupId },
        data: updateData
    });
    if (!updatedWatchGroup) {
        return new HttpResponse(500, "WATCHGROUP_UPDATE_FAILED").toResponse();
    }
    return new HttpResponse(200, "WATCHGROUP_UPDATED_SUCCESSFULLY", { watchgroupId: updatedWatchGroup.id }).toResponse();
}
