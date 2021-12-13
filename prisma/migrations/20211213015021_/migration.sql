/*
  Warnings:

  - You are about to drop the column `userId` on the `County` table. All the data in the column will be lost.
  - Made the column `code` on table `County` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "County" DROP CONSTRAINT "County_userId_fkey";

-- AlterTable
ALTER TABLE "County" DROP COLUMN "userId",
ALTER COLUMN "code" SET NOT NULL;

-- CreateTable
CREATE TABLE "_CountyToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CountyToUser_AB_unique" ON "_CountyToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_CountyToUser_B_index" ON "_CountyToUser"("B");

-- AddForeignKey
ALTER TABLE "_CountyToUser" ADD FOREIGN KEY ("A") REFERENCES "County"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CountyToUser" ADD FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
