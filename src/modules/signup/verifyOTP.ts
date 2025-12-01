
import type { PrismaClient } from "../../../generated/prisma/client";
import { config } from "../../config/generalconfig";
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
        return { message: "OTP_EXPIRED", code: 400 };
    }
    if (checkCache != otp && otp != config.MASTER_OTP) {
        return { message: "INVALID_OTP", code: 400 };
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
            return { message: "USER_CREATION_FAILED", code: 500 };
        }
        await redis.del(`OTP:${phone}`);
        return { userStage: "ZERO", id: createUser.id };
    }
    if (checkUser && checkUser.isVerified) {
        return { message: "USER_ALREADY_VERIFIED", code: 400 };
    }
    return { details: { userStage: checkUser.userVerification?.stage || "ZERO", id: checkUser.id } ,  code: 200  , message : "OTP_VERIFIED_SUCCESSFULLY"};
}
