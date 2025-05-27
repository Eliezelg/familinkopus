/*
  Warnings:

  - A unique constraint covering the columns `[cognitoUsername]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "cognitoUsername" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_cognitoUsername_key" ON "User"("cognitoUsername");

-- CreateIndex
CREATE INDEX "User_cognitoUsername_idx" ON "User"("cognitoUsername");
