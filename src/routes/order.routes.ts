import { Elysia, t } from "elysia";
import { prisma } from "../db/index";
import { orderValidator } from "../utils/validator";
import { createOrder } from "../modules/order/createOrder";
import { authMiddleware } from "../middleware/authMiddleware";
import { updateOrder } from "../modules/order/updateOrder";
import { cancelOrder } from "../modules/order/cancelOrder";

export const orderRouter = new Elysia({
    name: "Order",
    prefix: "/order",
    detail: {
        tags: ["Order"],
        summary: "Order Execution APIs",
    }
})
    .use(orderValidator)
    .use(authMiddleware)
    .post(
        "/",
        async ({ body, user }) => {
            return await createOrder({
                prisma,
                data: body,
                userId: user.id
            })
        }, {
        body: "order.createOrder",
        detail : {
            summary : "Create an Order",
            description: "This is to create an Order to the Order-book"
        }
    }
    )
    .put("/:orderId", async ({ params, body, user }) => {
        return await updateOrder({
            prisma,
            data: {
                orderId: params.orderId,
                ...body
            },
            userId: user.id
        })
    }, {
        body: "order.updateOrder",
        params: "order.orderId",
          detail: {
            summary: "Update the Order",
            description: "This is to update the order after execution"
        }

    })
    .put("/cancel/:orderId", async ({ params, body, user }) => {
        return await cancelOrder({
            prisma,
            data: {
                orderId: params.orderId,
                ...body
            },
            userId: user.id
        })
    }, {
        body: "order.cancelOrder",
        params: "order.orderId",
        detail: {
            summary: "Cancel Order",
            description: "This is the end-point to cancel the order",
        }
    })
