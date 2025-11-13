import { Margin } from './../../../generated/prisma/index.d';
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
                phone,
                userVerification: {
                    create: {}
                },
                margin: {
                    createMany: {
                        data: [
                            { type: "EQUITY" },
                            { type: "COMMODITY" },
                        ]
                    }
                },
                dailyPnls: {
                    create: {}
                },
                portfolios : {
                    create: {}
                }
            },
            select: { id: true }
        });
        if (!createUser) {
            return new Error("USER_CREATION_FAILED");
        }
        return { userStage: "ZERO", id: createUser.id };
    }
    if (checkUser && checkUser.isVerified) {
        return new Error("USER_ALREADY_VERIFIED");
    }
    return { userStage: "ZERO", id: checkUser.id };

}
