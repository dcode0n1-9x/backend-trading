-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'BROKER');

-- CreateEnum
CREATE TYPE "KYCStatus" AS ENUM ('PENDING', 'SUBMITTED', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('INDIVIDUAL', 'CORPORATE', 'PARTNERSHIP', 'HUF');

-- CreateEnum
CREATE TYPE "RiskProfile" AS ENUM ('LOW', 'MODERATE', 'HIGH');

-- CreateEnum
CREATE TYPE "BankAccountType" AS ENUM ('SAVINGS', 'CURRENT');

-- CreateEnum
CREATE TYPE "FundTransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('UPI', 'NET_BANKING', 'NEFT', 'RTGS', 'IMPS');

-- CreateEnum
CREATE TYPE "Exchange" AS ENUM ('NSE', 'BSE', 'NFO', 'BFO', 'CDS', 'MCX');

-- CreateEnum
CREATE TYPE "Segment" AS ENUM ('EQUITY', 'FUTURES', 'OPTIONS', 'CURRENCY', 'COMMODITY');

-- CreateEnum
CREATE TYPE "InstrumentType" AS ENUM ('EQ', 'FUTIDX', 'FUTSTK', 'OPTIDX', 'OPTSTK', 'FUTCOM', 'OPTCOM', 'FUTCUR', 'OPTCUR');

-- CreateEnum
CREATE TYPE "OrderSide" AS ENUM ('BUY', 'SELL');

-- CreateEnum
CREATE TYPE "OrderVariety" AS ENUM ('REGULAR', 'AMO', 'BO', 'CO', 'ICEBERG');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('MARKET', 'LIMIT', 'SL', 'SLM');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('BUY', 'SELL');

-- CreateEnum
CREATE TYPE "OrderValidity" AS ENUM ('DAY', 'IOC', 'TTL');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('CNC', 'MIS', 'NRML');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'OPEN', 'COMPLETE', 'CANCELLED', 'REJECTED', 'MODIFIED', 'TRIGGER_PENDING');

-- CreateEnum
CREATE TYPE "PositionType" AS ENUM ('DAY', 'OVERNIGHT');

-- CreateEnum
CREATE TYPE "GTTType" AS ENUM ('SINGLE', 'OCO');

-- CreateEnum
CREATE TYPE "TriggerType" AS ENUM ('SINGLE', 'TWO_LEG');

