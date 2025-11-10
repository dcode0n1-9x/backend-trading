

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
    const { fatherName, motherName, maritalStatus, annualIncome, tradingExperience, occupation} = data;
    const checkLayers = await prisma.userVerification.findUnique({
        where: { userId, stage: 'TWO' },
    });
    if (!checkLayers) {
        throw new Error("INVALID_USER_STAGE");
    }
    const [updateUser, updateStage] = await prisma.$transaction([
        prisma.userProfile.create({
            data: {
                userId,
                fatherName,
                motherName,
                maritalStatus,
                annualIncome,
                tradingExperience,
                occupation
            }
        }),
        prisma.userVerification.update({
            where: { userId: userId },
            data: { stage: "THREEA" }
        })
    ])
    if (!updateUser) {
        throw new Error("USER_UPDATE_FAILED");
    }
    if (!updateStage) {
        throw new Error("USER_STAGE_UPDATE_FAILED");
    }
    return { userStage: "THREE" };
}
