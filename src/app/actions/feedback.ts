"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createLinearIssue } from "@/lib/linear";
import { withAdminAuth } from "@/lib/admin";
import { revalidatePath } from "next/cache";
import { FeedbackCategory } from "@prisma/client";

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

  const feedback = await prisma.feedback.create({
    data: {
      userId: session.user.id,
      category,
      message,
      pagePath: input.pagePath?.slice(0, 2048) || null,
      userAgent: input.userAgent?.slice(0, 512) || null,
      linearStatus: "pending",
    },
    select: { id: true, createdAt: true },
  });

  const teamKey = process.env.LINEAR_TEAM_KEY || "COA";

  try {
    const issue = await createLinearIssue({
      teamKey,
      title: `[Feedback] ${category}: ${message.slice(0, 80)}${message.length > 80 ? "…" : ""}`,
      description: [
        `Category: ${category}`,
        `User: ${session.user.email ?? "unknown"} (${session.user.id})`,
        input.pagePath ? `Page: ${input.pagePath}` : null,
        "",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
      labelName: "feedback",
      priority: 3,
      stateName: "Triage",
    });

    await prisma.feedback.update({
      where: { id: feedback.id },
      data: {
        linearIssueId: issue.id,
        linearIssueUrl: issue.url,
        linearStatus: "created",
        linearError: null,
      },
    });

    return { feedbackId: feedback.id, linearIssueUrl: issue.url, linearStatus: "created" };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error creating Linear issue";

    await prisma.feedback.update({
      where: { id: feedback.id },
      data: {
        linearStatus: "failed",
        linearError: message.slice(0, 2000),
      },
    });

    return { feedbackId: feedback.id, linearIssueUrl: null, linearStatus: "failed" };
  }
}

export async function retryFeedbackLinearIssue(feedbackId: string): Promise<void> {
  await withAdminAuth(async () => {
    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId },
      include: { user: { select: { id: true, email: true } } },
    });

    if (!feedback) {
      throw new Error("Feedback not found");
    }

    if (feedback.linearStatus === "created" && feedback.linearIssueUrl) {
      return;
    }

    const teamKey = process.env.LINEAR_TEAM_KEY || "COA";

    try {
      const issue = await createLinearIssue({
        teamKey,
        title: `[Feedback] ${feedback.category}: ${feedback.message.slice(0, 80)}${feedback.message.length > 80 ? "…" : ""}`,
        description: [
          `Category: ${feedback.category}`,
          `User: ${feedback.user.email ?? "unknown"} (${feedback.user.id})`,
          feedback.pagePath ? `Page: ${feedback.pagePath}` : null,
          "",
          feedback.message,
        ]
          .filter(Boolean)
          .join("\n"),
        labelName: "feedback",
        priority: 3,
        stateName: "Triage",
      });

      await prisma.feedback.update({
        where: { id: feedback.id },
        data: {
          linearIssueId: issue.id,
          linearIssueUrl: issue.url,
          linearStatus: "created",
          linearError: null,
        },
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error creating Linear issue";

      await prisma.feedback.update({
        where: { id: feedback.id },
        data: {
          linearStatus: "failed",
          linearError: message.slice(0, 2000),
        },
      });
    }

    revalidatePath("/admin/feedback");
  });
}

