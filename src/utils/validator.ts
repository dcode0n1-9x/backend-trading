import { OTPPreferenceType ,Segment, AnnualIncome, OccupationType, TradingExperience, MartialStatusType, BankAccountType, RelationshipType } from "../../generated/prisma";
import { Elysia, t } from "elysia";
import { config } from "../config/generalconfig";



// Signup Layers
const sendOTPLayer = t.Object({
  phone: t.String({ minLength: 10, maxLength: 15, example: "1234567890", error: "INVALID_PHONE_FORMAT" }),
});

const verifyOTPLayer = t.Object({
  phone: t.String({ minLength: 10, maxLength: 15, example: "1234567890", error: "INVALID_PHONE_FORMAT" }),
  otp: t.String({ minLength: 6, maxLength: 6, example: "123456", error: "INVALID_OTP_FORMAT" }),
});

const verificationLayer1 = t.Object({
  dob: t.String({ format: "date-time", example: "1990-01-01T00:00:00Z", error: "INVALID_DOB_FORMAT" }),
  panNumber: t.String({ minLength: 10, maxLength: 10, example: "ABCDE1234F", error: "INVALID_PAN_FORMAT" }),
  email: t.String({ format: "email", example: "example@example.com", error: "INVALID_EMAIL_FORMAT" }),
  name: t.String({ example: "John Doe", error: "INVALID_NAME_FORMAT" }),
});

const verificationLayer2 = t.Object({
  segment: t.Enum(Segment, { example: "EQUITY", error: "INVALID_SEGMENT_FORMAT" }),
  aadhaarNumber: t.String({ minLength: 12, maxLength: 12, example: "123456789012", error: "INVALID_AADHAAR_FORMAT" }),
});



// Define common fields as a separate schema
const commonFields = {
  fatherName: t.String({ example: "John Doe Sr.", error: "INVALID_FATHER_NAME_FORMAT" }),
  motherName: t.String({ example: "Jane Doe", error: "INVALID_MOTHER_NAME_FORMAT" }),
  maritalStatus: t.Enum(MartialStatusType, { example: "SINGLE", error: "INVALID_MARITAL_STATUS_FORMAT" }),
  annualIncome: t.Enum(AnnualIncome, { example: "BETWEEN_1_TO_5_LAKHS", error: "INVALID_ANNUAL_INCOME_FORMAT" }),
  tradingExperience: t.Enum(TradingExperience, { example: "NEW", error: "INVALID_TRADING_EXPERIENCE_FORMAT" }),
  occupation: t.Enum(OccupationType, { example: "STUDENT", error: "INVALID_OCCUPATION_FORMAT" }),
}

const upiVariant = t.Object({
  ...commonFields,
  upiId: t.String({ minLength: 5, maxLength: 15, example: "john.doe@bank", error: "INVALID_UPI_FORMAT" }),
})

const bankVariant = t.Object({
  ...commonFields,
  accountNumber: t.String({ minLength: 10, maxLength: 10, example: "1234567890", error: "INVALID_ACCOUNT_NUMBER_FORMAT" }),
  ifscCode: t.String({ minLength: 11, maxLength: 11, example: "SBIN0001234", error: "INVALID_IFSC_FORMAT" }),
  bankName: t.String({ minLength: 2, maxLength: 100, example: "State Bank of India", error: "INVALID_BANK_NAME_FORMAT" }),
  branchName: t.String({ minLength: 2, maxLength: 100, example: "Connaught Place", error: "INVALID_BRANCH_NAME_FORMAT" }),
  accountType: t.Enum(BankAccountType, { example: "SAVINGS", error: "INVALID_ACCOUNT_TYPE_FORMAT" }),
  accountHolderName: t.String({ minLength: 2, maxLength: 100, example: "John Doe", error: "INVALID_ACCOUNT_HOLDER_NAME_FORMAT" }),
  micrCode: t.String({ minLength: 9, maxLength: 9, example: "110002000", error: "INVALID_MICR_CODE_FORMAT" }),
})

