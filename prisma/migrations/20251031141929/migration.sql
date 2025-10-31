/*
  Warnings:

  - The values [FOUR,FIVE] on the enum `KYCStage` will be removed. If these variants are still used in the database, this will fail.
  - The `maritalStatus` column on the `UserProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `occupation` column on the `UserProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `annualIncome` column on the `UserProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tradingExperience` column on the `UserProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `segment` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `addressLine1` on table `UserProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `UserProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `UserProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pincode` on table `UserProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `UserProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "KYCStage_new" AS ENUM ('ZERO', 'ONE', 'TWO', 'THREE');
ALTER TABLE "public"."UserVerification" ALTER COLUMN "stage" DROP DEFAULT;
ALTER TABLE "UserVerification" ALTER COLUMN "stage" TYPE "KYCStage_new" USING ("stage"::text::"KYCStage_new");
ALTER TYPE "KYCStage" RENAME TO "KYCStage_old";
ALTER TYPE "KYCStage_new" RENAME TO "KYCStage";
DROP TYPE "public"."KYCStage_old";
ALTER TABLE "UserVerification" ALTER COLUMN "stage" SET DEFAULT 'ONE';
COMMIT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "segment" SET NOT NULL,
ALTER COLUMN "segment" DROP DEFAULT;

-- AlterTable
ALTER TABLE "UserProfile" ALTER COLUMN "addressLine1" SET NOT NULL,
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "state" SET NOT NULL,
ALTER COLUMN "pincode" SET NOT NULL,
ALTER COLUMN "fatherName" DROP NOT NULL,
ALTER COLUMN "motherName" DROP NOT NULL,
ALTER COLUMN "country" SET NOT NULL,
DROP COLUMN "maritalStatus",
ADD COLUMN     "maritalStatus" TEXT,
DROP COLUMN "occupation",
ADD COLUMN     "occupation" TEXT,
DROP COLUMN "annualIncome",
ADD COLUMN     "annualIncome" TEXT,
DROP COLUMN "tradingExperience",
ADD COLUMN     "tradingExperience" TEXT;
