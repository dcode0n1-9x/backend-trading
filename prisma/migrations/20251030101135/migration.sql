/*
  Warnings:

  - You are about to drop the column `hasPassword` on the `User` table. All the data in the column will be lost.
  - Added the required column `currency` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MartialStatus" AS ENUM ('SINGLE', 'MARRIED');

-- CreateEnum
CREATE TYPE "AnnualIncome" AS ENUM ('BELOW_1_LAKH', 'BETWEEN_1_TO_5_LAKHS', 'BETWEEN_5_TO_10_LAKHS', 'BETWEEN_10_TO_25_LAKHS', 'BETWEEN_25_TO_1_CRORE', 'ABOVE_1_CRORE');

-- CreateEnum
CREATE TYPE "TradingExperience" AS ENUM ('NEW', 'BETWEEN_1_TO_5_YEARS', 'BETWEEN_5_TO_10_YEARS', 'BETWEEN_10_TO_15_YEARS', 'MORE_THAN_15_YEARS');

-- CreateEnum
CREATE TYPE "Occupation" AS ENUM ('BUSINESS', 'HOUSEWIFE', 'STUDENT', 'PROFESSIONAL', 'PRIVATE_SECTOR', 'AGRICULTURIST', 'GOVERMENT_SERVICE', 'PUBLIC_SECTOR', 'RETIRED', 'OTHERS');

-- CreateEnum
CREATE TYPE "SettlementType" AS ENUM ('QUATERLY', 'MONTHLY');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "hasPassword",
ADD COLUMN     "currency" TEXT NOT NULL;
