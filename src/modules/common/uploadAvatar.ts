

import type { PrismaClient } from "../../../generated/prisma/client";
import { HttpResponse } from "../../utils/response/success";


interface RegisterData {
    avatar: string
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
    userId: string;
}

export async function uploadAvatar({ prisma, data, userId }: IRegisterProp) {
    const { avatar} = data;
    const updateUser = await prisma.user.update({
        where: { id: userId },
        data: {
            avatar
        }
    });
    if (!updateUser) {
        throw new Error("AVATAR_UPLOAD_FAILED");
    }
    return new HttpResponse(200, "AVATAR_UPLOADED_SUCCESSFULLY", { avatar: updateUser.avatar }).toResponse();
}
