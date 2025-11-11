import { Elysia } from "elysia";
import { prisma } from "../db/index";
import { passwordValidator } from "../utils/validator";
import { forgetPassword } from "../modules/forget-password/forgetPassword";
import { verifyOTPAfterForgetPassword } from "../modules/forget-password/verifyForgetPassword";
import { HttpResponse } from "../utils/response/success";

export const forgetPasswordRoutes = new Elysia({
    name: "Forget Password",
    detail: {
        tags: ["Forget Password"],
        description: "APIs related to user forget password"
    }
})
    .use(passwordValidator)
    .post(
        "/forget-password",
        async ({ body, redirect }) => {
            const response = await forgetPassword({
                prisma,
                data: body,
            });
            if (response instanceof Error) {
                return new HttpResponse(400, response.message).toResponse();
            }
            const { resetToken } = response;
            redirect(`/reset-password?token=${resetToken}`);
        },
        {
            body: "auth.forgetpassword",
            detail : {
                summary : "Initiate Forget Password",
                description: "Initiates the forget password process by sending a reset token to the user's registered email address."
            }
        }
    )
    .put(
        "/verify-otp-forget-password",
        async ({ body }) => {
            return await verifyOTPAfterForgetPassword({
                prisma,
                data: body,
            });
        },
        {
            body: "auth.verifyotp.forgetpassword",
            detail : {
                summary : "Verify OTP for Forget Password",
                description: "Verifies the OTP sent to the user during the forget password process and allows the user to reset their password."
            }
        }
    );

