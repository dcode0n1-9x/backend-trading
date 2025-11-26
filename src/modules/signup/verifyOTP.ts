
import type { PrismaClient } from "../../../generated/prisma/client";
import { redis } from "../../config/redis/redis.config";

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
        throw new Error("INVALID_OTP");
    }
    const checkUser = await prisma.user.findUnique({
        where: { phone }, select: {
            isVerified: true, id: true, userVerification: {
                select: { stage: true }
            }
        }
    });
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
                portfolios: {
                    create: {}
                }
            },
            select: { id: true }
        });
        if (!createUser) {
            return new Error("USER_CREATION_FAILED");
        }
        await redis.del(`OTP:${phone}`);
        return { userStage: "ZERO", id: createUser.id };
    }
    if (checkUser && checkUser.isVerified) {
        return new Error("USER_ALREADY_VERIFIED");
    }
    return { userStage: checkUser.userVerification?.stage || "ZERO", id: checkUser.id };
}
