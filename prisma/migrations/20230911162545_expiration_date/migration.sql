/*
  Warnings:

  - You are about to drop the column `expirationDate` on the `Card` table. All the data in the column will be lost.
  - Added the required column `expiration` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Card" DROP COLUMN "expirationDate",
ADD COLUMN     "expiration" TEXT NOT NULL;
