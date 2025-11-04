import { Elysia, t } from "elysia";
import { prisma } from "../db/index";
import { signUpValidator } from "../utils/validator";
// import { setAuthCookies } from "../utils/setCookies";
import { sendOTP } from "../modules/signup/sendOTP";
import { jwt } from "@elysiajs/jwt";
import { verifyOTP } from "../modules/signup/verifyOTP";
import { HttpResponse } from "../utils/response/success";
import { signUpLayer1 } from "../modules/signup/signupLayer1";
import { authMiddleware } from "../middleware/authMiddleware";
import { config } from "../config/generalconfig";
import { signUpLayer2 } from "../modules/signup/signupLayer2";
import { signUpLayer3 } from "../modules/signup/signUpLayer3";
import { presignedURLSignature } from "../modules/signup/presignedURLSignature";
import { signUpLayer4 } from "../modules/signup/signUpLayer4";

export const signUpRouter = new Elysia({
  name: "sign-up",
  prefix: "/sign-up",
  detail: {
    tags: ["Auth" ],
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
  .post("/layer-1",
    async ({ body, user }) => {
      console.log("User in layer 1:", user);
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
  .post("/layer-3", async ({ body, user }) => {
    try {
      const result = await signUpLayer3({
        prisma,
        data: body,
        userId: user!.id,
      });
      return new HttpResponse(200, "LAYER3_COMPLETED", result).toResponse();
    } catch (error) {
      return new HttpResponse(400, (error as Error).message).toResponse();
    }
  }, {
    body: "auth.signup.layer3",
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
  .post("/layer-4", async ({ body, user }) => {
    try {
      const result = await signUpLayer4({ prisma, data: body, userId: user!.id });
      return new HttpResponse(200, "LAYER4_COMPLETED", result).toResponse();
    } catch (error) {
      return new HttpResponse(400, (error as Error).message).toResponse();
    }
  },
    {
      body: "auth.signup.layer4",
    }
  )