import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { UserService } from "@/services/UserService";
import { authConfig } from "@/lib/auth.config";
import { shouldBeAdmin } from "@/lib/admin";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && user.email) {
        await UserService.findOrCreateUser({
          email: user.email,
          name: user.name,
          image: user.image,
          emailVerified: profile?.email_verified ? new Date() : null,
        });
        
        // Auto-assign admin role if email is in ADMIN_EMAILS
        if (shouldBeAdmin(user.email)) {
          await prisma.user.update({
            where: { email: user.email },
            data: { role: "admin" },
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        // Look up the database user to get the correct ID and role
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { id: true, role: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
