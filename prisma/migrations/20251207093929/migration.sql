/*
  Warnings:

  - The `placedBy` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PlacedBy" AS ENUM ('USER', 'ALGO', 'SYSTEM_RMS', 'ADMIN', 'AUTO_SQUARE_OFF', 'PARENT_ORDER', 'STRATEGY');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "placedBy",
ADD COLUMN     "placedBy" "PlacedBy" NOT NULL DEFAULT 'USER';
