"use server";

import { auth } from "@/lib/auth";
import { RunService } from "@/services/RunService";

export interface SaveRunInput {
  temperature: number;
  position: number;
}

export async function getExistingRun(position: number) {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  return RunService.getRunByPosition(session.user.id, position);
}

export async function saveRun(input: SaveRunInput) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  return RunService.saveRunForUser(session.user.id, input);
}
