import { PrismaClient } from "../../../generated/prisma/client";


interface IRegisterProp {
    prisma: PrismaClient;
    userId: string
}

export async function getCurrentStage({
    prisma,
    userId
}: IRegisterProp) {
    try {
        return await prisma.user.findFirst({
            where: {
                id: userId
            },
            include: {
                verification: {
                    select: {
                        stage: true
                    }
                }
            }
        })
    } catch (error) {
        throw new Error("FAILED_TO_FETCH_USER_DETAILS");
    }
}
