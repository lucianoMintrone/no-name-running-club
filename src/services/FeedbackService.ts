import { prisma } from "@/lib/prisma";
import { createLinearIssue } from "@/lib/linear";
import type { FeedbackCategory, FeedbackLinearStatus } from "@prisma/client";

export type SubmitFeedbackParams = {
  userId: string;
  userEmail: string | null;
  category: FeedbackCategory;
  message: string;
  pagePath?: string | null;
  userAgent?: string | null;
  teamKey: string;
};

export type SubmitFeedbackResult = {
  feedbackId: string;
  linearIssueUrl: string | null;
  linearStatus: Extract<FeedbackLinearStatus, "created" | "failed">;
};

export class FeedbackService {
  static async submit(params: SubmitFeedbackParams): Promise<SubmitFeedbackResult> {
    const feedback = await prisma.feedback.create({
      data: {
        userId: params.userId,
        category: params.category,
        message: params.message,
        pagePath: params.pagePath ?? null,
        userAgent: params.userAgent ?? null,
        linearStatus: "pending",
      },
      select: { id: true },
    });

    return await this.createLinearIssueForFeedback({
      feedbackId: feedback.id,
      teamKey: params.teamKey,
      userEmail: params.userEmail,
    });
  }

  static async retryLinearIssue(feedbackId: string, teamKey: string): Promise<void> {
    await this.createLinearIssueForFeedback({ feedbackId, teamKey });
  }

  private static async createLinearIssueForFeedback(params: {
    feedbackId: string;
    teamKey: string;
    userEmail?: string | null;
  }): Promise<SubmitFeedbackResult> {
    const feedback = await prisma.feedback.findUnique({
      where: { id: params.feedbackId },
      include: { user: { select: { id: true, email: true } } },
    });

    if (!feedback) {
      throw new Error("Feedback not found");
    }

    if (feedback.linearStatus === "created" && feedback.linearIssueUrl) {
      return {
        feedbackId: feedback.id,
        linearIssueUrl: feedback.linearIssueUrl,
        linearStatus: "created",
      };
    }

    try {
      const issue = await createLinearIssue({
        teamKey: params.teamKey,
        title: `[Feedback] ${feedback.category}: ${feedback.message.slice(0, 80)}${
          feedback.message.length > 80 ? "…" : ""
        }`,
        description: [
          `Category: ${feedback.category}`,
          `User: ${feedback.user.email ?? params.userEmail ?? "unknown"} (${feedback.user.id})`,
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

      return {
        feedbackId: feedback.id,
        linearIssueUrl: issue.url,
        linearStatus: "created",
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error creating Linear issue";

      await prisma.feedback.update({
        where: { id: feedback.id },
        data: {
          linearStatus: "failed",
          linearError: message.slice(0, 2000),
        },
      });

      return {
        feedbackId: feedback.id,
        linearIssueUrl: null,
        linearStatus: "failed",
      };
    }
  }
}

