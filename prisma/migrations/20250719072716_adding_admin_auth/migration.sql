-- CreateTable
CREATE TABLE "AdminPinAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastTried" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminPinAttempt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AdminPinAttempt" ADD CONSTRAINT "AdminPinAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
