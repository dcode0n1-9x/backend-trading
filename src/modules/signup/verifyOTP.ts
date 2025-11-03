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
        throw new Error("OTP_EXPIRED");
    }
    if (checkCache !== otp) {
        return new Error("INVALID_OTP");
    }
    const checkUser = await prisma.user.findUnique({ where: { phone }, select: { isVerified: true, id: true } });
    if (!checkUser) {
        const createUser = await prisma.user.create({
            data: {
                phone
            }
        })
        if (!createUser) {
            return new Error("USER_CREATION_FAILED");
        }   
        return { userStage: "ZERO", id: createUser.id };
    }
    if (checkUser && checkUser.isVerified) {
        return new Error("USER_ALREADY_VERIFIED");
    }
    if (checkUser && !checkUser.isVerified) {
        const check = await prisma.userVerification.create({ data: { userId: checkUser.id, stage: "ZERO" }, select: { stage: true, id: true } });
        return { userStage: check.stage, id: checkUser.id };
    }
    return { userStage: "ZERO" , id: checkUser.id };

}
