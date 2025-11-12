import { hash } from "bcrypt";
import type { PrismaClient } from "../../../generated/prisma";
import { redis } from "../../config/redis/redis.config";
import { HttpResponse } from "../../utils/response/success";

interface RegisterData {
    token: string;
    password: string;
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
}

export async function verifyOTPAfterForgetPassword({ prisma, data }: IRegisterProp) {
    const { token, password } = data;
    const checkCache = await redis.get(`OTP-FORGET-PASSWORD:${token}`);
    if (!checkCache) {
        throw new Error("OTP_EXPIRED");
    }
    const hashedPassword = await hash(password, 10);
    const { userId } = JSON.parse(checkCache);
    const update = await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
        select: { id: true }
    });
    return new HttpResponse(200, "PASSWORD_RESET_SUCCESSFUL", { userId: update.id }).toResponse();
}
