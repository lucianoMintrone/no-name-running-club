"use server";

import { auth } from "@/lib/auth";
import { UserService } from "@/services/UserService";

export async function updateUserUnits(units: "imperial" | "metric") {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }
  await UserService.updateUser(session.user.id, { units });
}

export async function updateUserZipCode(zipCode: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }
  await UserService.updateUser(session.user.id, { zipCode: zipCode || null });
}
