/*
  Warnings:

  - The `maritalStatus` column on the `UserProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `occupation` column on the `UserProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[aadhaarNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "RelationshipType" AS ENUM ('FATHER', 'MOTHER', 'SPOUSE', 'SIBLING', 'CHILD', 'OTHER');

-- CreateEnum
CREATE TYPE "MartialStatusType" AS ENUM ('SINGLE', 'MARRIED');

-- CreateEnum
CREATE TYPE "OccupationType" AS ENUM ('BUSINESS', 'HOUSEWIFE', 'STUDENT', 'PROFESSIONAL', 'PRIVATE_SECTOR', 'AGRICULTURIST', 'GOVERMENT_SERVICE', 'PUBLIC_SECTOR', 'RETIRED', 'OTHERS');

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "signature" TEXT,
DROP COLUMN "maritalStatus",
ADD COLUMN     "maritalStatus" "MartialStatusType",
DROP COLUMN "occupation",
ADD COLUMN     "occupation" "OccupationType";

-- DropEnum
DROP TYPE "public"."MartialStatus";

-- DropEnum
DROP TYPE "public"."Occupation";

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

-- CreateIndex
CREATE INDEX "Nominee_userId_idx" ON "Nominee"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_aadhaarNumber_key" ON "User"("aadhaarNumber");

-- AddForeignKey
ALTER TABLE "Nominee" ADD CONSTRAINT "Nominee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
