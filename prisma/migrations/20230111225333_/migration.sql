/*
  Warnings:

  - You are about to drop the column `icon` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "icon";

-- CreateTable
CREATE TABLE "Icon" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "Icon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Icon_userId_key" ON "Icon"("userId");

-- AddForeignKey
ALTER TABLE "Icon" ADD CONSTRAINT "Icon_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
