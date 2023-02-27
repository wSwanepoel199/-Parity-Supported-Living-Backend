/*
  Warnings:

  - You are about to drop the column `client` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" RENAME COLUMN "client" TO "clientString";
