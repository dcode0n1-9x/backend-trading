import type { PrismaClient } from "../../../generated/prisma";
import { redis } from "../../config/redis/redis.config";
import { HttpResponse } from "../../utils/response/success";

interface RegisterData {
    phone: string
    otp: string
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
}

export async function verifyOTP({ prisma, data }: IRegisterProp) {
    const { otp, phone } = data;
    const checkCache = await redis.get(`OTP:${phone}`);
    if (!checkCache) {
        return new HttpResponse(400, "OTP_EXPIRED").toResponse();
    }
    if (checkCache !== otp) {
        return new HttpResponse(400, "INVALID_OTP").toResponse();
    }
    const checkUser = await prisma.user.findUnique({ where: { phone }, select: { isVerified: true, id: true } });
    if (checkUser && checkUser.isVerified) {
        return new HttpResponse(409, "USER_ALREADY_VERIFIED").toResponse();
    }
    if (checkUser && !checkUser.isVerified) {
        await prisma.userVerification.findUniqueOrThrow({ where: { userId: checkUser.id } });
        const user = await prisma.user.create({
            data: { phone },
        });
        return new HttpResponse(201, "USER_CREATED", user).toResponse();
    }


