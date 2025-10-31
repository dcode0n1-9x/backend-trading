import { TradingExperience, MartialStatus } from '../../../generated/prisma';
import type { AnnualIncome, Occupation, PrismaClient } from "../../../generated/prisma";
import { generateSignedURL } from '../../utils/s3.utils';


interface RegisterData {
    fileType: string
}

interface IRegisterProp {
    prisma: PrismaClient;
    data: RegisterData;
    userId: string;
}

export async function presignedURLSignature({ prisma, data, userId }: IRegisterProp) {
    const { fileType } = data;
    const presignedUrl = await generateSignedURL(`${userId}/kyc/documents`, fileType);
    return { presignedUrl };
}
