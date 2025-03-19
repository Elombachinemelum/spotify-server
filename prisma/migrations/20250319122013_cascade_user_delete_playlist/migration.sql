-- DropForeignKey
ALTER TABLE "PlayList" DROP CONSTRAINT "PlayList_userId_fkey";

-- AddForeignKey
ALTER TABLE "PlayList" ADD CONSTRAINT "PlayList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
