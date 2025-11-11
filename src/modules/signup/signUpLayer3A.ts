

import type { TradingExperience, MartialStatusType, AnnualIncome, BankAccountType, OccupationType, PrismaClient } from "../../../generated/prisma";


interface RegisterData {
    fatherName: string,
    motherName: string,
    maritalStatus: MartialStatusType    ,
    annualIncome: AnnualIncome,
    tradingExperience: TradingExperience,
    occupation: OccupationType,
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
    userId: string;
}

export async function signUpLayer3A({ prisma, data, userId }: IRegisterProp) {
    const { fatherName, motherName, maritalStatus, annualIncome, tradingExperience, occupation } = data;

    return await prisma.$transaction(async (tx) => {
        // Validate stage
        const verification = await tx.userVerification.findUnique({
            where: { userId },
            select: { stage: true }
        });

        if (verification?.stage !== "TWO") {
            throw new Error(`INVALID_USER_STAGE: Expected TWO, got ${verification?.stage}`);
        }

        // Update user with nested profile upsert
        const result = await tx.user.update({
            where: { id: userId },
            data: {
                profile: {
                    upsert: {
                        create: {
                            fatherName,
                            motherName,
                            maritalStatus,
                            annualIncome,
                            tradingExperience,
                            occupation
                        },
                        update: {
                            fatherName,
                            motherName,
                            maritalStatus,
                            annualIncome,
                            tradingExperience,
                            occupation
                        }
                    }
                },
                userVerification: {
                    update: {
                        stage: "THREEA"
                    }
                }
            },
            include: {
                profile: true,
                userVerification: true
            }
        });

        return { userStage: "THREEA", data: result };
    });
}
