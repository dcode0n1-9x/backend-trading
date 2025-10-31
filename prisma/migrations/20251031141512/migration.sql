/*
  Warnings:

  - The `maritalStatus` column on the `UserProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `occupation` column on the `UserProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `annualIncome` column on the `UserProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tradingExperience` column on the `UserProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `fatherName` on table `UserProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `motherName` on table `UserProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "KYCStage" ADD VALUE 'FOUR';
ALTER TYPE "KYCStage" ADD VALUE 'FIVE';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "segment" DROP NOT NULL,
ALTER COLUMN "segment" SET DEFAULT 'EQUITY';

-- AlterTable
ALTER TABLE "UserProfile" ALTER COLUMN "addressLine1" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "state" DROP NOT NULL,
ALTER COLUMN "pincode" DROP NOT NULL,
ALTER COLUMN "fatherName" SET NOT NULL,
ALTER COLUMN "motherName" SET NOT NULL,
DROP COLUMN "maritalStatus",
ADD COLUMN     "maritalStatus" "MartialStatus" NOT NULL DEFAULT 'SINGLE',
ALTER COLUMN "country" DROP NOT NULL,
DROP COLUMN "occupation",
ADD COLUMN     "occupation" "Occupation" NOT NULL DEFAULT 'OTHERS',
DROP COLUMN "annualIncome",
ADD COLUMN     "annualIncome" "AnnualIncome" NOT NULL DEFAULT 'BELOW_1_LAKH',
DROP COLUMN "tradingExperience",
ADD COLUMN     "tradingExperience" "TradingExperience" NOT NULL DEFAULT 'NEW';
