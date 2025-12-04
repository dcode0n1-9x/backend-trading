import { Elysia } from "elysia";
import { prisma } from "../db/index";
import { authMiddleware } from "../middleware/authMiddleware";
import { HttpResponse } from "../utils/response/success";
import { getAllAlerts } from "../modules/alert/getAllAlerts";
import { createAlert } from "../modules/alert/createAlerts";
import { alertValidator } from "../utils/validator";
import { deleteAlert } from "../modules/alert/deleteAlert";
import { updateAlert } from "../modules/alert/updateAlert";

export const alertRouter = new Elysia({
    name: "alert",
    prefix: "/alert",
    detail: {
        tags: ["Alert"],
        description: "APIs related to user alert APIs"
    }
})
    .use(authMiddleware)
    .use(alertValidator)
    .get(
        "/",
        async ({ user, query }) => {
            try {
                return await getAllAlerts({
                    prisma,
                    data: query,
                    userId: user.id,
                });
            } catch (err) {
                return new HttpResponse(400, (err as Error).message).toResponse();
            }
        },
        {
            query: "alert.get-all",
            detail: {
                summary: "Get All Alert Details",
                description: "Fetches comprehensive details for the user's alerts."
            }
        })
    .post(
        "/",
        async ({ user, body }) => {
            try {
                return await createAlert({
                    prisma,
                    data: body,
                    userId: user.id,
                });
            } catch (err) {
                return new HttpResponse(400, (err as Error).message).toResponse();
            }
        },
        {
            body: "alert.create",
            detail: {
                summary: "Create Alert",
                description: "Creates a new alert for the user."
            }
        })
    .delete(
        "/:alertId",
        async ({ user, params }) => {
            try {
                const deletedAlert = await deleteAlert({
                    prisma,
                    data: {
                        alertId: params.alertId,
                        userId: user.id,
                    },
                });
                return deletedAlert;
            } catch (err) {
                return new HttpResponse(400, (err as Error).message).toResponse();
            }
        },
        {
            params: "alert.id",
            detail: {
                summary: "Delete Alert",
                description: "Deletes the specified alert for the user."
            }
        }
    )
    .put("/:alertId", async ({ user, params, body }) => {
        try {
            const { alertId } = params;
            return await updateAlert({
                prisma,
                data: {
                    alertId,
                    ...body
                },
                userId: user.id,
            });
        } catch (err) {
            return new HttpResponse(400, (err as Error).message).toResponse();
        }
    }, {
        params: "alert.id",
        body: "alert.update",
        detail: {
            summary: "Update Alert",
            description: "Updates the specified alert details for the user."
        }
    });





