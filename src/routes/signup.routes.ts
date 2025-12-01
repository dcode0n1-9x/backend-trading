import { Elysia } from "elysia";
import { prisma } from "../db/index";
import { signUpValidator } from "../utils/validator";
// import { setAuthCookies } from "../utils/setCookies";
import { sendOTP } from "../modules/signup/sendOTP";
import { jwt } from "@elysiajs/jwt";
import { verifyOTP } from "../modules/signup/verifyOTP";
import { HttpResponse } from "../utils/response/success";
import { authMiddleware } from "../middleware/authMiddleware";
import { config } from "../config/generalconfig";
import { presignedURLSignature } from "../modules/signup/presignedURLSignature";
import { sendOTPEmailVerification } from "../modules/signup/sendOTPEmailVerification";
import { signUpLayer0 } from "../modules/signup/signupLayer0";
import { signUpLayer1 } from "../modules/signup/signupLayer1";
import { signUpLayer2 } from "../modules/signup/signupLayer2";
import { signUpLayer3A } from "../modules/signup/signUpLayer3A";
import { signUpLayer3B } from "../modules/signup/signUpLayer3B";
import { signUpLayer3C } from "../modules/signup/signUpLayer3C";
import { signUpLayer4A } from "../modules/signup/signUpLayer4A";
import { signUpLayer4B } from "../modules/signup/signUpLayer4B";
import { getCurrentStage } from "../modules/signup/getCurrentStage";
import { presignedURLWebCamera } from "../modules/signup/presignedURLWebCamera";

