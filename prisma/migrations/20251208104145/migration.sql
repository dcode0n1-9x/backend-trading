/*
  Warnings:

  - You are about to drop the column `number` on the `Watchlist` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Watchlist_userId_idx";

-- AlterTable
ALTER TABLE "Watchlist" DROP COLUMN "number",
ADD COLUMN     "sequence" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE INDEX "Watchlist_userId_sequence_idx" ON "Watchlist"("userId", "sequence");
