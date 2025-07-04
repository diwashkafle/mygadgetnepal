/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `Banner` table. All the data in the column will be lost.
  - Added the required column `ctaLink` to the `Banner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ctaText` to the `Banner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Banner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Banner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Banner" DROP COLUMN "imageUrl",
DROP COLUMN "link",
ADD COLUMN     "ctaLink" TEXT NOT NULL,
ADD COLUMN     "ctaText" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
