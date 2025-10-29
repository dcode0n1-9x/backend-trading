import crypto from "crypto";
export const generateOTP = () => {
    const otp = Array.from(crypto.randomBytes(7))
        .map((byte) => byte.toString(10))
        .join("")
        .slice(0, 6);
    return otp
}