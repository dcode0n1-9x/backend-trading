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
      id: true,
      verification: {
        select: {
          stage: true
        }
      }
    }
  });
  if (isUserExists) {
    return { details: { userStage: isUserExists.verification?.stage, phone, id : isUserExists.id}, code: 201, message: "USER_ALREADY_EXISTS" }
  }
  const redisKey = `OTP:${phone}`;
  const redisCount = `OTP_COUNT:${phone}`;
  let counter = await redis.get(redisCount);
  if (Number(counter) > config.SMS.MAX_OTP_PER_DAY) {
    return { code: 429, message: "OTP_LIMIT_EXCEEDED" };
  }
  await redis.incr(redisCount);
  const OTP = generateOTP();
  //  sendSMS(phone, OTP);  // Send OTP via SMS
  await redis.set(redisKey, OTP, "EX", 900);
  return {  code: 200, message: "OTP_SENT_SUCCESSFULLY" };
}


