-- CreateTable
CREATE TABLE "authorization" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "rfid_code" TEXT NOT NULL,
    "finger_print_id" TEXT,
    "flagged" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "authorization_rfid_code_key" ON "authorization"("rfid_code");

-- CreateIndex
CREATE UNIQUE INDEX "authorization_finger_print_id_key" ON "authorization"("finger_print_id");
