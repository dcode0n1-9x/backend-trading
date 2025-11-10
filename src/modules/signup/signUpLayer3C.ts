

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
    const checkLayers = await prisma.userVerification.findUnique({
        where: { userId, stage: 'THREEB' },
    });
    if (!checkLayers) {
        throw new Error("INVALID_USER_STAGE");
    }
    const [updateUser, updateStage] = await prisma.$transaction([
        prisma.userProfile.update({
            where: { userId },
            data: { webcam }
        }),
        prisma.userVerification.update({
            where: { userId: userId },
            data: { stage: "THREEC" }
        })
    ])
    if (!updateUser) {
        throw new Error("USER_UPDATE_FAILED");
    }
    if (!updateStage) {
        throw new Error("USER_STAGE_UPDATE_FAILED");
    }
    return { userStage: "THREEC" };
}
