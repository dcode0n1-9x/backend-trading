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
        prisma.userVerification.update({
            where: { userId, stage: 'ZERO' },
            data: { stage: 'ONE' }
        }),
    ])
    if (!updatedUser) {
        throw new Error("USER_UPDATE_FAILED");
    }
    console.log("Updated Stage:", updatedStage);
    if (!updatedStage) {
        throw new Error("USER_STAGE_UPDATE_FAILED");
    }
    if (email) {
        // SEND KAFKA EMAIL EVENT
    }
    return { userStage: "ONE" };
}
