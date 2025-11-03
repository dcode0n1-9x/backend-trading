import type { PrismaClient } from "../../../generated/prisma";
import { generateSignedURL } from '../../utils/s3.utils';


interface RegisterData {
    fileType: string
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
    userId: string;
}

export async function presignedURLSignature({ data, userId }: IRegisterProp) {
    const { fileType } = data;
    const presignedUrl = await generateSignedURL(`${userId}/kyc/signature`, fileType);
    return { presignedUrl };
}
