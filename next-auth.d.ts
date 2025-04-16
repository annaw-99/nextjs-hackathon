import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {

  interface Session {
    user: {
      id: number;
      role: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: number;
    role: string;
  }
}
