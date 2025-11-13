import { Elysia, t } from "elysia";
import { prisma } from "../db/index";
import { instrumentValidator } from "../utils/validator";
import { createInstrument } from "../modules/instrument(Admin)/createInstrument";
import { HttpResponse } from "../utils/response/success";
import { deleteInstrument } from "../modules/instrument(Admin)/deleteInstrument";

export const instrumentRouter = new Elysia({
    name: "instrument",
    prefix: "/instrument",
    detail: {
        tags: ["Instrument"],
        summary: "Instrument Management APIs",
    }
})
    .use(instrumentValidator)
    .post(
        "/",
        async ({ body }) => {
            try {
                return await createInstrument({
                    prisma,
                    data: body,
                });
            } catch (err) {
                return new HttpResponse(400, (err as Error).message).toResponse();
            }
        },
        {
            body: "instrument.create",
            detail: {
                summary: "Create Instrument",
                description: "Creates a new instrument with the provided details."
            }
        }
    )
    .delete("/:instrumentId", async ({ params }) => {
        try {
            const { instrumentId } = params;
            return await deleteInstrument({
                prisma,
                data: {
                    instrumentId,
                },
            });
        } catch (err) {
            return new HttpResponse(400, (err as Error).message).toResponse();
        }
    }, {    
        params: "instrument.id",
        detail: {
            summary: "Delete Instrument",
            description: "Deletes the specified instrument from the system."
        }
    });

