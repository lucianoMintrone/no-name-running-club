import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

// Base config without database adapter (Edge Runtime compatible)
export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthPage = nextUrl.pathname.startsWith("/auth");

      if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl));
      }

      return true;
    },
  },
};
