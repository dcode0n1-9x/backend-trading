import * as dotenv from "dotenv";
dotenv.config();
export const config = {
    PORT : Number(process.env.PORT) || 3000,
    REDIS: process.env.REDIS_URI!,
    SMS : {
        MAX_OTP_PER_DAY: Number(process.env.MAX_OTP_PER_DAY) || 5,
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
    BUN_ENV: process.env.BUN_ENV || 'production',
    HOSTNAME: process.env.HOSTNAME || 'http://localhost:3000',
    R2: {
        R2_ENDPOINT: process.env.R2_ENDPOINT!,
        R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID!,
        R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY!,
        R2_REGION: process.env.R2_REGION!,
        R2_BUCKET: process.env.R2_BUCKET!,
        R2_PUBLIC_URL: process.env.R2_PUBLIC_URL!
    },
};
