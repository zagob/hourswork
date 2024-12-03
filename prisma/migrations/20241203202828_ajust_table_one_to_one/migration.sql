/*
  Warnings:

  - You are about to drop the column `detailHoursId` on the `User` table. All the data in the column will be lost.
  - Added the required column `userId` to the `DetailHours` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DetailHours" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "totalHours" TEXT NOT NULL,
    "totalHoursWorked" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "DetailHours_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DetailHours" ("id", "totalHours", "totalHoursWorked") SELECT "id", "totalHours", "totalHoursWorked" FROM "DetailHours";
DROP TABLE "DetailHours";
ALTER TABLE "new_DetailHours" RENAME TO "DetailHours";
CREATE UNIQUE INDEX "DetailHours_userId_key" ON "DetailHours"("userId");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "externalId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL
);
INSERT INTO "new_User" ("email", "externalId", "id", "name") SELECT "email", "externalId", "id", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_externalId_key" ON "User"("externalId");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_email_idx" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
