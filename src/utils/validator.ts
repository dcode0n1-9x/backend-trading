import { OTPPreferenceType, Segment, AnnualIncome, OccupationType, TradingExperience, MartialStatusType, BankAccountType, RelationshipType, OrderVariety, OrderType, TransactionType, ProductType, Exchange, OrderValidity } from "../../generated/prisma";
import { Elysia, t } from "elysia";
import { config } from "../config/generalconfig";



// Signup Layers
const sendOTPLayer = t.Object({
  phone: t.String({ minLength: 10, maxLength: 15, example: "6376877564", error: "INVALID_PHONE_FORMAT" }),
});

const verifyOTPLayer = t.Object({
  phone: t.String({ minLength: 10, maxLength: 15, example: "6376877564", error: "INVALID_PHONE_FORMAT" }),
  otp: t.String({ minLength: 6, maxLength: 6, example: "123456", error: "INVALID_OTP_FORMAT" }),
});


const sendOTPviaEmail = t.Object({
  email: t.String({ format: "email", example: "example@example.com", error: "INVALID_EMAIL_FORMAT" }),
  name: t.String({ example: "John Doe", error: "INVALID_NAME_FORMAT" }),
})

const verificationLayer0 = t.Object({
  email: t.String({ format: "email", example: "example@example.com", error: "INVALID_EMAIL_FORMAT" }),
  otp: t.String({ minLength: 6, maxLength: 6, example: "123456", error: "INVALID_OTP_FORMAT" }),
})

const verificationLayer1 = t.Object({
  dob: t.String({ format: "date-time", example: "1990-01-01T00:00:00Z", error: "INVALID_DOB_FORMAT" }),
  panNumber: t.String({ minLength: 10, maxLength: 10, example: "ABCDE1234F", error: "INVALID_PAN_FORMAT" }),
});

const verificationLayer2 = t.Object({
  segment: t.Array(t.Enum(Segment, { example: "EQUITY", error: "INVALID_SEGMENT_FORMAT" })),
  aadhaarNumber: t.String({ minLength: 12, maxLength: 12, example: "637687756412", error: "INVALID_AADHAAR_FORMAT" }),
});



const verificationLayer3A = t.Object({
  fatherName: t.String({ example: "John Doe Sr.", error: "INVALID_FATHER_NAME_FORMAT" }),
  motherName: t.String({ example: "Jane Doe", error: "INVALID_MOTHER_NAME_FORMAT" }),
  maritalStatus: t.Enum(MartialStatusType, { example: "SINGLE", error: "INVALID_MARITAL_STATUS_FORMAT" }),
  annualIncome: t.Enum(AnnualIncome, { example: "BETWEEN_1_TO_5_LAKHS", error: "INVALID_ANNUAL_INCOME_FORMAT" }),
  tradingExperience: t.Enum(TradingExperience, { example: "NEW", error: "INVALID_TRADING_EXPERIENCE_FORMAT" }),
  occupation: t.Enum(OccupationType, { example: "STUDENT", error: "INVALID_OCCUPATION_FORMAT" }),
})

const upiVariant = t.Object({
  upiId: t.String({ minLength: 5, maxLength: 15, example: "john.doe@bank", error: "INVALID_UPI_FORMAT" }),
})

const bankVariant = t.Object({
  accountNumber: t.String({ minLength: 10, maxLength: 10, example: "6376877564", error: "INVALID_ACCOUNT_NUMBER_FORMAT" }),
  ifscCode: t.String({ minLength: 11, maxLength: 11, example: "SBIN0001234", error: "INVALID_IFSC_FORMAT" }),
  bankName: t.String({ minLength: 2, maxLength: 100, example: "State Bank of India", error: "INVALID_BANK_NAME_FORMAT" }),
  branchName: t.String({ minLength: 2, maxLength: 100, example: "Connaught Place", error: "INVALID_BRANCH_NAME_FORMAT" }),
  accountType: t.Enum(BankAccountType, { example: "SAVINGS", error: "INVALID_ACCOUNT_TYPE_FORMAT" }),
  accountHolderName: t.String({ minLength: 2, maxLength: 100, example: "John Doe", error: "INVALID_ACCOUNT_HOLDER_NAME_FORMAT" }),
  micrCode: t.String({ minLength: 9, maxLength: 9, example: "110002000", error: "INVALID_MICR_CODE_FORMAT" }),
})

// Union of variants
const verificationLayer3B = t.Union([upiVariant, bankVariant]);


