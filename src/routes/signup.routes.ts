import { Elysia, t } from "elysia";
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

export const signUpRouter = new Elysia({
  name: "sign-up",
  prefix: "/sign-up",
  detail: {
    tags: ["Auth"],
    description: "APIs related to user sign-up process"
  }
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
  .use(jwt({
    name: 'jwt',
    secret: config.JWT.SECRET, // Replace with your actual secret key
    exp: '7d'
  }))
  .post(
    "/verify-otp",
    async ({ body, jwt, cookie: { auth } }) => {
      try {
        const result = await verifyOTP({
          prisma,
          data: body,
        });
        if (result instanceof Error) {
          return new HttpResponse(400, result.message).toResponse();
        }
        const { userStage, id } = result;
        const token = await jwt.sign(
          {
            userId: id,
            phone: body.phone,
            stage: userStage,
          },
        );
        auth.set({
          value: token,
          httpOnly: process.env.BUN_ENV === "production",
          secure: process.env.BUN_ENV === "production",
          sameSite: "lax",
        })
        return new HttpResponse(200, "USER_CREATED", { userStage: userStage }).toResponse();
      } catch (error) {
        return new HttpResponse(400, (error as Error).message).toResponse();
      }
    },
    {
      body: "auth.signup.verifyotp",
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
    { body: "auth.signup.sendotpemail" }
  )
  .post("/layer-0", async ({ body, user }) => {
    try {
      const result = await signUpLayer0({ prisma, data: body, userId: user.id })
      if (result instanceof Error) {
        return new HttpResponse(400, result.message).toResponse();
      }
      return new HttpResponse(200, "LAYER0_COMPLETED", result).toResponse()
    } catch (error) {
      console.log(error)
      return new HttpResponse(400, (error as Error).message).toResponse()
    }
  }, {
    body: "auth.signup.layer0"
  })
  .post("/layer-1",
    async ({ body, user }) => {
      try {
        const result = await signUpLayer1({
          prisma,
          data: body,
          userId: user!.id,
        });
        console.log("Layer 1 result:", result);
        return new HttpResponse(200, "LAYER1_COMPLETED", result).toResponse();
      } catch (error) {
        return new HttpResponse(400, (error as Error).message).toResponse();
      }
    }, {
    body: "auth.signup.layer1",
  })
  .post("/layer-2", async ({ body, user }) => {
    try {
      const result = await signUpLayer2({
        prisma,
        data: body,
        userId: user!.id,
      });
      return new HttpResponse(200, "LAYER2_COMPLETED", result).toResponse();
    } catch (error) {
      return new HttpResponse(400, (error as Error).message).toResponse();
    }
  }, {
    body: "auth.signup.layer2",
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
      return new HttpResponse(400, (error as Error).message).toResponse();
    }
  }, {
    body: "auth.signup.layer3A",
  }
  )
  .post("/layer-3-B", async ({ body, user }) => {
    try {
      const result = await signUpLayer3B({
        prisma,
        data: body,
        userId: user!.id,
      });
      return new HttpResponse(200, "LAYER3B_COMPLETED", result).toResponse();
    } catch (error) {
      return new HttpResponse(400, (error as Error).message).toResponse();
    }
  }, {
    body: "auth.signup.layer3B",
  }
  )
  .post("/presigned-webcam", async ({ body, user }) => {
    try {
      const result = await presignedURLSignature({
        prisma,
        data: body,
        userId: user!.id,
      });
      return new HttpResponse(200, "PRESIGNED_URL_GENERATED", result).toResponse();
    } catch (error) {
      return new HttpResponse(400, (error as Error).message).toResponse();
    }
  }, {
    body: "auth.signup.presigned",
  })
  .post("/layer-3-C", async ({ body, user }) => {
    try {
      const result = await signUpLayer3C({
        prisma,
        data: body,
        userId: user!.id,
      });
      return new HttpResponse(200, "LAYER3A_COMPLETED", result).toResponse();
    } catch (error) {
      return new HttpResponse(400, (error as Error).message).toResponse();
    }
  }, {
    body: "auth.signup.layer3C",
  }
  )
  .post("/presigned-signature", async ({ body, user }) => {
    try {
      const result = await presignedURLSignature({
        prisma,
        data: body,
        userId: user!.id,
      });
      return new HttpResponse(200, "PRESIGNED_URL_GENERATED", result).toResponse();
    } catch (error) {
      return new HttpResponse(400, (error as Error).message).toResponse();
    }
  }, {
    body: "auth.signup.presigned",
  })
  .post("/layer-4-A", async ({ body, user }) => {
    try {
      const result = await signUpLayer4A({ prisma, data: body, userId: user!.id });
      return new HttpResponse(200, "LAYER4_COMPLETED", result).toResponse();
    } catch (error) {
      return new HttpResponse(400, (error as Error).message).toResponse();
    }
  },
    {
      body: "auth.signup.layer4A",
    }
  )
  .post("/layer-4-B", async ({ body, user }) => {
    try {
      const result = await signUpLayer4B({ prisma, data: body, userId: user!.id });
      return new HttpResponse(200, "LAYER4_COMPLETED", result).toResponse();
    } catch (error) {
      return new HttpResponse(400, (error as Error).message).toResponse();
    }
  },
    {
      body: "auth.signup.layer4B",
    }
  )
  .get("/current-stage", async ({ user }) => {
    try {
      return await getCurrentStage({ prisma, userId: user.id })
    } catch (error) {
      return new HttpResponse(400, (error as Error).message).toResponse();
    }
  })