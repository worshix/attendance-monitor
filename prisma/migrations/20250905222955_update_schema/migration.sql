/*
  Warnings:

  - Added the required column `lecture_rfid_code` to the `attendance` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "lectures" (
    "lecture_rfid_code" TEXT NOT NULL PRIMARY KEY,
    "course" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_attendance" (
    "rfid_code" TEXT NOT NULL PRIMARY KEY,
    "lecture_rfid_code" TEXT NOT NULL,
    "attendedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "attendance_rfid_code_fkey" FOREIGN KEY ("rfid_code") REFERENCES "authorization" ("rfid_code") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "attendance_lecture_rfid_code_fkey" FOREIGN KEY ("lecture_rfid_code") REFERENCES "lectures" ("lecture_rfid_code") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_attendance" ("attendedAt", "rfid_code") SELECT "attendedAt", "rfid_code" FROM "attendance";
DROP TABLE "attendance";
ALTER TABLE "new_attendance" RENAME TO "attendance";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "lectures_lecture_rfid_code_key" ON "lectures"("lecture_rfid_code");