const verificationLayer3C = t.Object({
  webcam: t.String({ example: `https://${config.S3.BUCKET}.s3.${config.S3.REGION}.amazonaws.com/cmhk8ryhl0000kev0hxkw5cyw/kyc/signature`, error: "INVALID_SIGNATURE_FORMAT" })
})

const presignedURLRequest = t.Object({
  fileType: t.String({ example: "image/png", error: "INVALID_FILE_TYPE_FORMAT" }),
});

const verificationLayer4A = t.Object({
  signature: t.String({ example: `https://${config.S3.BUCKET}.s3.${config.S3.REGION}.amazonaws.com/cmhk8ryhl0000kev0hxkw5cyw/kyc/signature`, error: "INVALID_SIGNATURE_FORMAT" }),
})

const verificationLayer4B = t.Object({
  nominee: t.Array(t.Object({
    name: t.String({ minLength: 2, maxLength: 100, example: "John Doe" }),
    email: t.String({ format: "email", example: "john.doe@example.com" }),
    phone: t.String({ minLength: 10, maxLength: 15, example: "6376877564" }),
    relationship: t.Enum(RelationshipType, { example: "SPOUSE" }),
    percentage: t.Number({ minimum: 0, maximum: 100, example: 50 }),
    panNumber: t.String({ minLength: 10, maxLength: 10, example: "ABCDE1234F" }),
    dob: t.String({ format: "date-time", example: "1990-01-01T00:00:00Z" }),
    address: t.String({ minLength: 10, maxLength: 500, example: "123 Main St, City, Country" }),
  }))
})

