import { Elysia } from "elysia";
import { Exchange, prisma, ProductType } from "../db/index";
import { authMiddleware } from "../middleware/authMiddleware";
import { getFullDetail } from "../modules/dashboard/getFullDetail";
import { HttpResponse } from "../utils/response/success";

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
        async ({ user }) => {
            let response = await getFullDetail({
                prisma,
                userId: user.id,
            }) as any;
            if (response instanceof Error) {
                return new HttpResponse(400, response.message).toResponse();
            }
            response["products"] = [
              ProductType.CNC,
              ProductType.MIS,
              ProductType.NRML
            ]
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
        },
    )
    .get("/margin" , async ({ user }) => {

    })

