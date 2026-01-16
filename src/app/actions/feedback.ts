"use server";

import { auth } from "@/lib/auth";
import { withAdminAuth } from "@/lib/admin";
import { revalidatePath } from "next/cache";
import { FeedbackCategory } from "@prisma/client";
import { FeedbackService } from "@/services/FeedbackService";

export type SubmitFeedbackInput = {
  category: "bug" | "idea" | "question";
  message: string;
  pagePath?: string;
  userAgent?: string;
};

function normalizeMessage(message: string): string {
  return message.trim();
}

export async function submitFeedback(input: SubmitFeedbackInput): Promise<{
  feedbackId: string;
  linearIssueUrl: string | null;
  linearStatus: "created" | "failed";
}> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const message = normalizeMessage(input.message);
  if (!message) {
    throw new Error("Message is required");
  }
  if (message.length > 5000) {
    throw new Error("Message is too long");
  }

  const category = input.category as FeedbackCategory;
  if (!["bug", "idea", "question"].includes(category)) {
    throw new Error("Invalid category");
  }
  const teamKey = process.env.LINEAR_TEAM_KEY || "COA";

  return await FeedbackService.submit({
    userId: session.user.id,
    userEmail: session.user.email ?? null,
    category,
    message,
    pagePath: input.pagePath?.slice(0, 2048) || null,
    userAgent: input.userAgent?.slice(0, 512) || null,
    teamKey,
  });
}

export async function retryFeedbackLinearIssue(feedbackId: string): Promise<void> {
  await withAdminAuth(async () => {
    const teamKey = process.env.LINEAR_TEAM_KEY || "COA";
    await FeedbackService.retryLinearIssue(feedbackId, teamKey);

    revalidatePath("/admin/feedback");
  });
}

