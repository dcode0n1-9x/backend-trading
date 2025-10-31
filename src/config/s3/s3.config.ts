import {  S3Client } from '@aws-sdk/client-s3';
import { config } from '../generalconfig';

export const s3Client = new S3Client({
    endpoint: config.R2.R2_ENDPOINT,
    region: config.R2.R2_REGION,
    requestChecksumCalculation: 'WHEN_REQUIRED',
    credentials: {
        accessKeyId: config.R2.R2_ACCESS_KEY_ID!,
        secretAccessKey: config.R2.R2_SECRET_ACCESS_KEY!,
    },
});

