import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Owner Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "owner@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const { email, password } = credentials || {};

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(password!, user.password);
        if (!isValid) {
          return null;
        }

        return { id: user.id, email: user.email, role: user.role };
      },
    })
  ],
  pages: {
    signIn: "/auth/owner",
  },
  callbacks: {
    async session({ session, token }) {
      session.user = { 
        id: token.id as number, 
        email: session.user?.email, 
        role: token.role as string 
      };
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
