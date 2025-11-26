

import type { BankAccountType, PrismaClient } from "../../../generated/prisma/client";
import { HttpResponse } from "../../utils/response/success";


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
            return new HttpResponse(400, `INVALID_USER_STAGE: Expected THREEA, got ${verification?.stage}`).toResponse();
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
            select: {
                firstName: true,
                email: true,
            }
        });

        return new HttpResponse(200, "LAYER3B_COMPLETED", result).toResponse();
    });
}

