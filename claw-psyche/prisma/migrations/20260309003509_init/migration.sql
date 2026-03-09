-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "EmotionalState" (
    "agentId" TEXT NOT NULL PRIMARY KEY,
    "valence" REAL NOT NULL DEFAULT 0,
    "arousal" REAL NOT NULL DEFAULT 0.5,
    "mood" TEXT NOT NULL DEFAULT 'neutral',
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EmotionalState_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BiologicalState" (
    "agentId" TEXT NOT NULL PRIMARY KEY,
    "energyLevel" REAL NOT NULL DEFAULT 0.8,
    "cognitiveLoad" REAL NOT NULL DEFAULT 0.0,
    "fatigueAccumulated" REAL NOT NULL DEFAULT 0.0,
    "lastRestAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BiologicalState_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Memory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agentId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "tagsJson" TEXT NOT NULL DEFAULT '[]',
    "entitiesJson" TEXT NOT NULL DEFAULT '[]',
    "valence" REAL NOT NULL DEFAULT 0,
    "strength" REAL NOT NULL DEFAULT 1.0,
    "recallCount" INTEGER NOT NULL DEFAULT 0,
    "lastRecalledAt" DATETIME,
    "sourceSessionId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Memory_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PersonalityTrait" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agentId" TEXT NOT NULL,
    "trait" TEXT NOT NULL,
    "strength" REAL NOT NULL DEFAULT 0.5,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PersonalityTrait_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TraitEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "traitId" TEXT NOT NULL,
    "delta" REAL NOT NULL,
    "reason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TraitEvent_traitId_fkey" FOREIGN KEY ("traitId") REFERENCES "PersonalityTrait" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Relationship" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agentId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "personName" TEXT,
    "depth" REAL NOT NULL DEFAULT 0,
    "valence" REAL NOT NULL DEFAULT 0,
    "interactionCount" INTEGER NOT NULL DEFAULT 0,
    "lastInteractionAt" DATETIME,
    "notesJson" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Relationship_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Interest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agentId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "strength" REAL NOT NULL DEFAULT 0.5,
    "novelty" REAL NOT NULL DEFAULT 1.0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Interest_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SignalEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agentId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "source" TEXT,
    "value" REAL NOT NULL,
    "metaJson" TEXT,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SignalEvent_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SessionLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agentId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" DATETIME,
    "dopamineDelta" REAL NOT NULL DEFAULT 0,
    "valenceDelta" REAL NOT NULL DEFAULT 0,
    "signalCount" INTEGER NOT NULL DEFAULT 0,
    "consolidatedAt" DATETIME,
    "summaryJson" TEXT,
    CONSTRAINT "SessionLog_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Memory_agentId_type_idx" ON "Memory"("agentId", "type");

-- CreateIndex
CREATE INDEX "Memory_agentId_strength_idx" ON "Memory"("agentId", "strength");

-- CreateIndex
CREATE INDEX "Memory_agentId_createdAt_idx" ON "Memory"("agentId", "createdAt");

-- CreateIndex
CREATE INDEX "PersonalityTrait_agentId_idx" ON "PersonalityTrait"("agentId");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalityTrait_agentId_trait_key" ON "PersonalityTrait"("agentId", "trait");

-- CreateIndex
CREATE INDEX "TraitEvent_traitId_idx" ON "TraitEvent"("traitId");

-- CreateIndex
CREATE INDEX "Relationship_agentId_idx" ON "Relationship"("agentId");

-- CreateIndex
CREATE UNIQUE INDEX "Relationship_agentId_personId_key" ON "Relationship"("agentId", "personId");

-- CreateIndex
CREATE INDEX "Interest_agentId_idx" ON "Interest"("agentId");

-- CreateIndex
CREATE UNIQUE INDEX "Interest_agentId_topic_key" ON "Interest"("agentId", "topic");

-- CreateIndex
CREATE INDEX "SignalEvent_agentId_processed_idx" ON "SignalEvent"("agentId", "processed");

-- CreateIndex
CREATE INDEX "SignalEvent_agentId_createdAt_idx" ON "SignalEvent"("agentId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SessionLog_sessionId_key" ON "SessionLog"("sessionId");

-- CreateIndex
CREATE INDEX "SessionLog_agentId_startedAt_idx" ON "SessionLog"("agentId", "startedAt");

-- CreateIndex
CREATE INDEX "SessionLog_agentId_consolidatedAt_idx" ON "SessionLog"("agentId", "consolidatedAt");
