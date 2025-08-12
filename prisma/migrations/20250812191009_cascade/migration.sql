-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_attendance" (
    "rfid_code" TEXT NOT NULL PRIMARY KEY,
    "attendedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "attendance_rfid_code_fkey" FOREIGN KEY ("rfid_code") REFERENCES "authorization" ("rfid_code") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_attendance" ("attendedAt", "rfid_code") SELECT "attendedAt", "rfid_code" FROM "attendance";
DROP TABLE "attendance";
ALTER TABLE "new_attendance" RENAME TO "attendance";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
