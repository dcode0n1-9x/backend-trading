import type { PrismaClient } from "../../../generated/prisma";


interface RegisterData {
    panNumber: string,
    dob: string,
    email: string,
    name: string
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
    userId: string;
}

export async function signUpLayer1({ prisma, data, userId }: IRegisterProp) {
    const { panNumber, dob, email, name } = data;
    const checkLayers = await prisma.userVerification.findUnique({
        where: { userId, stage: 'ZERO' },
    });
    if (!checkLayers) {
        throw new Error("INVALID_USER_STAGE");
    } else {
        const [updatedUser, updatedStage] = await prisma.$transaction([
            prisma.user.update({
                where: { id: userId },
                data: {
                    panNumber,
                    dob: new Date(dob), // ensure date format
                    email,
                    firstName: name
                },
            }),
            prisma.userVerification.findUnique({
                where: { userId, stage: 'ONE' }, // enum string matching Prisma schema
            }),
        ])
        if (!updatedUser) {
            throw new Error("USER_UPDATE_FAILED");
        }
        if (!updatedStage) {
            throw new Error("USER_STAGE_UPDATE_FAILED");
        }
        if (email) {
            // SEND KAFKA EMAIL EVENT
        }
        return { userStage: "ONE" };
    }
}
