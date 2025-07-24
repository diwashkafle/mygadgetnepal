/*
  Warnings:

  - You are about to drop the `AdminPinAttempt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AdminRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AdminPinAttempt" DROP CONSTRAINT "AdminPinAttempt_userId_fkey";

-- DropForeignKey
ALTER TABLE "AdminRequest" DROP CONSTRAINT "AdminRequest_userId_fkey";

-- DropTable
DROP TABLE "AdminPinAttempt";

-- DropTable
DROP TABLE "AdminRequest";

-- DropEnum
DROP TYPE "AdminRequestStatus";
