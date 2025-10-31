import type { PrismaClient, Segment } from "../../../generated/prisma";


interface RegisterData {
    aadhaarNumber: string,
    segment: Segment,
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
    userId: string;
}

export async function signUpLayer2({ prisma, data, userId }: IRegisterProp) {
    const { aadhaarNumber, segment } = data;
    if (aadhaarNumber) {
        // SEND DIGILOCKER OR VERIFICATION CHANNEL TO CHECK IF IT IS GOOD OR NOT
        //CONSENT SCREEN OR 3RD PARTY INTEGRATION TO VERIFY THE AADHAR CARD AND THE PAN CARD.
    }
    const [updateUser, updateStage] = await prisma.$transaction([
        prisma.user.update({
            where: { id: userId },
            data: { aadhaarNumber, segment },
        }),
        prisma.userVerification.update({
            where: { userId: userId },
            data: { stage: "TWO" }
        })
    ])
    if (!updateUser) {
        throw new Error("USER_UPDATE_FAILED");
    }
    if (!updateStage) {
        throw new Error("USER_STAGE_UPDATE_FAILED");
    }
    return { userStage: "TWO" };
}
