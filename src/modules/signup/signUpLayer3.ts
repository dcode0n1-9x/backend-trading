import { TradingExperience, MartialStatus } from './../../../generated/prisma/index.d';
import type { AnnualIncome, Occupation, PrismaClient } from "../../../generated/prisma";


interface RegisterData {
    fatherName: string,
    motherName: string,
    maritalStatus: MartialStatus,
    annualIncome: AnnualIncome,
    tradingExperience: TradingExperience,
    occupation: Occupation
    upiId : string,
    accountNumber : string,
    ifscCode : string,
    bankName : string,
    branchName : string,
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
    userId: string;
}

export async function signUpLayer3({ prisma, data, userId }: IRegisterProp) {
    const { fatherName, motherName, maritalStatus, annualIncome, tradingExperience, occupation } = data;
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
            data: { stage: "THREE" }
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
