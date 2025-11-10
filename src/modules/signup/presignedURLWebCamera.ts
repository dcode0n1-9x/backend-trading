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

export async function presignedURLWebCamera({ data, userId }: IRegisterProp) {
    const { fileType } = data;
    const presignedUrl = await generateSignedURL(`${userId}/kyc/web-camera`, fileType);
    return { presignedUrl };
}
