import type { PrismaClient } from "../../../generated/prisma";
import { redis } from "../../config/redis/redis.config";
import { errors, handleResponse } from "../../utils/responseCodec";

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
        return handleResponse(400, errors.otp_expired);
    }
    if (checkCache !== otp) {
        return handleResponse(400, errors.invalid_otp);
    }
    const isUserExists = await prisma.user.findUnique({ where: { phone } });
    if (isUserExists)
        return handleResponse(409, errors.user_exist);
    const user = await prisma.user.create({
        data: { phone },
    });
    return { user }
}


