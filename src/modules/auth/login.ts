import { compare } from "bcryptjs";
import type { PrismaClient } from "../../../generated/prisma/client";
import { config } from "../../config/generalconfig";

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
    return { message: "USER_NOT_FOUND", code: 404 };
  }
  if (!user.isActive) {
    // throw new HttpResponse(403, "USER_INACTIVE");
    return { message: "USER_INACTIVE", code: 403 };
  }
  // const checkPassword = password === user.password;
  // if (!checkPassword) {
  //   throw new HttpResponse(401, "INVALID_PASSWORD");
  // }
  const isPasswordValid = await compare(password, user.password!);
  if (!isPasswordValid) {
    return { message: "INVALID_PASSWORD", code: 401 };
  }
  if (user.kycStatus !== "VERIFIED") {
    return { message: "KYC_NOT_APPROVED", code: 403, details: { kycStatus: user.kycStatus } };
  }
  // return new HttpResponse(200, "LOGIN_SUCCESSFUL", { accessToken, refreshToken }).toResponse();
  return { message: "LOGIN_SUCCESSFUL", details: { userId: user.id }, code: 200 };
}