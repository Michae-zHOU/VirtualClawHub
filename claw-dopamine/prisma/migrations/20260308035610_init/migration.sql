-- CreateTable
CREATE TABLE "AgentDopamine" (
    "agentId" TEXT NOT NULL PRIMARY KEY,
    "level" REAL NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "DopamineEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agentId" TEXT NOT NULL,
    "delta" REAL NOT NULL,
    "reason" TEXT,
    "metaJson" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "DopamineEvent_agentId_createdAt_idx" ON "DopamineEvent"("agentId", "createdAt");
