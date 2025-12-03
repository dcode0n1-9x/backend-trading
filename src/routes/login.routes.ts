import { Elysia } from "elysia";
import { prisma } from "../db/index";
import { authValidator } from "../utils/validator";
import { login } from "../modules/auth/login";
import { HttpResponse } from "../utils/response/success";
import jwt from "@elysiajs/jwt";
import { config } from "../config/generalconfig";

export const authRouter = new Elysia({
    name: "auth",
    prefix: "/auth",
    detail: {
        tags: ["Auth"],
        summary: "User Authentication APIs",
    }
})
    .use(jwt({
        name: 'accessToken',
        secret: config.JWT.SECRET, // Replace with your actual secret key
        exp: '1d'
    }))
    .use(authValidator)
    .post(
        "/login",
        async ({ body, accessToken, cookie: { "x-access-token": auth } }) => {
            try {
                const result = await login({
                    prisma,
                    data: body,
                });
                if (result.code && result.code !== 200) {
                    return new HttpResponse(result.code, result.message, result.details).toResponse();
                }
                const userId = result.details?.userId;
                const token = await accessToken.sign({ userId });
                // {
                //     config.BUN_ENV === "production" ?
                //         auth.set({
                //             value: token,
                //             httpOnly: true,
                //             secure: true,
                //             maxAge: 86400,
                //             sameSite: "lax",
                //             domain: ".moneyplantfx.com",
                //             path: "/"
                //         })
                //         :
                auth.set({
                    value: token,
                    httpOnly: false,   // allow frontend to read cookie during debugging
                    secure: true,     // localhost = MUST be false
                    maxAge: 86400,
                    sameSite: "none",
                    path: "/",         // always good
                });
                // }

                // Set auth cookies
                // setAuthCookies(auth, accessToken, refreshToken);
                return new HttpResponse(200, "LOGIN_SUCCESSFUL", { accessToken: token }).toResponse();
            } catch (err) {
                return new HttpResponse(500, (err as Error).message).toResponse();
            }
        },
        {
            body: "auth.login",
            detail: {
                summary: "User Login",
                description: "Authenticates a user with their credentials and returns an authentication token upon successful login."
            }
        }
    )

