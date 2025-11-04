import { PrismaClient } from "../../../generated/prisma";


type UserWithBankAccount = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    countryCode: string;
    panNumber: string;
    bankAccount: string | null; // nullable if UserProfile might not exist
}


export async function getFullDetail({ prisma, userId }: { prisma: PrismaClient; userId: string }) {
    const user = await prisma.$queryRaw<UserWithBankAccount>`
    SELECT 
        id,
        "firstName",
        "lastName",
        email
        SUBSTR("phone", -4) as "phone",
        SUBSTR("phone" , 1, LENGTH("phone") - 2) as "countryCode",
        SUBSTR("panNumber", -4) as "panNumber",
        COALESCE(
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'accountNumber', SUBSTR(ba."accountNumber", -4),
                        'branchCode', ba."branchName"
                    )
                ) FILTER (WHERE ba.id IS NOT NULL),
                '[]'::json
            ) as "bankAccounts",
        o."orderNumber" as "orderNumber"
    FROM "User" as u
    LEFT JOIN "BankAccount" as ba ON u.id = ba."userId"
    LEFT JOIN "UserProfile" as up ON u.id = up."userId"
    LEFT JOIN "Order" as o ON u.id = o."userId"
    WHERE id = ${userId}
`;
console.log("User Details:", user);
    return user
}
