import type { PrismaClient, Segment } from "../../../generated/prisma";


interface RegisterData {
    aadhaarNumber: string,
    segment: Segment[],
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
    userId: string;
}

export async function signUpLayer2({ prisma, data, userId }: IRegisterProp) {
    const { aadhaarNumber, segment } = data;
    const checkLayers = await prisma.userVerification.findUnique({
        where: { userId, stage: 'ONE' },
    });
    if (!checkLayers) {
        throw new Error("INVALID_USER_STAGE");
    }
    if (aadhaarNumber) {
        // SEND DIGILOCKER OR VERIFICATION CHANNEL TO CHECK IF IT IS GOOD OR NOT
        //CONSENT SCREEN OR 3RD PARTY INTEGRATION TO VERIFY THE AADHAR CARD AND THE PAN CARD.
    }
    const updateUser = await prisma.user.update({
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
        include: {
            userVerification: true
        }
    })
    if (!updateUser) {
        throw new Error("USER_UPDATE_FAILED");
    }
    return { userStage: "TWO" };
}