export const signUpRouter = new Elysia({
  name: "sign-up",
  prefix: "/sign-up",
  detail: {
    tags: ["Sign-up"],
    description: "APIs related to user sign-up process"
  }
})
  .use(signUpValidator)
  .use(jwt({
    name: 'accessToken',
    secret: config.JWT.SECRET, // Replace with your actual secret key
    exp: '7d'
  }))
  .post(
    "/send-otp",
    async ({ body, accessToken, cookie: { "x-access-token": auth } }) => {
      try {
        const response = await sendOTP({
          prisma,
          data: body,
        })
        if (response && response.code == 201 && response.details?.userStage) {
          const token = await accessToken.sign(
            {
              userId: response.details.id,
              phone: body.phone,
              stage: response.details.userStage,
            },
          );
          auth.set({
            value: token,
            httpOnly: false,   // allow frontend to read cookie during debugging
            secure: false,     // localhost = MUST be false
            maxAge: 86400,
            sameSite: "lax",
            path: "/",         // always good
          });
        }
        if (response && response.code && response.code >= 202) {
          return new HttpResponse(response.code, response.message).toResponse();
        }
        return new HttpResponse(response.code , response.message, response.details).toResponse();
      } catch (error) {
        return new HttpResponse(500, (error as Error).message).toResponse();
      }
    },
    {
      body: "auth.signup.sendotp",
      detail: {
        summary: "Send OTP for Sign-Up",
        description: "Sends an OTP to the provided phone number for verification during the sign-up process."
      }
    }
  )

  .post(
    "/verify-otp",
    async ({ body, accessToken, cookie: { "x-access-token": auth } }) => {
      try {
        const result = await verifyOTP({
          prisma,
          data: body,
        });
        if (result.code && result.code !== 200) {
          return new HttpResponse(result.code, result.message).toResponse();
        }
        const { userStage, id } = result;
        const token = await accessToken.sign(
          {
            userId: id,
            phone: body.phone,
            stage: userStage,
          },
        );
        auth.set({
          value: token,
          httpOnly: false,   // allow frontend to read cookie during debugging
          secure: false,     // localhost = MUST be false
          maxAge: 86400,
          sameSite: "lax",
          path: "/",         // always good
        });
        return new HttpResponse(200, "USER_CREATED", { userStage: userStage }).toResponse();
      } catch (error) {
        console.log(error);
        return new HttpResponse(500, (error as Error).message).toResponse();
      }
    },
    {
      body: "auth.signup.verifyotp",
      detail: {
        summary: "Verify OTP for Sign-Up",
        description: "Verifies the OTP sent to the user's phone number and creates a new user account upon successful verification."
      }
    }
  )
  .use(authMiddleware)
  .post("/send-email-otp", async ({ body }) => {
    try {
      return await sendOTPEmailVerification({ prisma, data: body })
    } catch (error) {
      return new HttpResponse(500, (error as Error).message).toResponse()
    }
  },
    {
      body: "auth.signup.sendotpemail",
      detail: {
        summary: "Send OTP to Email for Verification",
        description: "Sends an OTP to the provided email address for verification during the sign-up process."
      }
    }
  )
  .post("/layer-0", async ({ body, user }) => {
    try {
      return await signUpLayer0({ prisma, data: body, userId: user.id })

    } catch (error) {
      return new HttpResponse(500, (error as Error).message).toResponse()
    }
  }, {
    body: "auth.signup.layer0",
    detail: {
      summary: "Complete Sign-Up Layer 0",
      description: "Completes the initial layer of the sign-up process by confirming the email verification OTP."
    }
  })
  .post("/layer-1",
    async ({ body, user }) => {
      try {
        return await signUpLayer1({
          prisma,
          data: body,
          userId: user!.id,
        });
      } catch (error) {
        return new HttpResponse(500, (error as Error).message).toResponse();
      }
    }, {
    body: "auth.signup.layer1",
    detail: {
      summary: "Complete Sign-Up Layer 1",
      description: "Completes the first layer of the sign-up process by collecting pan and dob information."
    }
  })
  .post("/layer-2", async ({ body, user }) => {
    try {
      return await signUpLayer2({
        prisma,
        data: body,
        userId: user!.id,
      });
    } catch (error) {
      return new HttpResponse(500, (error as Error).message).toResponse();
    }
  }, {
    body: "auth.signup.layer2",
    detail: {
      summary: "Complete Sign-Up Layer 2",
      description: "Completes the second layer of the sign-up process by collecting addharNumber and segment preference of user."
    }
  })
  .post("/layer-3-A", async ({ body, user }) => {
    try {
      const result = await signUpLayer3A({
        prisma,
        data: body,
        userId: user!.id,
      });
      return new HttpResponse(200, "LAYER3A_COMPLETED", result).toResponse();
    } catch (error) {
      return new HttpResponse(500, (error as Error).message).toResponse();
    }
  }, {
    body: "auth.signup.layer3A",
    detail: {
      summary: "Complete Sign-Up Layer 3A",
      description: "Completes the third layer A of the sign-up process by collecting user basic information."
    }
  }
  )
  .post("/layer-3-B", async ({ body, user }) => {
    try {
      return await signUpLayer3B({
        prisma,
        data: body,
        userId: user!.id,
      });
    } catch (error) {
      return new HttpResponse(500, (error as Error).message).toResponse();
    }
  }, {
    body: "auth.signup.layer3B",
    detail: {
      summary: "Complete Sign-Up Layer 3B",
      description: "Completes the third layer B of the sign-up process by collecting user bank account information."
    }
  }
  )
  .post("/presigned-webcam", async ({ body, user }) => {
    try {
      return await presignedURLWebCamera({
        prisma,
        data: body,
        userId: user!.id,
      });
    } catch (error) {
      return new HttpResponse(500, (error as Error).message).toResponse();
    }
  }, {
    body: "auth.signup.presigned",
    detail: {
      summary: "Generate Presigned URL for Webcam Upload",
      description: "Generates a presigned URL for uploading the user's webcam image during the sign-up process."
    }
  })
  .post("/layer-3-C", async ({ body, user }) => {
    try {
      return await signUpLayer3C({
        prisma,
        data: body,
        userId: user!.id,
      });
    } catch (error) {
      return new HttpResponse(500, (error as Error).message).toResponse();
    }
  }, {
    body: "auth.signup.layer3C",
    detail: {
      summary: "Complete Sign-Up Layer 3C",
      description: "Completes the third layer C of the sign-up process by collecting user's webcam information."
    }
  }
  )
  .post("/presigned-signature", async ({ body, user }) => {
    try {
      return await presignedURLSignature({
        prisma,
        data: body,
        userId: user!.id,
      });
    } catch (error) {
      return new HttpResponse(500, (error as Error).message).toResponse();
    }
  }, {
    body: "auth.signup.presigned",
    detail: {
      summary: "Generate Presigned URL for Signature Upload",
      description: "Generates a presigned URL for uploading the user's signature image during the sign-up process."
    }
  })
  .post("/layer-4-A", async ({ body, user }) => {
    try {
      return signUpLayer4A({ prisma, data: body, userId: user!.id });
    } catch (error) {
      return new HttpResponse(500, (error as Error).message).toResponse();
    }
  },
    {
      body: "auth.signup.layer4A",
      detail: {
        summary: "Complete Sign-Up Layer 4A",
        description: "Completes the fourth layer A of the sign-up process by collecting user's signature information."
      }
    }
  )
  .post("/layer-4-B", async ({ body, user }) => {
    try {
      return await signUpLayer4B({ prisma, data: body, userId: user!.id });
    } catch (error) {
      return new HttpResponse(500, (error as Error).message).toResponse();
    }
  },
    {
      body: "auth.signup.layer4B",
      detail: {
        summary: "Complete Sign-Up Layer 4B",
        description: "Completes the fourth layer B of the sign-up process by collecting user's nominee details"
      }
    }
  )
  .get("/current-stage", async ({ user }) => {
    try {
      return await getCurrentStage({ prisma, userId: user.id })
    } catch (error) {
      return new HttpResponse(500, (error as Error).message).toResponse();
    }
  }, {
    detail: {
      summary: "Get Current Sign-Up Stage",
      description: "Retrieves the current stage of the user's sign-up process."
    }
  })