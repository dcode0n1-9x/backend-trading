

import type { BankAccountType, PrismaClient } from "../../../generated/prisma";


interface RegisterData {
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
export async function signUpLayer3B({ prisma, data, userId }: IRegisterProp) {
    const { upiId, accountNumber, ifscCode, bankName, branchName, accountType, accountHolderName, micrCode } = data;

    return await prisma.$transaction(async (tx) => {
        // 1. Validate stage atomically
        const verification = await tx.userVerification.findUnique({
            where: { userId },
            select: { stage: true }
        });

        if (verification?.stage !== "THREEA") {
            throw new Error(`INVALID_USER_STAGE: Expected THREEA, got ${verification?.stage}`);
        }

        // 2. Single update with nested creates (one database call)
        const result = await tx.user.update({
            where: { id: userId },
            data: {
                bankAccounts: {
                    create: {
                        isPrimary: true,
                        isVerified: true,
                        ...(upiId ? { upiId } : {
                            accountNumber,
                            ifscCode,
                            bankName,
                            branchName,
                            accountType,
                            accountHolderName,
                            micrCode
                        })
                    }
                },
                userVerification: {
                    update: {
                        stage: "THREEB"
                    }
                }
            },
            include: {
                bankAccounts: {
                    where: { isPrimary: true }
                },
                userVerification: true
            }
        });

        return { userStage: "THREEB", data: result };
    });
}

