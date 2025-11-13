import { OTPPreferenceType, Segment, AnnualIncome, OccupationType, TradingExperience, MartialStatusType, BankAccountType, RelationshipType, OrderVariety, OrderType, TransactionType, ProductType, Exchange, OrderValidity, AlertType, InstrumentType } from "../../generated/prisma";
import { Elysia, t } from "elysia";
import { config } from "../config/generalconfig";
import { SortOrder } from "./types";






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
  "watchlist-item.create": watchListItemCreateValidator,
  "watchlist-item.id": watchListItemIdParam,
  "watchlist-groupId": watchlistGroupIdParam,
  "watchlist-item.update": watchListItemUpdateValidator,
});

export const watchlistGroupValidator = new Elysia().model({
  "watchlist-group.create": watchlistGroupCreateValidator,
  "watchlist-group.id": watchListIdParam,
  "watchlist-group.watchlistGroupId": watchlistGroupIdParam,
  "watchlist-group.delete": watchlistGroupIdParam,
  "watchlist-group.update": watchListGroupUpdateValidator,
});

export const watchlistValidator = new Elysia().model({
  "watchlist.create": watchlistCreateValidator,
  "watchlist.id": watchListIdParam,
  "watchlist.delete": watchListIdParam,
  "watchlist.update": watchlistUpdateValidator,
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
  variety: t.Enum(OrderVariety, { error: "INVALID_ORDER_VARIETY", examples: [OrderVariety.REGULAR] }),
  orderType: t.Enum(OrderType, { error: "INVALID_ORDER_TYPE", examples: [OrderType.MARKET] }),
  transactionType: t.Enum(TransactionType, { error: "INVALID_TRANSACTION_TYPE", examples: [TransactionType.BUY] }),
  validity: t.Enum(OrderValidity, { error: "INVALID_ORDER_VALIDITY", examples: [OrderValidity.DAY] }),
  product: t.Enum(ProductType, { error: "INVALID_PRODUCT_TYPE", examples: [ProductType.CNC] }),
  exchange: t.Enum(Exchange, { error: "INVALID_EXCHANGE", examples: [Exchange.NSE] }),
  tradingSymbol: t.String({ examples: ["TATASTEEL"], error: "INVALID_TRADING_SYMBOL" }),
  instrumentId: t.String({ minLength: 10, maxLength: 100, example: "cmhlp8iup0000kes08qi10uiz", error: "INVALID_INSTRUMENT_ID" }),
  quantity: t.Number({ minimum: 1, maximum: 2000, example: 5, error: "QUANTITY_INVALID" }),
  price: t.Number({ minimum: 0, maximum: 2000000, example: 5, error: "QUANTITY_INVALID" }),
})

const cancelOrderValidator = t.Object({
  quantity: t.Number({ minimum: 0, maximum: 2000000, example: 5, error: "QUANTITY_INVALID" }),
})

const updateOrderValidator = t.Object({
  variety: t.Optional(t.Enum(OrderVariety, { examples: [OrderVariety.REGULAR], error: "INVALID_ORDER_VARIETY" })),
  orderType: t.Optional(t.Enum(OrderType, { examples: [OrderType.MARKET], error: "INVALID_ORDER_TYPE" })),
  transactionType: t.Optional(t.Enum(TransactionType, { examples: [TransactionType.BUY], error: "INVALID_TRANSACTION_TYPE" })),
  validity: t.Optional(t.Enum(OrderValidity, { examples: [OrderValidity.DAY], error: "INVALID_ORDER_VALIDITY" })),
  product: t.Optional(t.Enum(ProductType, { examples: [ProductType.CNC], error: "INVALID_PRODUCT_TYPE" })),
  exchange: t.Optional(t.Enum(Exchange, { examples: [Exchange.NSE], error: "INVALID_EXCHANGE" })),
  tradingSymbol: t.Optional(t.String({ examples: ["TATASTEEL"], error: "INVALID_TRADING_SYMBOL" })),
  instrumentId: t.Optional(t.String({ minLength: 10, maxLength: 100, example: "cmhlp8iup0000kes08qi10uiz", error: "INVALID_INSTRUMENT_ID" })),
  quantity: t.Optional(t.Number({ minimum: 1, maximum: 2000, example: 5, error: "QUANTITY_INVALID" })),
  price: t.Optional(t.Number({ minimum: 0, maximum: 2000000, example: 5, error: "QUANTITY_INVALID" })),
})


