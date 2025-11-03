import { Segment, AnnualIncome, OccupationType, TradingExperience, MartialStatusType, BankAccountType, RelationshipType } from "../../generated/prisma";
import { Elysia, t } from "elysia";



// Signup Layers
const sendOTPLayer = t.Object({
  phone: t.String({ minLength: 10, maxLength: 15, example: "1234567890" }),
});
const verifyOTPLayer = t.Object({
  phone: t.String({ minLength: 10, maxLength: 15, example: "1234567890" }),
  otp: t.String({ minLength: 6, maxLength: 6, example: "123456" }),
});
const verificationLayer1 = t.Object({
  dob: t.String({ format: "date-time", example: "1990-01-01T00:00:00Z" }),
  panNumber: t.String({ minLength: 10, maxLength: 10, example: "ABCDE1234F" }),
  email: t.String({ format: "email", example: "example@example.com" }),
  name: t.String({ example: "John Doe" }),
});
const verificationLayer2 = t.Object({
  segment: t.Enum(Segment, { example: "EQUITY" }),
  aadhaarNumber: t.String({ minLength: 12, maxLength: 12, example: "123456789012" }),
});
const verificationLayer3 = t.Object({
  fatherName: t.String({ example: "John Doe Sr." }),
  motherName: t.String({ example: "Jane Doe" }),
  maritalStatus: t.Enum(MartialStatusType, { example: "SINGLE" }),
  annualIncome: t.Enum(AnnualIncome, { example: "BETWEEN_1_TO_5_LAKHS" }),
  tradingExperience: t.Enum(TradingExperience, { example: "NEW" }),
  occupation: t.Enum(OccupationType, { example: "STUDENT" }),
  upiId: t.String({ minLength: 5, maxLength: 15, example: "john.doe@bank" }),
  accountNumber: t.String({ minLength: 10, maxLength: 10, example: "1234567890" }),
  ifscCode: t.String({ minLength: 11, maxLength: 11, example: "SBIN0001234" }),
  bankName: t.String({ minLength: 2, maxLength: 100, example: "State Bank of India" }),
  branchName: t.String({ minLength: 2, maxLength: 100, example: "Connaught Place" }),
  accountType: t.Enum(BankAccountType, { example: "SAVINGS" }),
  accountHolderName: t.String({ minLength: 2, maxLength: 100, example: "John Doe" }),
  micrCode: t.String({ minLength: 9, maxLength: 9, example: "110002000" }),
});

const presignedURLRequest = t.Object({
  fileType: t.String({ example: "image/png" }),
});

const verififcationLayer4 = t.Object({
  signature: t.String({ example: "base64encodedsignaturestring@url.com" }),
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


export const signUpValidator = new Elysia().model({
  "auth.signup.sendotp": sendOTPLayer,
  "auth.signup.verifyotp": verifyOTPLayer,
  "auth.signup.layer1": verificationLayer1,
  "auth.signup.layer2": verificationLayer2,
  "auth.signup.layer3": verificationLayer3,
  "auth.signup.presigned": presignedURLRequest,
  "auth.signup.layer4": verififcationLayer4,
});

export const authValidator = new Elysia().model({
  "auth.login": loginBody,
});
