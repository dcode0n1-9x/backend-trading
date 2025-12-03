import type { PrismaClient } from "../../../generated/prisma/client";
import { HttpResponse } from "../../utils/response/success";

interface RegisterData {
    panNumber: string;
    dob: string;
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
    userId: string;
}

export async function signUpLayer1({ prisma, data, userId }: IRegisterProp) {
    const { panNumber, dob } = data;

    return await prisma.$transaction(async (tx) => {
        // Validate stage
        const verification = await tx.userVerification.findUnique({
            where: { userId },
            select: { stage: true }
        });
        
        if (verification?.stage !== 'ZERO') {
            return new HttpResponse(400, `INVALID_USER_STAGE: Expected ZERO, got ${verification?.stage}`);
        }

        // Update user with PAN and DOB
        const result = await tx.user.update({
            where: { id: userId },
            data: {
                panNumber,
                dob: new Date(dob),
                verification: {
                    update: {
                        stage: "ONE"
                    }
                }
            },
            select: {
                firstName: true,
                email: true,
                panNumber: true
            }
        });

        return new HttpResponse(200, "LAYER1_COMPLETED", { userStage: "ONE", ...result }).toResponse();
    });
}
