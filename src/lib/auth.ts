import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    // Google login for general users + whitelisted admins
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/sign-in",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) {
        const adminEmails =
          process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) ?? [];

        const isAdmin = adminEmails.includes(user.email);

        token.email = user.email;
        token.role = user.role || undefined;
        token.isAdmin = isAdmin;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.email = token.email as string;
        session.user.role = token.role as string | undefined;
        session.user.isAdmin = token.isAdmin;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET!,
};