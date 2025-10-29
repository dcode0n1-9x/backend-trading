import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { PrismaClient } from "../../../generated/prisma";
import { config } from "../../config/generalconfig";

interface LoginData {
  email: string,
  password: string
}

interface ILoginProp {
  prisma: PrismaClient
  data: LoginData
}


export async function login({ prisma, data }: ILoginProp) {
  const { email, password } = data;
  const user = await prisma.user.findUnique({
    where: { email, OR: [{ password: { not: null } }] },
    select : { id :  true , password : true}
  });
  if (!user) {
    throw new Error("User not found");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password!);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }
  const token = jwt.sign({ userId: user.id }, config.JWT.SECRET, { expiresIn: config.JWT.EXPIRY_IN });
  return { token };
}