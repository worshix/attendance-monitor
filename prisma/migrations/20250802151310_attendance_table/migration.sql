-- CreateTable
CREATE TABLE "attendance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "authorizationId" INTEGER NOT NULL,
    "attendedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "attendance_authorizationId_fkey" FOREIGN KEY ("authorizationId") REFERENCES "authorization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
