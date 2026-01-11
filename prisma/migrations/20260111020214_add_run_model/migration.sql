-- CreateTable
CREATE TABLE "Run" (
    "id" TEXT NOT NULL,
    "userChallengeId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "durationInMinutes" INTEGER NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "units" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Run_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Run" ADD CONSTRAINT "Run_userChallengeId_fkey" FOREIGN KEY ("userChallengeId") REFERENCES "UserChallenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;
