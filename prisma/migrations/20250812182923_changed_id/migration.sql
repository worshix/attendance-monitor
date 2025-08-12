/*
  Warnings:

  - You are about to drop the column `authorizationId` on the `attendance` table. All the data in the column will be lost.
  - The primary key for the `authorization` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `authorization` table. All the data in the column will be lost.
  - Added the required column `rfid_code` to the `attendance` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_attendance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rfid_code" TEXT NOT NULL,
    "attendedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "attendance_rfid_code_fkey" FOREIGN KEY ("rfid_code") REFERENCES "authorization" ("rfid_code") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_attendance" ("attendedAt", "id") SELECT "attendedAt", "id" FROM "attendance";
DROP TABLE "attendance";
ALTER TABLE "new_attendance" RENAME TO "attendance";
CREATE TABLE "new_authorization" (
    "rfid_code" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "finger_print_id" TEXT,
    "flagged" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_authorization" ("createdAt", "finger_print_id", "flagged", "name", "rfid_code", "updatedAt") SELECT "createdAt", "finger_print_id", "flagged", "name", "rfid_code", "updatedAt" FROM "authorization";
DROP TABLE "authorization";
ALTER TABLE "new_authorization" RENAME TO "authorization";
CREATE UNIQUE INDEX "authorization_finger_print_id_key" ON "authorization"("finger_print_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
