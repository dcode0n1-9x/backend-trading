import { generateSignedURL } from '../../utils/s3.utils';


interface RegisterData {
    fileType: string
}

interface IRegisterProp {
    data: RegisterData;
    userId: string;
}

export async function presignedURLAvatar({ data, userId }: IRegisterProp) {
    const { fileType } = data;
    const presignedUrl = await generateSignedURL(`${userId}/avatar`, fileType);
    return { presignedUrl };
}
