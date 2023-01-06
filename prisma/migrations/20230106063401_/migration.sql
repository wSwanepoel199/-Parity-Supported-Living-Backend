-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_carerId_fkey";

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "carerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_carerId_fkey" FOREIGN KEY ("carerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
