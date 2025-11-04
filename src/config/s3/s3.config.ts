import {  S3Client } from '@aws-sdk/client-s3';
import { config } from '../generalconfig';

export const s3Client = new S3Client({
    // endpoint: config.S3.ENDPOINT,
    region: config.S3.REGION,
    requestChecksumCalculation: 'WHEN_REQUIRED',
    credentials: {
        accessKeyId: config.S3.ACCESS_KEY_ID!,
        secretAccessKey: config.S3.SECRET_ACCESS_KEY!,
    },
});

