import { PrismaClient } from "../../../generated/prisma";
import { redis } from "../../config/redis/redis.config";

interface RegisterData {
    email: string;
    otp: string;
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
    userId: string;
}

export async function signUpLayer0({
    prisma,
    data,
    userId
}: IRegisterProp) {
        const { email, otp } = data;
        const checkCache = await redis.get(`OTP:${email}`);
        if (!checkCache) {
            throw new Error("OTP_EXPIRED");
        }
        const cacheData = JSON.parse(checkCache)
        if (cacheData.OTP !== otp) {
            return new Error("INVALID_OTP");
        }
        const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: {
                    firstName: cacheData.name,
                    email: email
                },
            })
        if (!updatedUser) {
            throw new Error("USER_UPDATE_FAILED");
        }
        if (email) {
            // SEND KAFKA EMAIL EVENT AND LET
        }
    }
