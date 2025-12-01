import { Elysia } from "elysia";
import { prisma } from "../db/index";
import { authMiddleware } from "../middleware/authMiddleware";
import { HttpResponse } from "../utils/response/success";
import { basketValidator } from "../utils/validator";
import { createBasket } from "../modules/basket/createBasket";
import { getAllBasket } from "../modules/basket/getAllBasket";
import { updateBasketName } from "../modules/basket/updateBasket";

export const basketRouter = new Elysia({
    name: "basket",
    prefix: "/basket",
    detail: {
        tags: ["Basket"],
        description: "APIs related to user basket APIs"
    }
})
    .use(authMiddleware)
    .use(basketValidator)
    .get(
        "/",
        async ({ user, query }) => {
            try {
                return await getAllBasket({
                    prisma,
                    data: query,
                    userId: user.id,
                })
            }
            catch (err) {
                return new HttpResponse(400, (err as Error).message).toResponse();
            }
        }, {
        query: "basket.get-all",
        detail: {
            summary: "Get All Basket Details",
            description: "Fetches comprehensive details for the user's basket, including all basket items and related information."
        }
    })
    .post("/", async ({ body, user }) => {
        try {
            return await createBasket({
                prisma,
                data: body,
                userId: user.id,
            })
        } catch (err) {
            console.error(err);
            return new HttpResponse(400, (err as Error).message).toResponse();
        }
    }, {
        body: "basket.create",
        detail: {
            summary: "Create Basket",
            description: "This endpoint creates a new basket for the user."
        }
    })
    .put("/:basketId", async ({ params, body }) => {
        try {
            const { basketId } = params;
            return await updateBasketName({
                prisma,
                data: { basketId, ...body }
            })
        } catch (err) {
            return new HttpResponse(400, (err as Error).message).toResponse();
        }
    }, {
        params: "basket.id",
        body: "basket.update",
        detail: {
            summary: "Update Basket Name",
            description: "This endpoint updates the name of an existing basket."
        }
    })


