import { errors } from "./responseCodec";

export class AppError extends Error {
    constructor(
        public code: keyof typeof errors,
        public status: number
    ) {
        super(code);
        this.name = 'AppError';
    }
}

// Helper function to throw app errors
export const throwError = (code: keyof typeof errors, status: number): never => {
    throw new AppError(code, status);
};