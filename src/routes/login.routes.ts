import { Elysia, t } from "elysia";
import { prisma } from "../db/index";
import { authValidator } from "../utils/validator";
import { login } from "../modules/auth/login";

export const authRouter = new Elysia({
    name: "auth",
    prefix: "/auth",
    detail : {
        tags: ["Auth"],
        summary : "User Authentication APIs",
    }
})
    .use(authValidator)
    .post(
        "/login",
        async ({ body }) => {
            return await login({
                prisma,
                data: body,
            });
        },
        {
            body: "auth.login",
            detail: {
                summary : "User Login",
                description: "Authenticates a user with their credentials and returns an authentication token upon successful login."
            }
        }
    )

