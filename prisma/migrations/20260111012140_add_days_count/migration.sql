-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN "daysCount" INTEGER NOT NULL DEFAULT 30;

-- AlterTable: Add column with default, then update existing rows from their Challenge
ALTER TABLE "UserChallenge" ADD COLUMN "daysCount" INTEGER;

-- Update existing UserChallenge rows with daysCount from their associated Challenge
UPDATE "UserChallenge" uc
SET "daysCount" = c."daysCount"
FROM "Challenge" c
WHERE uc."challengeId" = c.id;

-- Make the column required after populating existing data
ALTER TABLE "UserChallenge" ALTER COLUMN "daysCount" SET NOT NULL;
