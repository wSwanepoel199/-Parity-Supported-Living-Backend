/*
  Warnings:

  - You are about to drop the column `test` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "test",
ALTER COLUMN "private" DROP NOT NULL;
