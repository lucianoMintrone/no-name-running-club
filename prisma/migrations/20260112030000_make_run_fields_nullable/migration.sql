-- AlterTable: Make Run fields nullable to match schema
ALTER TABLE "Run" ALTER COLUMN "durationInMinutes" DROP NOT NULL;
ALTER TABLE "Run" ALTER COLUMN "distance" DROP NOT NULL;
ALTER TABLE "Run" ALTER COLUMN "units" DROP NOT NULL;
