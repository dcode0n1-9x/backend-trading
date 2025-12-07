import { Elysia } from "elysia";
import { prisma } from "../db/index";
import { orderValidator } from "../utils/validator";
import { createOrder } from "../modules/order/createOrder";
import { authMiddleware } from "../middleware/authMiddleware";
import { updateOrder } from "../modules/order/updateOrder";
import { getAllOrders } from "../modules/order/getAllOrder";
import { cancelOrder } from "../modules/order/cancelOrder";
import { HttpResponse } from "../utils/response/success";
import { Prisma } from "../../generated/prisma/client";

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

    // ----------------------
    // GET ALL ORDERS
    // ----------------------
    .get("/", async ({ query, user }) => {
        try {
            return await getAllOrders({
                prisma,
                data: query,
                userId: user.id,
            });
        } catch (err) {
            console.error("GET /order error:", err);

            // Prisma known errors
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                // Add any specific Prisma error handling if necessary
                return new HttpResponse(500, "ORDER_FETCH_FAILED").toResponse();
            }

            return new HttpResponse(500, "INTERNAL_SERVER_ERROR").toResponse();
        }
    }, {
        query: "order.get-all",
        detail: {
            summary: "Get All Orders",
            description: "Fetches all orders for the authenticated user with optional filtering and pagination."
        }
    })

    // ----------------------
    // CREATE ORDER
    // ----------------------
    .post("/", async ({ body, user }) => {
        try {
            // createOrder returns an HttpResponse (as implemented).
            // If your module throws, this catch will handle Prisma / custom errors.
            return await createOrder({
                prisma,
                data: body,
                userId: user.id
            });
        } catch (err) {
            console.error("POST /order create error:", err);

            // Prisma known errors mapping
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                switch (err.code) {
                    case "P2025":
                        return new HttpResponse(404, "RELATED_RESOURCE_NOT_FOUND").toResponse();
                    case "P2003":
                        return new HttpResponse(409, "INVALID_FOREIGN_KEY_REFERENCE").toResponse();
                    case "P2002":
                        return new HttpResponse(409, "DUPLICATE_RESOURCE").toResponse();
                    default:
                        return new HttpResponse(500, "ORDER_CREATION_FAILED").toResponse();
                }
            }

            // Custom thrown errors from createOrder transaction
            if (err instanceof Error) {
                if (err.message === "WALLET_NOT_FOUND") {
                    return new HttpResponse(400, "WALLET_NOT_FOUND").toResponse();
                }
                if (err.message === "INSUFFICIENT_BALANCE") {
                    return new HttpResponse(400, "INSUFFICIENT_BALANCE").toResponse();
                }
            }

            return new HttpResponse(500, "ORDER_CREATION_FAILED").toResponse();
        }
    }, {
        body: "order.create",
        detail: {
            summary: "Create an Order",
            description: "This is to create an Order to the Order-book"
        }
    })

    // ----------------------
    // UPDATE ORDER
    // ----------------------
    .put("/:orderId", async ({ params, body, user }) => {
        try {
            return await updateOrder({
                prisma,
                data: {
                    orderId: params.orderId,
                    ...body
                },
                userId: user.id
            });
        } catch (err) {
            console.error(`PUT /order/${params.orderId} update error:`, err);

            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                switch (err.code) {
                    case "P2025":
                        return new HttpResponse(404, "ORDER_NOT_FOUND").toResponse();
                    case "P2003":
                        return new HttpResponse(409, "INVALID_FOREIGN_KEY_REFERENCE").toResponse();
                    default:
                        return new HttpResponse(500, "ORDER_UPDATE_FAILED").toResponse();
                }
            }

            if (err instanceof Error) {
                // If your updateOrder throws custom errors
                if (err.message === "ORDER_ALREADY_EXECUTED") {
                    return new HttpResponse(400, "ORDER_ALREADY_EXECUTED").toResponse();
                }
                if (err.message === "INVALID_UPDATE_STATE") {
                    return new HttpResponse(400, "INVALID_UPDATE_STATE").toResponse();
                }
            }

            return new HttpResponse(500, "ORDER_UPDATE_FAILED").toResponse();
        }
    }, {
        body: "order.update",
        params: "order.id",
        detail: {
            summary: "Update the Order",
            description: "This is to update the order after execution"
        }
    })

    // ----------------------
    // CANCEL ORDER
    // ----------------------
    .put("/cancel/:orderId", async ({ params, body, user }) => {
        try {
            return await cancelOrder({
                prisma,
                data: {
                    orderId: params.orderId,
                    ...body
                },
                userId: user.id
            });
        } catch (err) {
            console.error(`PUT /order/cancel/${params.orderId} cancel error:`, err);

            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                switch (err.code) {
                    case "P2025":
                        return new HttpResponse(404, "ORDER_NOT_FOUND").toResponse();
                    case "P2003":
                        return new HttpResponse(409, "ORDER_CANCEL_CONSTRAINT").toResponse();
                    default:
                        return new HttpResponse(500, "ORDER_CANCEL_FAILED").toResponse();
                }
            }

            if (err instanceof Error) {
                if (err.message === "ORDER_ALREADY_CANCELLED") {
                    return new HttpResponse(400, "ORDER_ALREADY_CANCELLED").toResponse();
                }
                if (err.message === "ORDER_ALREADY_EXECUTED") {
                    return new HttpResponse(400, "ORDER_ALREADY_EXECUTED").toResponse();
                }
            }

            return new HttpResponse(500, "ORDER_CANCEL_FAILED").toResponse();
        }
    }, {
        body: "order.cancel",
        params: "order.id",
        detail: {
            summary: "Cancel Order",
            description: "This is the end-point to cancel the order",
        }
    });
