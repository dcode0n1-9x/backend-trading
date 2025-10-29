import { Elysia, t } from "elysia";
import { prisma } from "../db/index";
import { signUpBody } from "../utils/validator";
// import { setAuthCookies } from "../utils/setCookies";
import { sendOTPViaPhoneSignup } from "../modules/signup/sendOTPSignup";
import { errors, success } from "../utils/responseCodec";
import { verifyOTP } from "../modules/signup/verifyOTP";

export const signUpRouter = new Elysia({
  name: "sign-up",
  prefix: "/sign-up",
})
  .use(signUpBody)
  .post(
    "/send-otp",
    async ({ body }) => {
      try {
        await sendOTPViaPhoneSignup({
          prisma,
          data: body,
        });
        return success.user_create;
      } catch (error) {
        return errors.user_create;
      }
    },
    {
      body: "auth.signup.sendotp",
    }
  )
  .post(
    "/verify-otp",
    async ({ body , status}) => {
      try {
        const result = await verifyOTP({
          prisma,
          data: body,
        });
        return status(200, result);
      } catch (error) {
        return error;
      }
    },
    {
      body: "auth.signup.verifyotp",
    }
  );

