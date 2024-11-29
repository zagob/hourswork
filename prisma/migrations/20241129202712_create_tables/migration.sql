-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "DetailHours" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "totalHoursWorked" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "RegisterHours" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "times" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
