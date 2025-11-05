-- DropIndex
DROP INDEX "public"."DailyPnL_date_key";

-- AlterTable
ALTER TABLE "DailyPnL" ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;
