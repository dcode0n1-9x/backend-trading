import {
    DeleteObjectCommand,
    PutObjectCommand,
    //   HeadObjectCommand,
    //   ListObjectsV2Command,
    //   DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../config/s3/s3.config";
import { config } from "../config/generalconfig";


export const generateSignedURL = async (filePath: string, fileType: string = "image/jpeg") => {
    const command = new PutObjectCommand({
        Bucket: config.R2.R2_BUCKET,
        Key: filePath,
        ContentType: fileType
    });
    const url = await getSignedUrl(s3Client as any, command as any, { expiresIn: 3600 });
    return url;
};


export async function deleteImageFromR2(filePath: string,): Promise<boolean> {
    try {
        const command = new DeleteObjectCommand({
            Bucket: config.R2.R2_BUCKET,
            Key: filePath,
        });
        let response = await s3Client.send(command);
        console.log(response)
        return true;
    } catch (error) {
        console.log(error)
        return false; // Or handle as a soft error
    }
}