-- CreateEnum
CREATE TYPE "GTTStatus" AS ENUM ('ACTIVE', 'TRIGGERED', 'DISABLED', 'EXPIRED', 'CANCELLED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('PRICE_ALERT', 'PERCENTAGE_CHANGE', 'VOLUME_SPIKE', 'NEWS', 'CORPORATE_ACTION', 'MARGIN_CALL', 'ORDER_UPDATE');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('ORDER_UPDATE', 'TRADE_EXECUTED', 'FUND_UPDATE', 'MARGIN_CALL', 'GTT_TRIGGERED', 'CORPORATE_ACTION', 'SYSTEM_ALERT');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "CorporateActionType" AS ENUM ('DIVIDEND', 'BONUS', 'SPLIT', 'MERGER', 'RIGHTS', 'BUYBACK', 'DELISTING');

-- CreateEnum
CREATE TYPE "RelationshipType" AS ENUM ('FATHER', 'MOTHER', 'SPOUSE', 'SIBLING', 'CHILD', 'OTHER');

-- CreateEnum
CREATE TYPE "MartialStatusType" AS ENUM ('SINGLE', 'MARRIED');

-- CreateEnum
CREATE TYPE "AnnualIncome" AS ENUM ('BELOW_1_LAKH', 'BETWEEN_1_TO_5_LAKHS', 'BETWEEN_5_TO_10_LAKHS', 'BETWEEN_10_TO_25_LAKHS', 'BETWEEN_25_TO_1_CRORE', 'ABOVE_1_CRORE');

-- CreateEnum
CREATE TYPE "TradingExperience" AS ENUM ('NEW', 'BETWEEN_1_TO_5_YEARS', 'BETWEEN_5_TO_10_YEARS', 'BETWEEN_10_TO_15_YEARS', 'MORE_THAN_15_YEARS');

-- CreateEnum
CREATE TYPE "OccupationType" AS ENUM ('BUSINESS', 'HOUSEWIFE', 'STUDENT', 'PROFESSIONAL', 'PRIVATE_SECTOR', 'AGRICULTURIST', 'GOVERMENT_SERVICE', 'PUBLIC_SECTOR', 'RETIRED', 'OTHERS');

-- CreateEnum
CREATE TYPE "SettlementType" AS ENUM ('QUATERLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "KYCStage" AS ENUM ('ZERO', 'ONE', 'TWO', 'THREEA', 'THREEB', 'THREEC', 'FOURA', 'FOURB');

-- CreateEnum
CREATE TYPE "OTPPreferenceType" AS ENUM ('EMAIL', 'SMS');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "password" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "panNumber" TEXT,
    "aadhaarNumber" TEXT,
    "dob" TIMESTAMP(3),
    "twoFactorPreference" "OTPPreferenceType" DEFAULT 'SMS',
    "kycStatus" "KYCStatus" DEFAULT 'PENDING',
    "accountType" "AccountType" DEFAULT 'INDIVIDUAL',
    "role" "UserRole" DEFAULT 'USER',
    "isActive" BOOLEAN DEFAULT true,
    "twoFactorEnabled" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "segment" "Segment"[] DEFAULT ARRAY['EQUITY']::"Segment"[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nominee" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relationship" "RelationshipType" NOT NULL,
    "phone" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "panNumber" TEXT NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Nominee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserVerification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stage" "KYCStage" NOT NULL DEFAULT 'ZERO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "fatherName" TEXT,
    "motherName" TEXT,
    "maritalStatus" "MartialStatusType",
    "country" TEXT DEFAULT 'India',
    "occupation" "OccupationType",
    "annualIncome" TEXT,
    "tradingExperience" TEXT,
    "signature" TEXT,
    "webcam" TEXT,
    "riskProfile" "RiskProfile" NOT NULL DEFAULT 'MODERATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountNumber" TEXT,
    "ifscCode" TEXT,
    "bankName" TEXT,
    "micrCode" TEXT,
    "upiId" TEXT,
    "branchName" TEXT,
    "accountHolderName" TEXT,
    "accountType" "BankAccountType",
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "deviceType" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FundTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "transactionType" "FundTransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMode" "PaymentMode",
    "utrNumber" TEXT,
    "bankAccountId" TEXT,
    "remarks" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FundTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Margin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "availableCash" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "usedMargin" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "availableMargin" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "collateralValue" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "openingBalance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "payin" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "payout" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "spanMargin" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "exposureMargin" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "optionPremium" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Margin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instrument" (
    "id" TEXT NOT NULL,
    "instrumentToken" TEXT NOT NULL,
    "exchangeToken" TEXT NOT NULL,
    "tradingSymbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "exchange" "Exchange" NOT NULL,
    "segment" "Segment" NOT NULL,
    "instrumentType" "InstrumentType" NOT NULL,
    "tickSize" DOUBLE PRECISION NOT NULL DEFAULT 0.05,
    "lotSize" INTEGER NOT NULL DEFAULT 1,
    "expiry" TIMESTAMP(3),
    "strike" DOUBLE PRECISION,
    "isin" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastPrice" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Instrument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketDepth" (
    "id" TEXT NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "side" "OrderSide" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "orders" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketDepth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceHistory" (
    "id" TEXT NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "open" DOUBLE PRECISION NOT NULL,
    "high" DOUBLE PRECISION NOT NULL,
    "low" DOUBLE PRECISION NOT NULL,
    "close" DOUBLE PRECISION NOT NULL,
    "volume" INTEGER NOT NULL,
    "ohlcDate" TIMESTAMP(3) NOT NULL,
    "interval" TEXT NOT NULL,

    CONSTRAINT "PriceHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Portfolio" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalValue" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "investedValue" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "currentValue" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "dayChange" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "dayChangePercent" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "totalPnl" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "totalPnlPercent" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "xirr" DOUBLE PRECISION,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Holding" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "averagePrice" DOUBLE PRECISION NOT NULL,
    "lastPrice" DOUBLE PRECISION NOT NULL,
    "pnl" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "dayChange" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "dayChangePercent" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "collateralQuantity" INTEGER NOT NULL DEFAULT 0,
    "collateralType" TEXT,
    "product" "ProductType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Holding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Position" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "product" "ProductType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "overnightQuantity" INTEGER NOT NULL DEFAULT 0,
    "averagePrice" DOUBLE PRECISION NOT NULL,
    "lastPrice" DOUBLE PRECISION NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "pnl" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "m2m" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "unrealised" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "realised" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "buyQuantity" INTEGER NOT NULL DEFAULT 0,
    "buyValue" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "buyPrice" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "sellQuantity" INTEGER NOT NULL DEFAULT 0,
    "sellValue" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "sellPrice" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "multiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "tradingSymbol" TEXT NOT NULL,
    "exchange" "Exchange" NOT NULL,
    "positionType" "PositionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "parentOrderId" TEXT,
    "exchangeOrderId" TEXT,
    "exchangeTimestamp" TIMESTAMP(3),
    "placedBy" TEXT NOT NULL,
    "variety" "OrderVariety" NOT NULL,
    "orderType" "OrderType" NOT NULL,
    "transactionType" "TransactionType" NOT NULL,
    "validity" "OrderValidity" NOT NULL,
    "product" "ProductType" NOT NULL,
    "exchange" "Exchange" NOT NULL,
    "tradingSymbol" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "disclosedQuantity" INTEGER NOT NULL DEFAULT 0,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "triggerPrice" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "averagePrice" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "filledQuantity" INTEGER NOT NULL DEFAULT 0,
    "pendingQuantity" INTEGER NOT NULL,
    "cancelledQuantity" INTEGER NOT NULL DEFAULT 0,
    "status" "OrderStatus" NOT NULL,
    "statusMessage" TEXT,
    "tag" TEXT,
    "clientOrderId" TEXT,
    "orderTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exchangeUpdateTime" TIMESTAMP(3),
    "rejectedBy" TEXT,
    "cancelledBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trade" (
    "id" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "exchange" "Exchange" NOT NULL,
    "tradingSymbol" TEXT NOT NULL,
    "transactionType" "TransactionType" NOT NULL,
    "product" "ProductType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "exchangeTimestamp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TradeCharges" (
    "id" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "brokerage" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "stt" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "exchangeTxnCharge" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "gst" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "sebiTurnover" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "stampDuty" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "totalCharges" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "netAmount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TradeCharges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GTTOrder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gttType" "GTTType" NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "tradingSymbol" TEXT NOT NULL,
    "exchange" "Exchange" NOT NULL,
    "triggerType" "TriggerType" NOT NULL,
    "triggerPrice" DOUBLE PRECISION NOT NULL,
    "lastPrice" DOUBLE PRECISION NOT NULL,
    "limitPrice" DOUBLE PRECISION,
    "stopLossPrice" DOUBLE PRECISION,
    "quantity" INTEGER NOT NULL,
    "product" "ProductType" NOT NULL,
    "orderType" "OrderType" NOT NULL,
    "status" "GTTStatus" NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMP(3),
    "triggeredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GTTOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Watchlist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Watchlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchlistGroup" (
    "id" TEXT NOT NULL,
    "watchlistId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" INTEGER NOT NULL DEFAULT 0,
    "sortOrder" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WatchlistGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchlistItem" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "sortOrder" SERIAL NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WatchlistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "instrumentId" TEXT,
    "alertType" "AlertType" NOT NULL,
    "message" TEXT NOT NULL,
    "triggerPrice" DOUBLE PRECISION,
    "condition" TEXT,
    "isTriggered" BOOLEAN NOT NULL DEFAULT false,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "triggeredAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "notificationType" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "priority" "Priority" NOT NULL DEFAULT 'NORMAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Basket" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "totalValue" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Basket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BasketItem" (
    "id" TEXT NOT NULL,
    "basketId" TEXT NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "tradingSymbol" TEXT NOT NULL,
    "exchange" "Exchange" NOT NULL,
    "transactionType" "TransactionType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "orderType" "OrderType" NOT NULL,
    "price" DOUBLE PRECISION,
    "triggerPrice" DOUBLE PRECISION,
    "product" "ProductType" NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "BasketItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CorporateAction" (
    "id" TEXT NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "actionType" "CorporateActionType" NOT NULL,
    "exDate" TIMESTAMP(3) NOT NULL,
    "recordDate" TIMESTAMP(3),
    "announcementDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "oldSymbol" TEXT,
    "newSymbol" TEXT,
    "ratio" TEXT,
    "dividendAmount" DOUBLE PRECISION,
    "isProcessed" BOOLEAN NOT NULL DEFAULT false,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CorporateAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TradeJournal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tradeId" TEXT,
    "orderId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT NOT NULL,
    "tags" TEXT[],
    "strategy" TEXT,
    "emotionalState" TEXT,
    "learnings" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TradeJournal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyPnL" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "realizedPnl" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "unrealizedPnl" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "totalPnl" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "equityPnl" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "foPnl" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "commodityPnl" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "charges" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyPnL_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_panNumber_key" ON "User"("panNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_aadhaarNumber_key" ON "User"("aadhaarNumber");

-- CreateIndex
CREATE INDEX "User_email_phone_idx" ON "User"("email", "phone");

-- CreateIndex
CREATE INDEX "Nominee_userId_idx" ON "Nominee"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserVerification_userId_key" ON "UserVerification"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE INDEX "BankAccount_userId_idx" ON "BankAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE INDEX "Session_userId_token_idx" ON "Session"("userId", "token");

-- CreateIndex
CREATE UNIQUE INDEX "FundTransaction_utrNumber_key" ON "FundTransaction"("utrNumber");

-- CreateIndex
CREATE INDEX "FundTransaction_userId_transactionType_status_idx" ON "FundTransaction"("userId", "transactionType", "status");

-- CreateIndex
CREATE INDEX "Margin_userId_idx" ON "Margin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Instrument_instrumentToken_key" ON "Instrument"("instrumentToken");

-- CreateIndex
CREATE INDEX "Instrument_tradingSymbol_exchange_idx" ON "Instrument"("tradingSymbol", "exchange");

-- CreateIndex
CREATE INDEX "Instrument_instrumentToken_idx" ON "Instrument"("instrumentToken");

-- CreateIndex
CREATE INDEX "MarketDepth_instrumentId_side_timestamp_idx" ON "MarketDepth"("instrumentId", "side", "timestamp");

-- CreateIndex
CREATE INDEX "PriceHistory_instrumentId_ohlcDate_idx" ON "PriceHistory"("instrumentId", "ohlcDate");

-- CreateIndex
CREATE UNIQUE INDEX "PriceHistory_instrumentId_ohlcDate_interval_key" ON "PriceHistory"("instrumentId", "ohlcDate", "interval");

-- CreateIndex
CREATE INDEX "Portfolio_userId_idx" ON "Portfolio"("userId");

-- CreateIndex
CREATE INDEX "Holding_userId_idx" ON "Holding"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Holding_userId_instrumentId_product_key" ON "Holding"("userId", "instrumentId", "product");

-- CreateIndex
CREATE INDEX "Position_userId_tradingSymbol_idx" ON "Position"("userId", "tradingSymbol");

-- CreateIndex
CREATE UNIQUE INDEX "Position_userId_instrumentId_product_key" ON "Position"("userId", "instrumentId", "product");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderId_key" ON "Order"("orderId");

-- CreateIndex
CREATE INDEX "Order_userId_status_idx" ON "Order"("userId", "status");

-- CreateIndex
CREATE INDEX "Order_orderId_idx" ON "Order"("orderId");

-- CreateIndex
CREATE INDEX "Order_tradingSymbol_exchange_idx" ON "Order"("tradingSymbol", "exchange");

-- CreateIndex
CREATE UNIQUE INDEX "Trade_tradeId_key" ON "Trade"("tradeId");

-- CreateIndex
CREATE INDEX "Trade_userId_tradingSymbol_idx" ON "Trade"("userId", "tradingSymbol");

-- CreateIndex
CREATE INDEX "Trade_tradeId_idx" ON "Trade"("tradeId");

-- CreateIndex
CREATE UNIQUE INDEX "TradeCharges_tradeId_key" ON "TradeCharges"("tradeId");

-- CreateIndex
CREATE INDEX "GTTOrder_userId_status_idx" ON "GTTOrder"("userId", "status");

-- CreateIndex
CREATE INDEX "Watchlist_userId_idx" ON "Watchlist"("userId");

-- CreateIndex
CREATE INDEX "WatchlistGroup_watchlistId_idx" ON "WatchlistGroup"("watchlistId");

-- CreateIndex
CREATE INDEX "WatchlistItem_groupId_idx" ON "WatchlistItem"("groupId");

-- CreateIndex
CREATE INDEX "WatchlistItem_instrumentId_idx" ON "WatchlistItem"("instrumentId");

-- CreateIndex
CREATE UNIQUE INDEX "WatchlistItem_groupId_instrumentId_key" ON "WatchlistItem"("groupId", "instrumentId");

-- CreateIndex
CREATE INDEX "Alert_userId_isTriggered_isRead_idx" ON "Alert"("userId", "isTriggered", "isRead");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "Basket_userId_idx" ON "Basket"("userId");

-- CreateIndex
CREATE INDEX "BasketItem_basketId_idx" ON "BasketItem"("basketId");

-- CreateIndex
CREATE INDEX "CorporateAction_instrumentId_exDate_idx" ON "CorporateAction"("instrumentId", "exDate");

-- CreateIndex
CREATE INDEX "TradeJournal_userId_date_idx" ON "TradeJournal"("userId", "date");

-- CreateIndex
CREATE INDEX "DailyPnL_userId_date_idx" ON "DailyPnL"("userId", "date");

-- AddForeignKey
ALTER TABLE "Nominee" ADD CONSTRAINT "Nominee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVerification" ADD CONSTRAINT "UserVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundTransaction" ADD CONSTRAINT "FundTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Margin" ADD CONSTRAINT "Margin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketDepth" ADD CONSTRAINT "MarketDepth_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "Instrument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceHistory" ADD CONSTRAINT "PriceHistory_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "Instrument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Holding" ADD CONSTRAINT "Holding_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "Instrument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Holding" ADD CONSTRAINT "Holding_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "Instrument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "Instrument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "Instrument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradeCharges" ADD CONSTRAINT "TradeCharges_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "Trade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GTTOrder" ADD CONSTRAINT "GTTOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Watchlist" ADD CONSTRAINT "Watchlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchlistGroup" ADD CONSTRAINT "WatchlistGroup_watchlistId_fkey" FOREIGN KEY ("watchlistId") REFERENCES "Watchlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchlistItem" ADD CONSTRAINT "WatchlistItem_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "WatchlistGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchlistItem" ADD CONSTRAINT "WatchlistItem_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "Instrument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Basket" ADD CONSTRAINT "Basket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BasketItem" ADD CONSTRAINT "BasketItem_basketId_fkey" FOREIGN KEY ("basketId") REFERENCES "Basket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyPnL" ADD CONSTRAINT "DailyPnL_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
