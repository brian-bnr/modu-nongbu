import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      type: "admin" | "user";
    } & DefaultSession["user"];
  }

  interface User {
    type: "admin" | "user";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    type: "admin" | "user";
  }
}
