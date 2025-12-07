import { Elysia } from "elysia";
import { prisma } from "../db/index";
import { instrumentValidator } from "../utils/validator";
import { createInstrument } from "../modules/instrument(Admin)/createInstrument";
import { HttpResponse } from "../utils/response/success";
import { deleteInstrument } from "../modules/instrument(Admin)/deleteInstrument";
import { getAllInstrument } from "../modules/instrument(Admin)/getAllInstrument";
import { Prisma } from "../../generated/prisma/client";

export const instrumentRouter = new Elysia({
    name: "instrument",
    prefix: "/instrument",
    detail: {
        tags: ["Instrument"],
        summary: "Instrument Management APIs",
    }
})
    .use(instrumentValidator)

    // ----------------------
    // GET ALL INSTRUMENTS
    // ----------------------
    .get("/", async ({ query }) => {
        try {
            return await getAllInstrument({ prisma, data: query });
        } catch (err) {
            console.error("GET instruments error:", err);

            return new HttpResponse(
                500,
                "FAILED_TO_FETCH_INSTRUMENTS",
                { reason: (err as Error).message }
            ).toResponse();
        }
    }, {
        query: "instrument.get-all",
        detail: {
            summary: "Get All Instruments",
            description: "Retrieves a list of all instruments with filtering, pagination, and search."
        }
    })


    // ----------------------
    // CREATE INSTRUMENT
    // ----------------------
    .post("/", async ({ body }) => {
        try {
            return await createInstrument({ prisma, data: body });
        } catch (err) {
            console.error("CREATE instrument error:", err);

            // Prisma errors
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                switch (err.code) {
                    case "P2002":
                        return new HttpResponse(
                            409,
                            "INSTRUMENT_ALREADY_EXISTS"
                        ).toResponse();

                    case "P2003":
                        return new HttpResponse(
                            409,
                            "INVALID_FOREIGN_KEY_REFERENCE"
                        ).toResponse();

                    case "P2025":
                        return new HttpResponse(
                            404,
                            "RELATED_RESOURCE_NOT_FOUND"
                        ).toResponse();
                }
            }

            return new HttpResponse(
                500,
                "INSTRUMENT_CREATION_FAILED"
            ).toResponse();
        }
    }, {
        body: "instrument.create",
        detail: {
            summary: "Create Instrument",
            description: "Creates a new financial instrument."
        }
    })


    // ----------------------
    // DELETE INSTRUMENT
    // ----------------------
    .delete("/:instrumentId", async ({ params }) => {
        try {
            return await deleteInstrument({ prisma, data: params });
        } catch (err) {
            console.error("DELETE instrument error:", err);

            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                switch (err.code) {
                    case "P2025":
                        return new HttpResponse(
                            404,
                            "INSTRUMENT_NOT_FOUND"
                        ).toResponse();

                    case "P2003":
                        return new HttpResponse(
                            409,
                            "INSTRUMENT_DELETE_CONSTRAINT"
                        ).toResponse();
                }
            }

            return new HttpResponse(
                500,
                "UNABLE_TO_DELETE_INSTRUMENT",
                { reason: (err as Error).message }
            ).toResponse();
        }
    }, {
        params: "instrument.id",
        detail: {
            summary: "Delete Instrument",
            description: "Deletes an instrument if it exists."
        }
    });
