-- CreateEnum
CREATE TYPE "FeedbackCategory" AS ENUM ('bug', 'idea', 'question');

-- CreateEnum
CREATE TYPE "FeedbackLinearStatus" AS ENUM ('pending', 'created', 'failed');

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "category" "FeedbackCategory" NOT NULL,
    "message" TEXT NOT NULL,
    "pagePath" TEXT,
    "userAgent" TEXT,
    "linearIssueId" TEXT,
    "linearIssueUrl" TEXT,
    "linearStatus" "FeedbackLinearStatus" NOT NULL DEFAULT 'pending',
    "linearError" TEXT,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Feedback_createdAt_idx" ON "Feedback"("createdAt");

-- CreateIndex
CREATE INDEX "Feedback_userId_idx" ON "Feedback"("userId");

-- CreateIndex
CREATE INDEX "Feedback_linearStatus_idx" ON "Feedback"("linearStatus");

-- CreateIndex
CREATE INDEX "Feedback_category_idx" ON "Feedback"("category");

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

