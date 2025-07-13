/*
  Warnings:

  - You are about to drop the column `endDate` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `subtitle` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Banner` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Banner" DROP COLUMN "endDate",
DROP COLUMN "priority",
DROP COLUMN "startDate",
DROP COLUMN "subtitle",
DROP COLUMN "updatedAt",
ALTER COLUMN "isActive" SET DEFAULT true;
