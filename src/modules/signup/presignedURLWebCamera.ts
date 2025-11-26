import type { PrismaClient } from "../../../generated/prisma/client";
import { HttpResponse } from "../../utils/response/success";
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
    return new HttpResponse(200, "PRESIGNED_URL_GENERATED", { presignedUrl }).toResponse();
}
