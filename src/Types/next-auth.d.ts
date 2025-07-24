import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
      isAdmin?: boolean;
      adminSessionExpiry?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: string;
    isAdmin?: boolean;
    adminSessionExpiry?: Date;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    isAdmin?: boolean;
    adminSessionExpiry?: string;
  }
}
