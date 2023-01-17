/*
  Warnings:

  - You are about to drop the column `newAccount` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "newAccount",
ADD COLUMN     "resetPassword" BOOLEAN NOT NULL DEFAULT true;
