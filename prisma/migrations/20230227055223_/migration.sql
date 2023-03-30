-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "clientId" TEXT;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("clientId") ON DELETE SET NULL ON UPDATE CASCADE;
