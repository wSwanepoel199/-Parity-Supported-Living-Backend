-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Carer', 'Client', 'Admin');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "password" TEXT,
    "role" "Role" NOT NULL DEFAULT 'Carer',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "carerId" INTEGER NOT NULL,
    "client" TEXT,
    "hours" INTEGER,
    "date" TIMESTAMP(3),
    "kilos" INTEGER,
    "notes" TEXT,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Post_postId_key" ON "Post"("postId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_carerId_fkey" FOREIGN KEY ("carerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
