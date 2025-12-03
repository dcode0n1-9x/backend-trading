

import type { PrismaClient } from "../../../generated/prisma/client";
import { HttpResponse } from "../../utils/response/success";


interface RegisterData {
    signature: string
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
    userId: string;
}

export async function signUpLayer4A({ prisma, data, userId }: IRegisterProp) {
    const { signature } = data;

    return await prisma.$transaction(async (tx) => {
        // 1. Validate stage atomically
        const verification = await tx.userVerification.findUnique({
            where: { userId },
            select: { stage: true }
        });

        if (verification?.stage !== "THREEC") {
            return new HttpResponse(400, `INVALID_USER_STAGE: Expected THREEC, got ${verification?.stage}`);
        }

        // 2. Single update with nested updates (one query)
        const result = await tx.user.update({
            where: { id: userId },
            data: {
                kyc: {
                    update: { signature }
                },
                kycStatus : "SUBMITTED",
                verification: {
                    update: { stage: "FOURA" }
                }
            },
            select: {
                firstName: true,
                email: true,
            }
        });

        return new HttpResponse(200, "LAYER4A_COMPLETED", { userStage: "FOURA", ...result }).toResponse();
    });
}
