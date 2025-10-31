import { Segment, AnnualIncome, Occupation, TradingExperience, MartialStatus } from "../../generated/prisma";
import { Elysia, t } from "elysia";



// Signup Layers
const sendOTPLayer = t.Object({
  phone: t.String({ minLength: 10, maxLength: 15 }),
});
const verifyOTPLayer = t.Object({
  phone: t.String({ minLength: 10, maxLength: 15 }),
  otp: t.String({ minLength: 6, maxLength: 6 }),
});
const verificationLayer1 = t.Object({
  dob: t.String({ format: "date-time" }),
  panNumber: t.String({ minLength: 10, maxLength: 10 }),
  email: t.String({ format: "email" }),
  name: t.String(),
});
const verificationLayer2 = t.Object({
  segment: t.Enum(Segment),
  aadhaarNumber: t.String({ minLength: 12, maxLength: 12 }),
});
const verificationLayer3 = t.Object({
  fatherName: t.String(),
  motherName: t.String(),
  maritalStatus: t.Enum(MartialStatus),
  annualIncome: t.Enum(AnnualIncome),
  tradingExperience: t.Enum(TradingExperience),
  occupation: t.Enum(Occupation),
  upiId: t.String({ minLength: 5, maxLength: 15 }),
  accountNumber: t.String({ minLength: 10, maxLength: 10 }),
  ifscCode: t.String({ minLength: 11, maxLength: 11 }),
  bankName: t.String(),
  branchName: t.String(),
});

const presignedURLRequest = t.Object({
  fileType: t.String(),
}); 
// Login Body
const loginBody = t.Union([
  t.Object({
    email: t.String({ format: "email", error: "INVALID_EMAIL_FORMAT" }),
    password: t.String({ minLength: 8, error: "INVALID_PASSWORD_FORMAT" })
  }),
  t.Object({
    phone: t.String({ minLength: 10, maxLength: 15, error: "INVALID_PHONE_FORMAT" }),
    password: t.String({ minLength: 8, error: "INVALID_PASSWORD_FORMAT" })
  })
]);



export const signUpValidator = new Elysia().model({
  "auth.signup.sendotp": sendOTPLayer,
  "auth.signup.verifyotp": verifyOTPLayer,
  "auth.signup.layer1": verificationLayer1,
  "auth.signup.layer2": verificationLayer2,
  "auth.signup.layer3": verificationLayer3,
  "auth.signup.presigned": presignedURLRequest
});

export const authValidator = new Elysia().model({
  "auth.login": loginBody,
});
