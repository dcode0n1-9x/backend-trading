import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import type { PrismaClient } from "../../../generated/prisma/client";
import { config } from "../../config/generalconfig";
import { HttpResponse } from "../../utils/response/success";

interface LoginData {
  phone?: string,
  email?: string,
  password: string
}

interface ILoginProp {
  prisma: PrismaClient
  data: LoginData
}


export async function login({ prisma, data }: ILoginProp) {
  const { email, phone, password } = data;
  const user = await prisma.user.findFirst({
    where: { OR: [{ email }, { phone }], password: { not: null } },
    select: { id: true, password: true, isActive: true, kycStatus: true }
  });
  if (!user) {
    throw new HttpResponse(404, "USER_NOT_FOUND");
  }
  if (!user.isActive) {
    throw new HttpResponse(403, "USER_INACTIVE");
  }
  // const checkPassword = password === user.password;
  // if (!checkPassword) {
  //   throw new HttpResponse(401, "INVALID_PASSWORD");
  // }
  const isPasswordValid = await compare(password, user.password!);
  if (!isPasswordValid) {
    throw new HttpResponse(401, "INVALID_PASSWORD");
  }
  if (user.kycStatus !== "VERIFIED") {
    throw new HttpResponse(403, "KYC_NOT_APPROVED", { kycStatus: user.kycStatus });
  }
  const accessToken = jwt.sign({ userId: user.id }, config.JWT.SECRET, { expiresIn: config.JWT.EXPIRY_IN });
  const refreshToken = jwt.sign({ userId: user.id }, config.JWT.REFRESH_SECRET, { expiresIn: config.JWT.REFRESH_EXPIRY_IN });
  return new HttpResponse(200, "LOGIN_SUCCESSFUL", { accessToken, refreshToken }).toResponse();
}