import type { PrismaClient } from "../../../generated/prisma";
import { config } from "../../config/generalconfig";
import { redis } from "../../config/redis/redis.config";
import { errors, handleResponse } from "../../utils/responseCodec";
import { sendSMS } from "../../utils/sendOTP_viaPhone";
import { generateOTP } from "../../utils/utils";

interface RegisterData {
  phone: string
}

interface IRegisterProp {
  prisma: PrismaClient;
  data: RegisterData;
}

export async function sendOTPViaPhoneSignup({ prisma, data }: IRegisterProp) {
  const { phone } = data;
  const isUserExists = await prisma.user.findUnique({ where: { phone } });
  if (isUserExists)
    return handleResponse(409, errors.user_exist);
  const redisKey = `OTP:${phone}`;
  const redisCount = `OTP_COUNT:${phone}`;
  let counter = await redis.get(redisCount);
  console.log("OTP counter:", counter);
  if (Number(counter) > config.SMS.MAX_OTP_PER_DAY) {
    return handleResponse(429, errors.otp_limit_exceeded);
  }
  redis.incr(redisCount);
  if (counter === null) {
    await redis.expire(redisCount, 86400);
  }
  const OTP = generateOTP();
  //  sendSMS(phone, OTP);
  await redis.set(redisKey, OTP, "EX", 90000);
  return true;
}


