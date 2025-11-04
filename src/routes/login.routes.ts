import { Elysia, t } from "elysia";
import { prisma } from "../db/index";
import { authValidator } from "../utils/validator";
import { login } from "../modules/auth/login";

export const authRouter = new Elysia({
    name: "auth",
    prefix: "/auth",
    detail : {
        tags: ["Auth"],
        description: "APIs related to user authentication"
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
        }
    )

