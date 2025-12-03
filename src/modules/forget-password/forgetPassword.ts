import type { PrismaClient } from "../../../generated/prisma/client";
import { config } from "../../config/generalconfig";
import { redis } from "../../config/redis/redis.config";
import { HttpResponse } from "../../utils/response/success";
import crypto from "crypto";

interface RegisterData {
    email?: string;
    phone?: string;
    panNumber: string;
    receiveOn: "EMAIL" | "SMS";
}
interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
}
export async function forgetPassword({ prisma, data }: IRegisterProp) {
    const { phone, email, panNumber, receiveOn } = data;

    const whereClause: any[] = [{ panNumber }];
    if (phone) whereClause.push({ phone });
    if (email) whereClause.push({ email })

    const user = await prisma.user.findFirst({
        where: { AND: whereClause },
        select: { id: true, email: true, phone: true }
    });

    if (!user) {
        throw new Error("USER_NOT_FOUND");
    }

    const contactIdentifier = receiveOn === "EMAIL"
        ? (user.email || email)
        : (user.phone || phone);

    if (!contactIdentifier) {
        throw new Error("CONTACT_METHOD_NOT_AVAILABLE");
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    const redisKey = `OTP-FORGET-PASSWORD:${resetToken}`;
    const redisCount = `OTP-FORGET-PASSWORD-COUNT:${resetToken}`;

    const counter = await redis.get(redisCount);
    if (counter && Number(counter) >= config.SMS.MAX_OTP_FORGET_PASSWORD_PER_DAY) {
        throw new Error("OTP_LIMIT_EXCEEDED");
    }

    await redis.incr(redisCount);
    await redis.expire(redisCount, 86400);
    if (receiveOn === "SMS") {
        // sendSMS    ?token=${resetToken}
    } else {
        // sendEmail  ?token=${resetToken}
    }
    await redis.set(redisKey, JSON.stringify({
        resetToken,
        userId: user.id
    }), "EX", 900);
    return {
        resetToken
        // Frontend will redirect to: /reset-password?token=${resetToken}
    };
}
