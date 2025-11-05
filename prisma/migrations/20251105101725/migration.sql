/*
  Warnings:

  - You are about to drop the column `watchlistId` on the `WatchlistItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[groupId,instrumentId]` on the table `WatchlistItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `groupId` to the `WatchlistItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."WatchlistItem" DROP CONSTRAINT "WatchlistItem_watchlistId_fkey";

-- DropIndex
DROP INDEX "public"."WatchlistItem_watchlistId_idx";

-- DropIndex
DROP INDEX "public"."WatchlistItem_watchlistId_instrumentId_key";

-- AlterTable
ALTER TABLE "WatchlistItem" DROP COLUMN "watchlistId",
ADD COLUMN     "groupId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "WatchlistGroup" (
    "id" TEXT NOT NULL,
    "watchlistId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WatchlistGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WatchlistGroup_watchlistId_idx" ON "WatchlistGroup"("watchlistId");

-- CreateIndex
CREATE INDEX "WatchlistItem_groupId_idx" ON "WatchlistItem"("groupId");

-- CreateIndex
CREATE INDEX "WatchlistItem_instrumentId_idx" ON "WatchlistItem"("instrumentId");

-- CreateIndex
CREATE UNIQUE INDEX "WatchlistItem_groupId_instrumentId_key" ON "WatchlistItem"("groupId", "instrumentId");

-- AddForeignKey
ALTER TABLE "WatchlistGroup" ADD CONSTRAINT "WatchlistGroup_watchlistId_fkey" FOREIGN KEY ("watchlistId") REFERENCES "Watchlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchlistItem" ADD CONSTRAINT "WatchlistItem_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "WatchlistGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
