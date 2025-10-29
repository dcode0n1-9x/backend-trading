import jwt from "jsonwebtoken";
import type { Elysia } from "elysia";
import { JWT_SECRET } from "../env";

export const authMiddleware = (app: Elysia) =>
  app.derive(async ({ request, set }) => {
    const accessToken = request.headers.get("Authorization");

    if (!accessToken) {
      set.status = 401;
      throw new Error("Authentication required");
    }

    const decodedUser = jwt.verify(accessToken, JWT_SECRET) as {
      id: string;
      email: string;
      username: string;
      iat: number;
      exp: number
    };
    
    const now = Math.floor(Date.now() / 1000);

    if(decodedUser.exp < now){
      set.status = 401;
      throw new Error("Invalid or expired token");
    }

    const payload = jwt.decode(accessToken) as { id: string, email: string, iat: number, exp: number };;
    if (!payload) {
      return { success: false, userId: null };
    }

    return {
      user: { id: payload.id }
    };
  });
