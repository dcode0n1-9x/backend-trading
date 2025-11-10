

import type { PrismaClient, RelationshipType } from "../../../generated/prisma";


interface RegisterData {
    nominee: {
        name: string,
        email: string,
        phone: string
        percentage: number
        relationship: RelationshipType
        panNumber: string
        dob: string
        address: string
    }[]
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
    userId: string;
}

export async function signUpLayer4B({ prisma, data, userId }: IRegisterProp) {
    const { nominee} = data;
    const checkLayers = await prisma.userVerification.findUnique({
        where: { userId, stage: 'FOURA' },
    });

    if (!checkLayers) {
        throw new Error("INVALID_USER_STAGE");
    }
    const mapped = nominee.map((nom) => ({
        userId,
        name: nom.name,
        email: nom.email,
        phone: nom.phone,
        percentage: nom.percentage,
        relationship: nom.relationship,
        panNumber: nom.panNumber,
        dob: new Date(nom.dob),
        address: nom.address
    }));
    const createNominee = await prisma.$transaction([
        prisma.nominee.createMany({
            data: mapped,
            skipDuplicates: true
        }),
        prisma.userVerification.update({
            where: { userId : userId },
            data: { stage: 'FOURA' }
        }),
        prisma.user.update({
            where: { id: userId },
            data: { isVerified: true }
        })
    ]);
    if (!createNominee) {
        throw new Error("SIGNUP_FAILED");
    }
    return { userStage: "FOURB" };
}
