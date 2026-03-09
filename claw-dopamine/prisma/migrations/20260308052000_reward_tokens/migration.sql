-- Add RewardToken table for store-issued, device-redeemable dopamine boosts

CREATE TABLE "RewardToken" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "delta" REAL NOT NULL,
    "effectJson" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    "redeemedAt" DATETIME,
    "redeemedBy" TEXT,
    CONSTRAINT "RewardToken_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "RewardToken_accountId_idx" ON "RewardToken"("accountId");
CREATE INDEX "RewardToken_expiresAt_idx" ON "RewardToken"("expiresAt");
