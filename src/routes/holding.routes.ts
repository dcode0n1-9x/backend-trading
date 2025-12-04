import { Elysia, t } from "elysia";
import { prisma} from "../db/index";
import { holdingValidator } from "../utils/validator";
import { getHolding } from "../modules/holding/getHolding";
import { authMiddleware } from "../middleware/authMiddleware";
import { ProductType } from "../../generated/prisma/enums";

export const holdingRouter = new Elysia({
    name: "holding",
    prefix: "/holding",
    detail: {
        tags: ["Holding"],
        summary: "User Holding APIs",
    }
})
    .use(holdingValidator)
    .use(authMiddleware)
    .get(
        "/",
        async ({ query , user }) => {
            const data = {
                type: query.type as ProductType,
                search: query.search,
                cursor: query.cursor,
                sort: query.sort as 'asc' | 'desc',
                limit: query.limit ? parseInt(query.limit as any) : undefined
            };
            try {
                return await getHolding({
                    prisma,
                    userId: user.id,
                    data,
                });
            } catch (err) {
                return err;
            }
        },
        {
            query: "holding.get",
            detail: {
                summary: "Get User Holding",
                description: "Retrieves the holding information for a specific user."
            }
        }
    )
