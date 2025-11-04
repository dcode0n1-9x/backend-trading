import { Elysia } from "elysia";
import { prisma } from "../db/index";
import { authMiddleware } from "../middleware/authMiddleware";
import { getFullDetail } from "../modules/dashboard/getFullDetail";

export const dashboardRouter = new Elysia({
    name: "dashboard",
    prefix: "/dashboard",
    detail: {
        tags: ["Dashboard"],
        description: "APIs related to user dashboard"
    }
})
    .use(authMiddleware)
    .get(
        "/detail",
        async ({  user }) => {
            console.log(user);
            return await getFullDetail({
                prisma,
                userId: user.id,
            });
        },
    )

