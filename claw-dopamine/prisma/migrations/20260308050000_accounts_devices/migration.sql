-- This migration intentionally resets the MVP schema.
-- Rationale: moving from agent-scoped dopamine to account+device identity with QR pairing.
-- For production, write a data migration instead of dropping tables.

PRAGMA foreign_keys=OFF;

DROP TABLE IF EXISTS "AgentDopamine";
DROP TABLE IF EXISTS "DopamineEvent";

PRAGMA foreign_keys=ON;

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recoveryCode" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "label" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Device_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DopamineState" (
    "accountId" TEXT NOT NULL PRIMARY KEY,
    "level" REAL NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DopamineState_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DopamineEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "delta" REAL NOT NULL,
    "reason" TEXT,
    "metaJson" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DopamineEvent_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PairingInvite" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    "usedAt" DATETIME,
    CONSTRAINT "PairingInvite_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Device_accountId_idx" ON "Device"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Device_accountId_publicKey_key" ON "Device"("accountId", "publicKey");

-- CreateIndex
CREATE INDEX "DopamineEvent_accountId_createdAt_idx" ON "DopamineEvent"("accountId", "createdAt");

-- CreateIndex
CREATE INDEX "PairingInvite_accountId_idx" ON "PairingInvite"("accountId");

-- CreateIndex
CREATE INDEX "PairingInvite_expiresAt_idx" ON "PairingInvite"("expiresAt");
