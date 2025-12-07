import type { PrismaClient } from "../../../generated/prisma/client";
import { config } from "../../config/generalconfig";
import { redis } from "../../config/redis/redis.config";
import { HttpResponse } from "../../utils/response/success";
import { generateOTP } from "../../utils/utils";

interface RegisterData {
    email: string;
    name: string
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
}

export async function sendOTPEmailVerification({ prisma, data }: IRegisterProp) {
    const { email, name } = data;
    const isUserExists = await prisma.user.findUnique({ where: { email } });
    if (isUserExists) {
        return new HttpResponse(201, "EMAIL_ALREADY_EXIST").toResponse();
    }
    const redisKey = `OTP:${email}`;
    const redisCount = `OTP_COUNT:${email}`;
    let counter = await redis.get(redisCount);
    if (Number(counter) > config.SMS.MAX_OTP_PER_DAY) {
        return new HttpResponse(429, "OTP_LIMIT_EXCEEDED").toResponse();
    }
    await redis.incr(redisCount);
    const OTP = generateOTP();
    //  sendEmail(email, OTP);  // Send OTP via EMAIL AND MAKE SURE TO USE THE NAME FOR THE RICH FEELING FOR THE USERS
    await redis.set(redisKey, JSON.stringify({
        OTP,
        name
    }), "EX", 900);
    return new HttpResponse(200, "OTP_SENT_SUCCESSFULLY").toResponse();
}


