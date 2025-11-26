import { PrismaClient } from "../../../generated/prisma/client";
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

export async function getFullDetail({
    prisma,
    userId
}: {
    prisma: PrismaClient;
    userId: string
}) {
    try {
        const user = await prisma.$queryRaw<UserWithBankAccount[]>`
            SELECT 
                u.id,
                u."firstName",
                u."lastName",
                u.email,
                u.segment,
                CONCAT('****', RIGHT(u."phone", 4)) as "phone",
                LEFT(u."phone", LENGTH(u."phone") - 10) as "countryCode",
                CONCAT('****', RIGHT(u."panNumber", 4)) as "panNumber",
                COALESCE(
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'accountNumber', CONCAT('****', RIGHT(ba."accountNumber", 4)),
                            'branchCode', ba."branchName"
                        )
                    ) FILTER (WHERE ba.id IS NOT NULL),
                    '[]'::json
                ) as "bankAccounts",
                NULL as "orderNumber"
            FROM "User" as u
            LEFT JOIN "BankAccount" as ba ON u.id = ba."userId"
            LEFT JOIN "Holding" as h ON u.id = h."userId"
            LEFT JOIN "UserProfile" as up ON u.id = up."userId"
            WHERE u.id = ${userId}
            GROUP BY u.id, u."firstName", u."lastName", u.email, u."phone", u."panNumber"
        `;
        return user[0] || null;
    } catch (error) {
        throw new Error("FAILED_TO_FETCH_USER_DETAILS");
    }
}
