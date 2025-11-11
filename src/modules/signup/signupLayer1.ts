import type { PrismaClient } from "../../../generated/prisma";


interface RegisterData {
    panNumber: string,
    dob: string,
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
    userId: string;
}

export async function signUpLayer1({ prisma, data, userId }: IRegisterProp) {
    const { panNumber, dob } = data;

    const updateUser = await prisma.user.update({
        where: { id: userId , userVerification :  {
            stage : 'ZERO'
        } },
        data: {
            panNumber,
            dob: new Date(dob), // ensure date format
            userVerification: {
                update: {
                    stage: "ONE"
                }
            }
        },
        include: {
            userVerification: true
        }
    })
    if (!updateUser) {
        throw new Error("USER_UPDATE_FAILED");
    }
    return { userStage: "ONE" };
}