// Login Body
const loginBody = t.Union([
  t.Object({
    email: t.String({ format: "email", error: "INVALID_EMAIL_FORMAT", example: "john.doe@example.com" }),
    password: t.String({ minLength: 8, error: "INVALID_PASSWORD_FORMAT", example: "strongpassword123" })
  }),
  t.Object({
    phone: t.String({ minLength: 10, maxLength: 15, error: "INVALID_PHONE_FORMAT", example: "6376877564" }),
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
  phone: t.String({ minLength: 10, maxLength: 15, example: "6376877564" }),
})

const forgetPasswordValidator = t.Union([forgetPasswordEmailVarient, forgetPasswordPhoneVarient]);


const verifyOTPForgetPasswordLayer = t.Object({
  token: t.String({ minLength: 10, maxLength: 100, example: "abcdef6376877564" }),
  password: t.String({ minLength: 8, error: "INVALID_PASSWORD_FORMAT", example: "strongpassword123" })
});


const watchlistCreateValidator = t.Object({
  name: t.String({ minLength: 2, maxLength: 100, example: "My Watchlist", error: "INVALID_WATCHLIST_NAME" }),
});

const watchlistUpdateValidator = t.Object({
  name: t.String({ minLength: 2, maxLength: 100, example: "Updated Watchlist", error: "INVALID_WATCHLIST_NAME" }),
});

const watchListIdParam = t.Object({
  watchlistId: t.String({ minLength: 10, maxLength: 100, example: "watchlist12345", error: "INVALID_WATCHLIST_ID" }),
});


const watchlistGroupCreateValidator = t.Object({
  name: t.String({ minLength: 2, maxLength: 100, example: "My Watchlist Group", error: "INVALID_WATCHLIST_GROUP_NAME" }),
});

const watchlistGroupIdParam = t.Object({
  watchlistGroupId: t.String({ minLength: 10, maxLength: 100, example: 'cmhlp8iup0000kes08qi10uiz', error: "INVALID_WATCHLIST_GROUP_ID" }),
});

const watchListGroupUpdateValidator = t.Object({
  name: t.String({ minLength: 2, maxLength: 100, example: "Updated Watchlist Group", error: "INVALID_WATCHLIST_GROUP_NAME" }),
  color: t.Number({ minimum: 1, maximum: 20, example: 5, error: "INVALID_COLOR_VALUE" }),
  sortOrder: t.Number({ minimum: 1, maximum: 100, example: 1, error: "INVALID_SORT_ORDER" }),
});



const watchListItemCreateValidator = t.Object({
  instrumentId: t.String({ minLength: 10, maxLength: 100, example: "cmhlp8iup0000kes08qi10uiz", error: "INVALID_INSTRUMENT_ID" }),
});

const watchListItemIdParam = t.Object({
  watchlistItemId: t.String({ minLength: 10, maxLength: 100, example: "watchlist12345", error: "INVALID_WATCHLIST_ID" })
})

const watchListItemUpdateValidator = t.Object({
  sortOrder: t.Number({ minimum: 1, maximum: 100, example: 1, error: "INVALID_SORT_ORDER" }),
})

export const watchlistItemValidator = new Elysia().model({
  "watchlist-item.createWatchlistItem": watchListItemCreateValidator,
  "watchlist-item.id": watchListItemIdParam,
  "watchlist-groupId": watchlistGroupIdParam,
  "watchlist-item.updateWatchlistItem": watchListItemUpdateValidator,
});

export const watchlistGroupValidator = new Elysia().model({
  "watchlist.createWatchlistGroup": watchlistGroupCreateValidator,
  "watchlist.id": watchListIdParam,
  "watchlist.watchlistGroupId": watchlistGroupIdParam,
  "watchlist.deleteWatchlistGroup": watchlistGroupIdParam,
  "watchlist.updateWatchlistGroup": watchListGroupUpdateValidator,
});

export const watchlistValidator = new Elysia().model({
  "watchlist.createWatchlist": watchlistCreateValidator,
  "watchlist.id": watchListIdParam,
  "watchlist.deleteWatchlist": watchListIdParam,
  "watchlist.updateWatchlist": watchlistUpdateValidator,
});



export const passwordValidator = new Elysia().model({
  "auth.forgetpassword": forgetPasswordValidator,
  "auth.verifyotp.forgetpassword": verifyOTPForgetPasswordLayer,
});

export const signUpValidator = new Elysia().model({
  "auth.signup.sendotp": sendOTPLayer,
  "auth.signup.verifyotp": verifyOTPLayer,
  "auth.signup.sendotpemail": sendOTPviaEmail,
  "auth.signup.layer0": verificationLayer0,
  "auth.signup.layer1": verificationLayer1,
  "auth.signup.layer2": verificationLayer2,
  "auth.signup.layer3A": verificationLayer3A,
  "auth.signup.layer3B": verificationLayer3B,
  "auth.signup.layer3C": verificationLayer3C,
  "auth.signup.presigned": presignedURLRequest,
  "auth.signup.layer4A": verificationLayer4A,
  "auth.signup.layer4B": verificationLayer4B
})


export const authValidator = new Elysia().model({
  "auth.login": loginBody,
});







const createOrderValidator = t.Object({
  variety: t.Enum(OrderVariety),
  orderType: t.Enum(OrderType),
  transactionType: t.Enum(TransactionType),
  validity: t.Enum(OrderValidity),
  product: t.Enum(ProductType),
  exchange: t.Enum(Exchange),
  tradingSymbol: t.String({ examples: "TATASTEEL" }),
  instrumentId: t.String({ minLength: 10, maxLength: 100, example: "cmhlp8iup0000kes08qi10uiz", error: "INVALID_INSTRUMENT_ID" }),
  quantity: t.Number({ minimum: 1, maximum: 2000, example: 5, error: "QUANTITY_INVALID" }),
  price: t.Number({ minimum: 0, maximum: 2000000, example: 5, error: "QUANTITY_INVALID" }),
})

const cancelOrderValidator = t.Object({
  quantity: t.Number({ minimum: 0, maximum: 2000000, example: 5, error: "QUANTITY_INVALID" }),
})

const updateOrderValidator = t.Object({
  variety: t.Optional(t.Enum(OrderVariety)),
  orderType: t.Optional(t.Enum(OrderType)),
  transactionType: t.Optional(t.Enum(TransactionType)),
  validity: t.Optional(t.Enum(OrderValidity)),
  product: t.Optional(t.Enum(ProductType)),
  exchange: t.Optional(t.Enum(Exchange)),
  tradingSymbol: t.Optional(t.String({ examples: "TATASTEEL" })),
  instrumentId: t.Optional(t.String({ minLength: 10, maxLength: 100, example: "cmhlp8iup0000kes08qi10uiz", error: "INVALID_INSTRUMENT_ID" })),
  quantity: t.Optional(t.Number({ minimum: 1, maximum: 2000, example: 5, error: "QUANTITY_INVALID" })),
  price: t.Optional(t.Number({ minimum: 0, maximum: 2000000, example: 5, error: "QUANTITY_INVALID" })),
})


const orderIdParams = t.Object({
  orderId: t.String({ minLength: 10, maxLength: 100, example: "cmhlp8iup0000kes08qi10uiz", error: "INVALID_ORDER_ID" }),
})

export const orderValidator = new Elysia().model({
  "order.createOrder": createOrderValidator,
  "order.cancelOrder": cancelOrderValidator,
  "order.updateOrder": updateOrderValidator,
  "order.orderId": orderIdParams
});
