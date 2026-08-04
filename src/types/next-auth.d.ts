import { DefaultSession } from "next-auth";
import type { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      type: "admin" | "user";
      role?: Role;
    } & DefaultSession["user"];
  }

  interface User {
    type: "admin" | "user";
    role?: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    type: "admin" | "user";
    role?: Role;
  }
}
