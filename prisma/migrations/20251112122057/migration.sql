/*
  Warnings:

  - Added the required column `type` to the `Margin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Margin" ADD COLUMN     "type" "Segment" NOT NULL;
