/*
  Warnings:

  - You are about to drop the column `password` on the `PlayList` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Artist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Artist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Artist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PlayList" DROP COLUMN "password";

-- CreateIndex
CREATE UNIQUE INDEX "Artist_email_key" ON "Artist"("email");
