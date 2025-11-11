

import type { PrismaClient } from "../../../generated/prisma";


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
            throw new Error(`INVALID_USER_STAGE: Expected THREEB, got ${verification?.stage}`);
        }

        // 2. Single update with nested updates (one query)
        const result = await tx.user.update({
            where: { id: userId },
            data: {
                profile: {
                    update: { webcam }
                },
                userVerification: {
                    update: { stage: "THREEC" }
                }
            },
            include: {
                profile: true,
                userVerification: true
            }
        });

        return { userStage: "THREEC", data: result };
    });
}
