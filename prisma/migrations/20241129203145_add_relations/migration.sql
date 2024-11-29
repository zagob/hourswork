/*
  Warnings:

  - Added the required column `userId` to the `RegisterHours` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RegisterHours" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "times" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "RegisterHours_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RegisterHours" ("createdAt", "id", "times", "updatedAt") SELECT "createdAt", "id", "times", "updatedAt" FROM "RegisterHours";
DROP TABLE "RegisterHours";
ALTER TABLE "new_RegisterHours" RENAME TO "RegisterHours";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "detailHoursId" TEXT,
    CONSTRAINT "User_detailHoursId_fkey" FOREIGN KEY ("detailHoursId") REFERENCES "DetailHours" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("email", "id", "name") SELECT "email", "id", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_detailHoursId_key" ON "User"("detailHoursId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
