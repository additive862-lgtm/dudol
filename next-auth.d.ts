import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            nickname?: string;
            role: "USER" | "ADMIN";
        } & DefaultSession["user"]
    }

    interface User extends DefaultUser {
        nickname?: string;
        role: "USER" | "ADMIN";
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        nickname?: string;
        role: "USER" | "ADMIN";
    }
}
