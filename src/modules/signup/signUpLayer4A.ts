

import type { PrismaClient } from "../../../generated/prisma";


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
            throw new Error(`INVALID_USER_STAGE: Expected THREEC, got ${verification?.stage}`);
        }

        // 2. Single update with nested updates (one query)
        const result = await tx.user.update({
            where: { id: userId },
            data: {
                profile: {
                    update: { signature }
                },
                userVerification: {
                    update: { stage: "FOURA" }
                }
            },
            include: {
                profile: true,
                userVerification: true
            }
        });

        return { userStage: "FOURA", data: result };
    });
}
