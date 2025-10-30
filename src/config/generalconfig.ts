import * as dotenv from "dotenv";
dotenv.config();
export const config = {
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
    BUN_ENV: process.env.BUN_ENV || 'production',
    HOSTNAME: process.env.HOSTNAME || 'http://localhost:3000',
};
