export type ILang = "en" | 'arb' | "hi";

export const Lang: ReadonlyArray<ILang> = ["en", "arb", "hi"]

export const getMessage = (content: any, lang: ILang): string | null => {
    if (!content) return null;
    if (typeof content === "string") return content;
    return content[lang] ?? content["en"] ?? null;
};

// utils/statusCodec.ts
const STATUS_NAME_TO_CODE: Record<string, number> = {
    "Continue": 100,
    "Switching Protocols": 101,
    "Processing": 102,
    "Early Hints": 103,
    "OK": 200,
    "Created": 201,
    "Accepted": 202,
    "Non-Authoritative Information": 203,
    "No Content": 204,
    "Reset Content": 205,
    "Partial Content": 206,
    "Multiple Choices": 300,
    "Moved Permanently": 301,
    "Found": 302,
    "See Other": 303,
    "Not Modified": 304,
    "Temporary Redirect": 307,
    "Permanent Redirect": 308,
    "Bad Request": 400,
    "Unauthorized": 401,
    "Payment Required": 402,
    "Forbidden": 403,
    "Not Found": 404,
    "Method Not Allowed": 405,
    "Not Acceptable": 406,
    "Proxy Authentication Required": 407,
    "Request Timeout": 408,
    "Conflict": 409,
    "Gone": 410,
    "Length Required": 411,
    "Precondition Failed": 412,
    "Payload Too Large": 413,
    "URI Too Long": 414,
    "Unsupported Media Type": 415,
    "Range Not Satisfiable": 416,
    "Expectation Failed": 417,
    "I'm a teapot": 418,
    "Misdirected Request": 421,
    "Unprocessable Content": 422,
    "Locked": 423,
    "Failed Dependency": 424,
    "Too Early": 425,
    "Upgrade Required": 426,
    "Precondition Required": 428,
    "Too Many Requests": 429,
    "Request Header Fields Too Large": 431,
    "Unavailable For Legal Reasons": 451,
    "Internal Server Error": 500,
    "Not Implemented": 501,
    "Bad Gateway": 502,
    "Service Unavailable": 503,
    "Gateway Timeout": 504,
    "HTTP Version Not Supported": 505,
};

export const getStatusCode = (status: number | string | undefined): number => {
    if (status === undefined) return 200;
    if (typeof status === 'number') return status;
    return STATUS_NAME_TO_CODE[status] ?? 200;
};


export const handleResponse = (
    status: number | string,
    value: any,
    lang: ILang = "en"
) => {
    // Handle error objects thrown from routes
    if (value instanceof Error) {
        return {
            success: false,
            message: getMessage(value.message, lang) || "Internal server error",
        };
    }

    const selectedMessage = getMessage(value, lang);

    if (status > 299 && typeof status !== "string") {  // Use 299 instead of 205 to catch all non-success codes
        return {
            success: false,
            message: selectedMessage || "An error occurred",
        };
    }

    if (selectedMessage) {
        return {
            success: true,
            message: selectedMessage,
        };
    }

    return {
        success: true,
        data: { ...(value || {}) },
    };
};


export const errors = {
    user_exist: {
        en: "USER_ALREADY_EXISTS",
        arb: "المستخدم موجود بالفعل",
        hi: "उपयोगकर्ता पहले से मौजूद है"
    },
    user_create: {
        en: "ERROR_CREATING_USER",
        arb: "خطأ في إنشاء المستخدم",
        hi: "उपयोगकर्ता बनाने में त्रुटि"
    },
    otp_limit_exceeded: {
        en: "OTP_LIMIT_EXCEEDED",
        arb: "تم تجاوز حد OTP",
        hi: "ओटीपी सीमा पार हो गई"
    },
    otp_expired: {
        en: "OTP_EXPIRED",
        arb: "انتهت صلاحية OTP",
        hi: "ओटीपी की अवधि समाप्त हो गई"
    },
    invalid_otp: {
        en: "INVALID_OTP",
        arb: "OTP غير صالح",
        hi: "अमान्य ओटीपी"
    },
    internal_server_error: {
        en: "INTERNAL_SERVER_ERROR",
        arb: "خطأ داخلي في الخادم",
        hi: "आंतरिक सर्वर त्रुटि"
    },
};



export const success = {
    user_create: {
        en: "USER_CREATED_SUCCESSFULLY",
        arb: "تم إنشاء المستخدم بنجاح",
        hi: "उपयोगकर्ता सफलतापूर्वक बनाया गया"
    }
}