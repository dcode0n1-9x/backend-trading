import { Elysia } from "elysia";
import { prisma } from "../db/index";
import { orderValidator } from "../utils/validator";
import { createOrder } from "../modules/order/createOrder";
import { authMiddleware } from "../middleware/authMiddleware";
import { updateOrder } from "../modules/order/updateOrder";
import { getAllOrders } from "../modules/order/getAllOrder";
import { cancelOrder } from "../modules/order/cancelOrder";
import { HttpResponse } from "../utils/response/success";

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
    .get("/", async ({ query , user}) => {
        try {
            return await getAllOrders({
                prisma,
                data : query,
                userId: user.id,
            })
        } catch (error) {
            console.error("Error fetching orders", error);
            return new HttpResponse(500, "INTERNAL_SERVER_ERROR").toResponse()
        }
    }, {
        query: "order.get-all",
        detail: {
            summary: "Get All Orders",
            description: "Fetches all orders for the authenticated user with optional filtering and pagination."
        }
    })
    .post(
        "/",
        async ({ body, user }) => {
            try {
                return await createOrder({
                    prisma,
                    data: body,
                    userId: user.id
                })
            } catch (error) {
                return new HttpResponse(500, "INTERNAL_SERVER_ERROR").toResponse()
            }
        }, {
        body: "order.create",
        detail: {
            summary: "Create an Order",
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
        body: "order.update",
        params: "order.id",
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
        body: "order.cancel",
        params: "order.id",
        detail: {
            summary: "Cancel Order",
            description: "This is the end-point to cancel the order",
        }
    })
