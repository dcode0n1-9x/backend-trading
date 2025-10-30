import { Elysia, t } from "elysia";
import { prisma } from "../db/index";
import { signUpValidator } from "../utils/validator";
// import { setAuthCookies } from "../utils/setCookies";
import { sendOTP } from "../modules/signup/sendOTP";
import { verifyOTP } from "../modules/signup/verifyOTP";

export const signUpRouter = new Elysia({
  name: "sign-up",
  prefix: "/sign-up",
})
  .use(signUpValidator)
  .post(
    "/send-otp",
    async ({ body }) => {
      return await sendOTP({
          prisma,
          data: body,
        });
    },
    {
      body: "auth.signup.sendotp",
    }
  )
  .post(
    "/verify-otp",
    async ({ body }) => {
      return await verifyOTP({
        prisma,
        data: body,
      });
    },
    {
      body: "auth.signup.verifyotp",
    }
  );

