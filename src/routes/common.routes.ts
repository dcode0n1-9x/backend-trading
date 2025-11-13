import { Elysia } from "elysia";
import { Exchange, prisma, ProductType } from "../db/index";
import { authMiddleware } from "../middleware/authMiddleware";
import { getFullDetail } from "../modules/common/getFullDetail";
import { HttpResponse } from "../utils/response/success";
import { getMarginDetails } from "../modules/common/getMarginDetails";
import { presignedURLAvatar } from "../modules/common/getPresignedURLAvatar";
import { commonValidator } from "../utils/validator";
import { uploadAvatar } from "../modules/common/uploadAvatar";

export const commonRouter = new Elysia({
    name: "common",
    detail: {
        tags: ["Common"],
        description: "APIs related to user common APIs"
    }
})
    .use(authMiddleware)
    .get(
        "/detail",
        async ({ user }) => {
            let response = await getFullDetail({
                prisma,
                userId: user.id,
            }) as any;
            if (response instanceof Error) {
                return new HttpResponse(400, response.message).toResponse();
            }
            response["order_types"] = [
                Exchange.NSE,
                Exchange.BSE,
                Exchange.NFO,
                Exchange.MCX,
                Exchange.CDS,
                Exchange.MCX
            ]
            response["broker"] = "MONEYPLANTFX NINEX"
            return new HttpResponse(200, "DASHBOARD_DETAIL_FETCHED", response).toResponse();
        }, {
        detail: {
            summary: "Get Dashboard Details",
            description: "Fetches comprehensive details for the user's dashboard, including account info, watchlists, and preferences."
        }
    })
    .get("/margin", async ({ user }) => {
        try {
            return await getMarginDetails({
                prisma,
                userId: user.id,
            })
        } catch (err) {
            return new HttpResponse(400, (err as Error).message).toResponse();
        }
    }, {
        detail: {
            summary: "Get User Margin Details",
            description: "Fetches the margin details for the authenticated user."
        }
    })
    .use(commonValidator)
    .post("/presigned-avatar", async ({ body, user }) => {
        try {
            return await presignedURLAvatar({
                data: body,
                userId: user.id
            });
        } catch (err) {
            return new HttpResponse(400, (err as Error).message).toResponse();
        }
    }, {
        body: "common.presigned-avatar",
        detail: {
            summary: "Get Presigned URL for Avatar Upload",
            description: "Generates a presigned URL for the user to upload their avatar image to S3."
        }
    })
    .post("/upload-avatar", async ({ body, user }) => {
        try {
            const result = await uploadAvatar({
                prisma,
                data: body,
                userId: user.id
            });
            return result;
        } catch (err) {
            return new HttpResponse(400, (err as Error).message).toResponse();
        }
    }, {
        body: "common.upload-avatar",
        detail: {
            summary: "Upload User Avatar",
            description: "Uploads the user's avatar image URL to their profile."
        }
    });



