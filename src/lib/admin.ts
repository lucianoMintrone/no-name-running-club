import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export type UserRole = "member" | "admin";

/**
 * Check if a user has admin role
 */
export function isAdmin(role: string | undefined | null): boolean {
  return role === "admin";
}

/**
 * Get the list of admin emails from environment variable
 */
export function getAdminEmails(): string[] {
  const adminEmails = process.env.ADMIN_EMAILS || "";
  return adminEmails
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Check if an email should be auto-assigned admin role
 */
export function shouldBeAdmin(email: string): boolean {
  const adminEmails = getAdminEmails();
  return adminEmails.includes(email.toLowerCase());
}

/**
 * Server-side function to require admin access
 * Redirects to home page if user is not an admin
 */
export async function requireAdmin(): Promise<{
  userId: string;
  email: string;
  role: string;
}> {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  if (!isAdmin(session.user.role)) {
    redirect("/");
  }

  return {
    userId: session.user.id,
    email: session.user.email || "",
    role: session.user.role || "member",
  };
}

/**
 * Server action wrapper that ensures admin access
 * Throws an error if user is not an admin
 */
export async function withAdminAuth<T>(
  action: (userId: string) => Promise<T>
): Promise<T> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized: Not authenticated");
  }

  if (!isAdmin(session.user.role)) {
    throw new Error("Unauthorized: Admin access required");
  }

  return action(session.user.id);
}
