import type { Exchange, InstrumentType, PrismaClient, Segment } from "../../../generated/prisma/client";
import { sendMessage } from "../../utils/kakfa.utils";
import { HttpResponse } from "../../utils/response/success";


interface RegisterData {
    instrumentToken: string;
    exchangeToken: string;
    tradingSymbol: string;
    name: string;
    segment: Segment;
    exchange: Exchange;
    instrumentType: InstrumentType;
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
}

export async function createInstrument({ prisma, data }: IRegisterProp) {
    const createInstrument = await prisma.instrument.create({
        data
    });
    if (!createInstrument) {
        return new HttpResponse(500, "INSTRUMENT_CREATION_FAILED").toResponse();
    }
    // FOR CREATING AN ORDER BOOK FOR THE RECENT CREATED INSTRUMENTS
    await sendMessage("instrument.create", createInstrument.id, { instrument: createInstrument })
    return new HttpResponse(200, "INSTRUMENT_CREATED_SUCCESSFULLY", { instrumentId: createInstrument.id }).toResponse();
}
