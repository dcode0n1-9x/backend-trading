import type { PrismaClient } from "../../../generated/prisma/client";
import { config } from "../../config/generalconfig";
import { redis } from "../../config/redis/redis.config";
import { HttpResponse } from "../../utils/response/success";
import { generateOTP } from "../../utils/utils";

interface RegisterData {
  phone: string
}

interface IRegisterProp {
  prisma: PrismaClient;
  data: RegisterData;
}

export async function sendOTP({ prisma, data }: IRegisterProp) {
  const { phone } = data;
  const isUserExists = await prisma.user.findUnique({
    where: { phone }, select: {
      userVerification: {
        select: {
          stage: true
        }
      }
    }
  });
  if (isUserExists) {
    return new HttpResponse(201, "USER_ALREADY_EXISTS", { userStage: isUserExists.userVerification?.stage }).toResponse();
  }
  const redisKey = `OTP:${phone}`;
  const redisCount = `OTP_COUNT:${phone}`;
  let counter = await redis.get(redisCount);
  if (Number(counter) > config.SMS.MAX_OTP_PER_DAY) {
    return new HttpResponse(429, "OTP_LIMIT_EXCEEDED").toResponse();
  }
  await redis.incr(redisCount);
  const OTP = generateOTP();
  //  sendSMS(phone, OTP);  // Send OTP via SMS
  await redis.set(redisKey, OTP, "EX", 900);
  return new HttpResponse(200, "OTP_SENT_SUCCESSFULLY").toResponse();
}


