import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Use base config without Prisma for Edge Runtime compatibility
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
