import type { PrismaClient, Segment } from "../../../generated/prisma/client";
import { HttpResponse } from "../../utils/response/success";

interface RegisterData {
    aadhaarNumber: string;
    segment: Segment[];
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
    userId: string;
}

export async function signUpLayer2({ prisma, data, userId }: IRegisterProp) {
    const { aadhaarNumber, segment } = data;

    return await prisma.$transaction(async (tx) => {
        // Validate stage
        const verification = await tx.userVerification.findUnique({
            where: { userId },
            select: { stage: true }
        });

        if (verification?.stage !== 'ONE') {
            return new HttpResponse(400, `INVALID_USER_STAGE: Expected ONE, got ${verification?.stage}`);
        }

        // TODO: Integrate Digilocker or third-party verification for Aadhaar
        // const verificationResult = await verifyAadhaar(aadhaarNumber);

        // Update user with Aadhaar and segments
        const result = await tx.user.update({
            where: { id: userId },
            data: {
                aadhaarNumber,
                segment,
                userVerification: {
                    update: {
                        stage: "TWO"
                    }
                }
            },
            select: {
                firstName: true,
                email: true,
                segment: true
            }
        });

        return new HttpResponse(200, "LAYER2_COMPLETED", { userStage: "TWO", ...result }).toResponse();
    });
}