// Union of variants
const verificationLayer3 = t.Union([upiVariant, bankVariant]);

const presignedURLRequest = t.Object({
  fileType: t.String({ example: "image/png", error: "INVALID_FILE_TYPE_FORMAT" }),
});

const verificationLayer4 = t.Object({
  signature: t.String({ example: `https://${config.S3.BUCKET}.s3.${config.S3.REGION}.amazonaws.com/cmhk8ryhl0000kev0hxkw5cyw/kyc/signature`, error: "INVALID_SIGNATURE_FORMAT" }),
  nominee: t.Array(t.Object({
    name: t.String({ minLength: 2, maxLength: 100, example: "John Doe" }),
    email: t.String({ format: "email", example: "john.doe@example.com" }),
    phone: t.String({ minLength: 10, maxLength: 15, example: "1234567890" }),
    relationship: t.Enum(RelationshipType, { example: "SPOUSE" }),
    percentage: t.Number({ minimum: 0, maximum: 100, example: 50 }),
    panNumber: t.String({ minLength: 10, maxLength: 10, example: "ABCDE1234F" }),
    dob: t.String({ format: "date-time", example: "1990-01-01T00:00:00Z" }),
    address: t.String({ minLength: 10, maxLength: 500, example: "123 Main St, City, Country" }),
  })
  ),
})

// Login Body
const loginBody = t.Union([
  t.Object({
    email: t.String({ format: "email", error: "INVALID_EMAIL_FORMAT", example: "john.doe@example.com" }),
    password: t.String({ minLength: 8, error: "INVALID_PASSWORD_FORMAT", example: "strongpassword123" })
  }),
  t.Object({
    phone: t.String({ minLength: 10, maxLength: 15, error: "INVALID_PHONE_FORMAT", example: "1234567890" }),
    password: t.String({ minLength: 8, error: "INVALID_PASSWORD_FORMAT", example: "strongpassword123" })
  })
]);

const forgetPasswordBody = {
  userIdentifier: t.Optional(t.String({ minLength: 5, maxLength: 100, example: "<user_identifier>" })),
  panNumber: t.String({ minLength: 10, maxLength: 10, example: "ABCDE1234F" }),
  receiveOn: t.Enum(OTPPreferenceType, { example: "EMAIL" }),
};


const forgetPasswordEmailVarient = t.Object({
  ...forgetPasswordBody,
  email: t.String({ format: "email", example: "john.doe@example.com" }),
})

const forgetPasswordPhoneVarient = t.Object({
  ...forgetPasswordBody,
  phone: t.String({ minLength: 10, maxLength: 15, example: "1234567890" }),
})

const forgetPasswordValidator = t.Union([forgetPasswordEmailVarient, forgetPasswordPhoneVarient]);


const verifyOTPForgetPasswordLayer = t.Object({
  token: t.String({ minLength: 10, maxLength: 100, example: "abcdef1234567890" }),
  password: t.String({ minLength: 8, error: "INVALID_PASSWORD_FORMAT", example: "strongpassword123" })
});

export const passwordValidator = new Elysia().model({
  "auth.forgetpassword": forgetPasswordValidator,
  "auth.verifyotp.forgetpassword": verifyOTPForgetPasswordLayer,
});

export const signUpValidator = new Elysia().model({
  "auth.signup.sendotp": sendOTPLayer,
  "auth.signup.verifyotp": verifyOTPLayer,
  "auth.signup.layer1": verificationLayer1,
  "auth.signup.layer2": verificationLayer2,
  "auth.signup.layer3": verificationLayer3,
  "auth.signup.presigned": presignedURLRequest,
  "auth.signup.layer4": verificationLayer4,
})



export const authValidator = new Elysia().model({
  "auth.login": loginBody,
});
