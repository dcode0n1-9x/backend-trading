import { Elysia } from "elysia";
import { authMiddleware } from "../middleware/authMiddleware";
import { basketItemValidator } from "../utils/validator";
import { HttpResponse } from "../utils/response/success";
import { prisma } from "../db";
import { getAllBasketItems } from "../modules/basket/basketItem/getAllBasketItem";
import { createBasketItem } from "../modules/basket/basketItem/addToBasketItem";

export const basketItemRouter = new Elysia({
    name: "basket-item",
    prefix: "/basket/item",
    detail: {
        tags: ["Basket"],
        description: "APIs related to user basket APIs"
    }
})
    .use(authMiddleware)
    .use(basketItemValidator)
    .get("/:basketId", async ({ params , user }) => {
        try {
            return await getAllBasketItems({
                prisma,
                data : {
                    basketId: params.basketId,
                },
                userId: user.id,
            })
        } catch (err) {
            return new HttpResponse(400, (err as Error).message).toResponse();
        }
    }, {
        params: "basket-item.id",
        detail: {
            summary: "Get Basket Items",
            description: "Fetches all items for the specified basket."
        }
    })
    .post("/:basketId", async ({ params , user , body}) => {
        try {
            return await createBasketItem({
                prisma,
                data : {basketId: params.basketId, ...body} , 
            })
        } catch (err) {
            return new HttpResponse(400, (err as Error).message).toResponse();
        }
    }, {
        params: "basket-item.id",
        body : "basket-item.create",
        detail: {
            summary: "Add Basket Item",
            description: "Adds a new item to the specified basket."
        }
    });


