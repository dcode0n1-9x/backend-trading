

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
    const checkLayers = await prisma.userVerification.findUnique({
        where: { userId, stage: 'THREEC' },
    });

    if (!checkLayers) {
        throw new Error("INVALID_USER_STAGE");
    }
    const updateStage = await prisma.$transaction([
        prisma.userVerification.update({
            where: { userId: userId },
            data: { stage: 'FOURA' }
        }),
        prisma.userProfile.update({
            where: { userId },
            data: { signature }
        }),
    ]);
    if (!updateStage) {
        throw new Error("SIGNUP_FAILED");
    }
    return { userStage: "FOURA" };
}
