

import type { TradingExperience, MartialStatusType, AnnualIncome, BankAccountType, OccupationType, PrismaClient } from "../../../generated/prisma";


interface RegisterData {
    fatherName: string,
    motherName: string,
    maritalStatus: MartialStatusType    ,
    annualIncome: AnnualIncome,
    tradingExperience: TradingExperience,
    occupation: OccupationType,
    upiId?: string,
    accountNumber?: string,
    ifscCode?: string,
    bankName?: string,
    branchName?: string,
    accountType?: BankAccountType,
    accountHolderName?: string,
    micrCode?: string
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
    userId: string;
}

export async function signUpLayer3({ prisma, data, userId }: IRegisterProp) {
    const { fatherName, motherName, maritalStatus, annualIncome, tradingExperience, occupation, upiId, accountNumber, ifscCode, bankName, branchName, accountType, accountHolderName, micrCode } = data;
    let createBankAccounts = { userId, isPrimary: true, isVerified: true } as any;
    const checkLayers = await prisma.userVerification.findUnique({
        where: { userId, stage: 'TWO' },
    });
    if (!checkLayers) {
        throw new Error("INVALID_USER_STAGE");
    }
    if (upiId) {
        createBankAccounts["upiId"] = upiId
    } else {
        createBankAccounts["accountNumber"] = accountNumber;
        createBankAccounts["ifscCode"] = ifscCode;
        createBankAccounts["bankName"] = bankName;
        createBankAccounts["branchName"] = branchName;
        createBankAccounts["accountType"] = accountType;
        createBankAccounts["accountHolderName"] = accountHolderName;
        createBankAccounts["micrCode"] = micrCode;
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
        prisma.bankAccount.create({
            data: createBankAccounts
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
