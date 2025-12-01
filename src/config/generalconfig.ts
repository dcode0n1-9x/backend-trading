import * as dotenv from "dotenv";
dotenv.config();
export const config = {
    PORT : Number(process.env.PORT) || 3000,
    REDIS: process.env.REDIS_URI!,
    SMS : {
        MAX_OTP_PER_DAY: Number(process.env.MAX_OTP_PER_DAY) || 5,
        MAX_OTP_FORGET_PASSWORD_PER_DAY: Number(process.env.MAX_OTP_FORGET_PASSWORD_PER_DAY) || 2,
        AUTHENTIC_KEY: process.env.AUTHENTIC_KEY || ''
    },
    JWT : {
        SECRET: process.env.JWT_SECRET || '',
        EXPIRY_IN: 86400,
        REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '',
        REFRESH_EXPIRY_IN: 604800
    },
    SALT  : process.env.SALT || '',
    GOOGLE : {
        CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
        CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || ''
    },
    NODEMAILER : {
        FROM_EMAIL: process.env.FROM_EMAIL || '',
        HOST: process.env.MAILER_HOST || '',
        USER: process.env.MAILER_USER || '',
        PASS: process.env.MAILER_PASS || ''
    },
    BUN_ENV: process.env.BUN_ENV || 'development',
    HOSTNAME: process.env.HOSTNAME || 'http://localhost:3000',
    S3: {
        ENDPOINT: process.env.S3_ENDPOINT!,
        ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID!,
        SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY!,
        REGION: process.env.S3_REGION!,
        BUCKET: process.env.S3_BUCKET!,
        R2_PUBLIC_URL: process.env.R2_PUBLIC_URL!
    },
    KAFKA : {
        BROKERS: process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(",") : ["localhost:9092"],
        CLIENT_ID: process.env.KAFKA_CLIENT_ID || "trading-api-server"
    },
    MASTER_OTP: process.env.MASTER_OTP || '123456',
    PRISMA_OPTIMIZE_API_KEY: process.env.OPTIMIZE_API_KEY || ''
};
