/*
  Warnings:

  - Added the required column `totalHours` to the `DetailHours` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DetailHours" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "totalHours" TEXT NOT NULL,
    "totalHoursWorked" TEXT NOT NULL
);
INSERT INTO "new_DetailHours" ("id", "totalHoursWorked") SELECT "id", "totalHoursWorked" FROM "DetailHours";
DROP TABLE "DetailHours";
ALTER TABLE "new_DetailHours" RENAME TO "DetailHours";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
