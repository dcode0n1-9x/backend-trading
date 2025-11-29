import { Elysia } from "elysia";
import { authMiddleware } from "../middleware/authMiddleware";
import { gttOrderValidator } from "../utils/validator";
import { HttpResponse } from "../utils/response/success";
import { prisma } from "../db";
import { createGttOrder } from "../modules/gttOrder/createGTTOrder";
import { getAllGTTOrder } from "../modules/gttOrder/getAllGttOrder";
import { changeGTTStatus } from "../modules/gttOrder/changeGTTStatus";

export const gttOrderRouter = new Elysia({
    name: "gtt-order",
    prefix: "/gtt/order",
    detail: {
        tags: ["Good Till Triggered Order"],
        description: "APIs related to user GTT orders"
    }
})
    .use(authMiddleware)
    .use(gttOrderValidator)
    .get('/', async ({ user, query }) => {
        try {
            return await getAllGTTOrder({
                prisma,
                data: query,
                userId: user.id,
            })
        } catch (err) {
            return new HttpResponse(400, (err as Error).message).toResponse();
        }
    }, {
        query: "gtt-order.get",
        detail: {
            summary: "Get All GTT Orders",
            description: "Fetches all GTT orders for the authenticated user with optional pagination and sorting."
        }
    })
    .post("/", async ({ user, body }) => {
        try {
            return await createGttOrder({
                prisma,
                data: body,
                userId: user.id,
            })
        } catch (err) {
            return new HttpResponse(400, (err as Error).message).toResponse();
        }
    }, {
        body: "gtt-order.create",
        detail: {
            summary: "Add GTT Order",
            description: "Adds a new GTT order for the authenticated user."
        }
    })

    .put('/:gttOrderId', async ({ params, user, body }) => {
        try {
            return await changeGTTStatus({
                prisma,
                data: { gttOrderId: params.gttOrderId, ...body },
                userId: user.id,
            })
        } catch (err) {
            return new HttpResponse(400, (err as Error).message).toResponse();
        }
    }, {
        params: "gtt-order.id",
        body: "gtt-order.update-status",
        detail: {
            summary: "Change GTT Order Status",
            description: "Change the status of a Good Till Triggered order."
        }
    });