const orderIdParams = t.Object({
  orderId: t.String({ minLength: 10, maxLength: 100, example: "cmhlp8iup0000kes08qi10uiz", error: "INVALID_ORDER_ID" }),
})

export const orderValidator = new Elysia().model({
  "order.create": createOrderValidator,
  "order.cancel": cancelOrderValidator,
  "order.update": updateOrderValidator,
  "order.id": orderIdParams
});


const holdingIdParam = t.Object({
  holdingId: t.String({ minLength: 10, maxLength: 100, example: "cmhlp8iup0000kes08qi10uiz", error: "INVALID_HOLDING_ID" }),
})





const getHoldingValidator = t.Object({
  type: t.Optional(t.Enum(ProductType, { error: "INVALID_PRODUCT_TYPE", examples: [ProductType.CNC] })),
  sort: t.Optional(t.Enum(SortOrder, { error: "INVALID_SORT_TYPE", examples: ['asc'] })),
  skip: t.Optional(t.Number({ minimum: 0, maximum: 10000, example: 0, error: "INVALID_SKIP_VALUE" })),
  search: t.Optional(t.String({ minLength: 1, maxLength: 100, example: "TATA", error: "INVALID_SEARCH_VALUE" })),
  limit: t.Optional(t.Number({ minimum: 1, maximum: 1000, example: 20, error: "INVALID_LIMIT_VALUE" })),
  cursor: t.Optional(t.String({ minLength: 10, maxLength: 100, example: "cmhlp8iup0000kes08qi10uiz", error: "INVALID_CURSOR_VALUE" })),
})


export const holdingValidator = new Elysia().model({
  "holding.get": getHoldingValidator,
  "holding.id": holdingIdParam
});






const updateAvatarValidator = t.Object({
  avatar: t.String({ example: `https://${config.S3.BUCKET}.s3.${config.S3.REGION}.amazonaws.com/cmhk8ryhl0000kev0hxkw5cyw/avatar`, error: "INVALID_AVATAR_FORMAT" })
})

export const commonValidator = new Elysia().model({
  "common.presigned-avatar": presignedURLRequest,
  "common.upload-avatar": updateAvatarValidator,
});




const alertIdParams = t.Object({
  alertId: t.String({ minLength: 10, maxLength: 100, example: "cmhlp8iup0000kes08qi10uiz", error: "INVALID_ALERT_ID" }),
})




const createAlertValidator = t.Object({
    instrumentId: t.String({ minLength: 10, maxLength: 100, example: "cmhlp8iup0000kes08qi10uiz", error: "INVALID_INSTRUMENT_ID" }),
    alertType: t.Enum(AlertType, { error: "INVALID_ALERT_TYPE", examples: [AlertType.ORDER_UPDATE] }),
    message: t.String({ minLength: 5, maxLength: 500, example: "Alert when price drops below 100", error: "INVALID_ALERT_MESSAGE" }),
    triggerPrice: t.Number({ minimum: 0, maximum: 10000000, example: 100, error: "INVALID_TRIGGER_PRICE" }),
    condition: t.String({ minLength: 5, maxLength: 100, example: "LESS_THAN", error: "INVALID_CONDITION" }),
})

const updateAlertValidator = t.Object({
  alertType: t.Optional(t.Enum(AlertType, { error: "INVALID_ALERT_TYPE", examples: [AlertType.ORDER_UPDATE] })),
  instrumentId: t.Optional(t.String({ minLength: 10, maxLength: 100, example: "cmhlp8iup0000kes08qi10uiz", error: "INVALID_INSTRUMENT_ID" })),
  message: t.Optional(t.String({ minLength: 5, maxLength: 500, example: "Alert when price drops below 100", error: "INVALID_ALERT_MESSAGE" })),
  triggerPrice: t.Optional(t.Number({ minimum: 0, maximum: 10000000, example: 100, error: "INVALID_TRIGGER_PRICE" })),
  condition: t.Optional(t.String({ minLength: 5, maxLength: 100, example: "LESS_THAN", error: "INVALID_CONDITION" })),
  isRead: t.Optional(t.Boolean()),
  isTriggered: t.Optional(t.Boolean()),
  triggeredAt: t.Optional(t.String({ format: "date-time", example: "2024-01-01T00:00:00Z", error: "INVALID_TRIGGERED_AT_FORMAT" })),
  expiresAt: t.Optional(t.String({ format: "date-time", example: "2024-12-31T23:59:59Z", error: "INVALID_EXPIRES_AT_FORMAT" })),
})

