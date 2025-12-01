import { Elysia } from "elysia";
import { prisma } from "../db/index";
import { instrumentValidator } from "../utils/validator";
import { createInstrument } from "../modules/instrument(Admin)/createInstrument";
import { HttpResponse } from "../utils/response/success";
import { deleteInstrument } from "../modules/instrument(Admin)/deleteInstrument";
import { getAllInstrument } from "../modules/instrument(Admin)/getAllInstrument";

export const instrumentRouter = new Elysia({
    name: "instrument",
    prefix: "/instrument",
    detail: {
        tags: ["Instrument"],
        summary: "Instrument Management APIs",
    }
})
    .use(instrumentValidator)
    .get("/", async ({ query }) => {
        try {
            return await getAllInstrument({
                prisma,
                data: query,
            });
        } catch (err) {
            return new HttpResponse(400, (err as Error).message).toResponse();
        }
    }, {
        query: "instrument.get-all",
        detail: {
            summary: "Get All Instruments",
            description: "Retrieves a list of all instruments with optional filtering, sorting, and pagination."
        }
    })
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
            return await deleteInstrument({
                prisma,
                data: params,
            });
        } catch (err) {
            console.log(err);
            return new HttpResponse(400, (err as Error).message).toResponse();
        }
    }, {
        params: "instrument.id",
        detail: {
            summary: "Delete Instrument",
            description: "Deletes the specified instrument from the system."
        }
    })
   

