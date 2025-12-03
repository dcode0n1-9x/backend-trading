

import type { PrismaClient } from "../../../generated/prisma/client";
import { HttpResponse } from "../../utils/response/success";


interface RegisterData {
    webcam: string
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
    userId: string;
}

export async function signUpLayer3C({ prisma, data, userId }: IRegisterProp) {
    const { webcam } = data;

    return await prisma.$transaction(async (tx) => {
        // 1. Validate stage atomically
        const verification = await tx.userVerification.findUnique({
            where: { userId },
            select: { stage: true }
        });

        if (verification?.stage !== "THREEB") {
            return new HttpResponse(400, `INVALID_USER_STAGE: Expected THREEB, got ${verification?.stage}`).toResponse();
        }

        // 2. Single update with nested updates (one query)
        const result = await tx.user.update({
            where: { id: userId },
            data: {
                kyc: {
                    update: { webcam }
                },
                verification: {
                    update: { stage: "THREEC" }
                }
            },
            select: {
                firstName: true,
                email: true,
            }
        });

        return new HttpResponse(200, "LAYER3C_COMPLETED", { userStage: "THREEC", ...result }).toResponse();
    });
}
