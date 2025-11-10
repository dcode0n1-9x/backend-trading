import { PrismaClient } from "../../../generated/prisma";


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
                userVerification: {
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
