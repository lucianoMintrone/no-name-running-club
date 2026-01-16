import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ChallengeService } from "@/services/ChallengeService";
import { EditChallengeForm } from "./EditChallengeForm";

interface EditChallengePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditChallengePage({ params }: EditChallengePageProps) {
  const { id } = await params;
  
  const challenge = await prisma.challenge.findUnique({
    where: { id },
  });

  if (!challenge) {
    notFound();
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <a
          href="/admin/challenges"
          className="text-nnrc-purple hover:text-nnrc-purple-dark"
        >
          ← Back
        </a>
        <h1 className="text-2xl font-bold text-nnrc-purple-dark">
          Edit Challenge: {ChallengeService.formatChallengeTitle(challenge)}
        </h1>
      </div>

      <EditChallengeForm
        challenge={{
          id: challenge.id,
          season: challenge.season,
          year: challenge.year,
          daysCount: challenge.daysCount,
          current: challenge.current,
          stravaUrl: challenge.stravaUrl,
          stravaEmbedCode: challenge.stravaEmbedCode,
        }}
      />
    </div>
  );
}
