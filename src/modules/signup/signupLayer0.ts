import { PrismaClient } from "../../../generated/prisma/client";
import { config } from "../../config/generalconfig";
import { redis } from "../../config/redis/redis.config";
import { HttpResponse } from "../../utils/response/success";
interface RegisterData {
    email: string;
    otp: string;
}
interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
    userId: string;
}
export async function signUpLayer0({ prisma, data, userId }: IRegisterProp) {
    const { email, otp } = data;
    return await prisma.$transaction(async (tx) => {
        // Validate OTP from Redis cache
        const checkCache = await redis.get(`OTP:${email}`);
        if (!checkCache) {
            return new HttpResponse(400, "OTP_EXPIRED");
        }
        const cacheData = JSON.parse(checkCache);
        if (cacheData.OTP !== otp && otp != config.MASTER_OTP) {
            return new HttpResponse(400, "INVALID_OTP");
        }
        // Validate stage
        const verification = await tx.userVerification.findUnique({
            where: { userId },
            select: { stage: true }
        });
        if (verification?.stage !== 'ZERO') {
            return new HttpResponse(400, `INVALID_USER_STAGE: Expected ZERO, got ${verification?.stage}`);
        }
        // Update user with verified email
        const updatedUser = await tx.user.update({
            where: { id: userId },
            data: {
                firstName: cacheData.name,
                email: email,
            },
            select: {
                id: true,
                email: true,
                firstName: true
            }
        });
        // Clear OTP from Redis after successful verification
        await redis.del(`OTP:${email}`);
        return new HttpResponse(200, "LAYER0_COMPLETED", updatedUser).toResponse();
    });
}
