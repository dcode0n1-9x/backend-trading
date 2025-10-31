import type { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { config } from "../config/generalconfig";


export const authMiddleware = (app: Elysia) =>
  app
    .use(
      jwt({
        name: "jwt",
        secret: config.JWT.SECRET, // Use your config secret
        exp: "7d",
      })
    )
    .derive(async ({ cookie , set, jwt }) => {
      const token = cookie.auth.value as string | undefined;
      if (!token) {
        set.status = 401;
        throw new Error("Authentication required");
      }
      const payload = await jwt.verify(token);
      console.log(payload)

      if (!payload) {
        set.status = 401;
        throw new Error("Invalid or expired token");
      }

      // Type assertion for your payload structure
      const decodedUser = payload as {
        userId: string;
        phone: string;
        stage: string;
        iat: number;
        exp: number;
      };

      return {
        user: {
          id: decodedUser.userId,
          phone: decodedUser.phone,
          stage: decodedUser.stage,
        },
      };
    });
