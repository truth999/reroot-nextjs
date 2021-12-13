/*
  Warnings:

  - You are about to drop the `Submission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_ownerId_fkey";

-- DropTable
DROP TABLE "Submission";
