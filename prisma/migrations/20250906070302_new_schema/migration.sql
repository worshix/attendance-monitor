/*
  Warnings:

  - The primary key for the `attendance` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `attendance` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_attendance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rfid_code" TEXT NOT NULL,
    "lecture_rfid_code" TEXT NOT NULL,
    "attendedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "attendance_rfid_code_fkey" FOREIGN KEY ("rfid_code") REFERENCES "authorization" ("rfid_code") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "attendance_lecture_rfid_code_fkey" FOREIGN KEY ("lecture_rfid_code") REFERENCES "lectures" ("lecture_rfid_code") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_attendance" ("attendedAt", "lecture_rfid_code", "rfid_code") SELECT "attendedAt", "lecture_rfid_code", "rfid_code" FROM "attendance";
DROP TABLE "attendance";
ALTER TABLE "new_attendance" RENAME TO "attendance";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
