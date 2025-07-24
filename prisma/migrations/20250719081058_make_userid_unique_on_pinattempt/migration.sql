/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `AdminPinAttempt` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AdminPinAttempt_userId_key" ON "AdminPinAttempt"("userId");
