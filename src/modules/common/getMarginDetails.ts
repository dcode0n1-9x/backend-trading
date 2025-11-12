import { PrismaClient } from "../../../generated/prisma";
import { HttpResponse } from "../../utils/response/success";


interface MarginDetailsProps {
    prisma: PrismaClient;
    userId: string;
}

export async function getMarginDetails({
    prisma,
    userId
}: MarginDetailsProps) {
    const getMargin = await prisma.margin.findMany({
        where: { userId, OR: [{ type: 'EQUITY' }, { type: 'COMMODITY' }] }
    });
    if(!getMargin || getMargin.length === 0){
        throw new Error("MARGIN_DETAILS_NOT_FOUND");
    }
    return new HttpResponse(200, "MARGIN_DETAILS_FETCHED", getMargin).toResponse();
}