export const alertValidator  = new Elysia().model({
  "alert.id" : alertIdParams,
  "alert.create" : createAlertValidator,
  "alert.update" : updateAlertValidator, 
})  



const basketIdParam = t.Object({
  basketId: t.String({ minLength: 10, maxLength: 100, example: "cmhlp8iup0000kes08qi10uiz", error: "INVALID_BASKET_ID" }),
})

const createBasketValidator = t.Object({
  name: t.String({ minLength: 2, maxLength: 100, example: "My Basket", error: "INVALID_BASKET_NAME" }),
});

const updateBasketValidator = t.Object({
  name: t.String({ minLength: 2, maxLength: 100, example: "Updated Basket", error: "INVALID_BASKET_NAME" }),
});

export const basketValidator  = new Elysia().model({
  "basket.id" : basketIdParam,
  "basket.create" : createBasketValidator,
  "basket.update" : updateBasketValidator,
});


const createBasketItemValidator = t.Object({
  instrumentId: t.String({ minLength: 10, maxLength: 100, example: "cmhlp8iup0000kes08qi10uiz", error: "INVALID_INSTRUMENT_ID" }),
  tradingSymbol: t.String({ minLength: 2, maxLength: 100, example: "TATASTEEL", error: "INVALID_TRADING_SYMBOL" }),
  exchange: t.Enum(Exchange, { example: "NSE", error: "INVALID_EXCHANGE" }),
  transactionType: t.Enum(TransactionType, { example: "BUY", error: "INVALID_TRANSACTION_TYPE" }),
  orderType: t.Enum(OrderType, { example: "MARKET", error: "INVALID_ORDER_TYPE" }),
  quantity: t.Number({ minimum: 1, maximum: 2000, example: 5, error: "QUANTITY_INVALID" }),
  price: t.Number({ minimum: 0, maximum: 2000000, example: 5, error: "PRICE_INVALID" }),
  triggeredPrice: t.String({ minLength: 1, maxLength: 100, example: "100.50", error: "INVALID_TRIGGERED_PRICE" }),
  product: t.Enum(ProductType, { example: "CNC", error: "INVALID_PRODUCT_TYPE" }),
});



export const basketItemValidator  = new Elysia().model({
  "basket-item.id" : basketIdParam  ,
  "basket-item.create" : createBasketItemValidator,
});



const intrumentIdParam = t.Object({
  instrumentId: t.String({ minLength: 10, maxLength: 100, example: "cmhlp8iup0000kes08qi10uiz", error: "INVALID_INSTRUMENT_ID" }),
})


const createInstrumentValidator = t.Object({
  instrumentToken : t.String({ minLength: 5, maxLength: 100, example: "123456", error: "INVALID_INSTRUMENT_TOKEN" }),
  exchangeToken : t.String({ minLength: 5, maxLength: 100, example: "654321", error: "INVALID_EXCHANGE_TOKEN" }),
  tradingSymbol : t.String({ minLength: 2, maxLength: 100, example: "TATASTEEL", error: "INVALID_TRADING_SYMBOL" }),
  name : t.String({ minLength: 2, maxLength: 200, example: "Tata Steel Limited", error: "INVALID_INSTRUMENT_NAME" }),
  segment : t.Enum(Segment, { example: "EQUITY", error: "INVALID_SEGMENT" }),
  exchange : t.Enum(Exchange, { example: "NSE", error: "INVALID_EXCHANGE" }),
  instrumentType : t.Enum(InstrumentType, { example: "STOCK", error: "INVALID_INSTRUMENT_TYPE" }),
});


export const instrumentValidator  = new Elysia().model({
  "instrument.id" : intrumentIdParam,
  "instrument.create": createInstrumentValidator,
});