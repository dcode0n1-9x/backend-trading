import type { PrismaClient, Segment } from "../../../generated/prisma";
import { config } from "../../config/generalconfig";
import { redis } from "../../config/redis/redis.config";
import { HttpResponse } from "../../utils/response/success";
import { sendSMS } from "../../utils/sendOTP_viaPhone";
import { generateOTP } from "../../utils/utils";

interface RegisterData {
    panNumber: string,
    dob: string
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
}

export async function signUpLayer1({ prisma, data }: IRegisterProp) {
    const { panNumber , dob } = data;
    const isUserExists = await prisma.user.findUnique({ where: { phone } });
}


