import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";
import Naver from "next-auth/providers/naver";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

const SOCIAL_PROVIDERS = new Set(["google", "kakao", "naver"]);

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      id: "admin",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }

        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) {
          return null;
        }

        const valid = await bcrypt.compare(password, admin.passwordHash);
        if (!valid) {
          return null;
        }

        return { id: admin.id, email: admin.email, type: "admin" };
      },
    }),
    Credentials({
      id: "user",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) {
          return null;
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
          return null;
        }

        return { id: user.id, email: user.email, name: user.name, type: "user" };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
    }),
    Naver({
      clientId: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!account || !SOCIAL_PROVIDERS.has(account.provider)) {
        return true;
      }

      if (!user.email) {
        return false;
      }

      const existing = await prisma.user.findUnique({ where: { email: user.email } });
      const record = existing
        ? existing
        : await prisma.user.create({
            data: {
              name: user.name || "회원",
              email: user.email,
              image: user.image ?? null,
              provider: account.provider,
            },
          });

      user.id = record.id;
      user.type = "user";
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.type = user.type;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.type = token.type as "admin" | "user";
      return session;
    },
  },
});
