import { PrismaClient } from "../../../generated/prisma";
import { HttpResponse } from "../../utils/response/success";

type BankAccountDetail = {
    accountNumber: string;
    branchCode: string;
};

type UserWithBankAccount = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    countryCode: string;
    panNumber: string;
    bankAccounts: BankAccountDetail[];
    orderNumber: string | null;
};

export async function getMarginDetails({
    prisma,
}: {
    prisma: PrismaClient;
    userId: string
}) {
    try {
        const user = await prisma.$queryRaw<UserWithBankAccount[]>`
        `;
        return user[0] || null;
    } catch (error) {
        throw new Error("FAILED_TO_FETCH_USER_DETAILS");
    }
}
