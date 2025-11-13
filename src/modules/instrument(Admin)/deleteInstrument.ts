import type { PrismaClient } from "../../../generated/prisma";
import { HttpResponse } from "../../utils/response/success";


interface RegisterData {
    instrumentId: string;
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
}

export async function deleteInstrument({ prisma, data }: IRegisterProp) {
    const { instrumentId } = data;
    const deleteInstrument = await prisma.instrument.delete({
        where: { id: instrumentId },
    });
    if (!deleteInstrument) {
        return new HttpResponse(500, "INSTRUMENT_DELETION_FAILED").toResponse();
    }
    return new HttpResponse(200, "INSTRUMENT_DELETED_SUCCESSFULLY", { instrumentId: deleteInstrument.id }).toResponse();
}
