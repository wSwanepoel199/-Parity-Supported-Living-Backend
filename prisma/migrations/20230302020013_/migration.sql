/*
  Warnings:

  - You are about to drop the column `clientString` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" RENAME COLUMN "clientString" TO "clientName";
