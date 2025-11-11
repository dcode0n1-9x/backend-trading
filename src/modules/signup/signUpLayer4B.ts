

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
    const { nominee } = data;

    return await prisma.$transaction(async (tx) => {
        // 1. Validate stage atomically
        const verification = await tx.userVerification.findUnique({
            where: { userId },
            select: { stage: true }
        });

        if (verification?.stage !== "FOURA") {
            throw new Error(`INVALID_USER_STAGE: Expected FOURA, got ${verification?.stage}`);
        }

        // 2. Bulk create nominees (efficient)
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

        await tx.nominee.createMany({
            data: mapped,
            skipDuplicates: true
        });

        // 3. Single update with nested updates (one query)
        const result = await tx.user.update({
            where: { id: userId },
            data: {
                isVerified: true,
                userVerification: {
                    update: { stage: "FOURB" } // Fixed: was 'FOURA'
                }
            },
            include: {
                nominees: true,
                userVerification: true
            }
        });

        return { userStage: "FOURB", data: result };
    });
}
