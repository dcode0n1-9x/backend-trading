import type { PrismaClient } from "../../../generated/prisma";
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
  const isUserExists = await prisma.user.findUnique({ where: { phone } });
  if (isUserExists)
    return new HttpResponse(201, "USER_ALREADY_EXISTS").toResponse();
  const redisKey = `OTP:${phone}`;
  const redisCount = `OTP_COUNT:${phone}`;
  let counter = await redis.get(redisCount);
  console.log("OTP counter:", counter);
  if (Number(counter) > config.SMS.MAX_OTP_PER_DAY) {
    return new HttpResponse(429, "OTP_LIMIT_EXCEEDED").toResponse();
  }
  redis.incr(redisCount);
  if (counter === null) {
    await redis.expire(redisCount, 86400);
  }
  const OTP = generateOTP();
  //  sendSMS(phone, OTP);  // Send OTP via SMS
  await redis.set(redisKey, OTP, "EX", 90000);
  return new HttpResponse(200, "OTP_SENT_SUCCESSFULLY").toResponse();
}


