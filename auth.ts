import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./database/drizzle";
import { admins } from "./database/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";
import { loginLimiter } from "./lib/ratelimit"; // <= Ajouter ceci

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        // -----------------------------
        // 🔒 RATE LIMIT UPSTASH
        // -----------------------------
        const forwardedFor =
          typeof (req?.headers as Headers | Record<string, string | undefined>)?.get === "function"
            ? (req!.headers as unknown as Headers).get("x-forwarded-for")
            : (req as any)?.headers?.["x-forwarded-for"];

        const ip = forwardedFor?.toString() || "anonymous-ip";

        const { success } = await loginLimiter.limit(ip);

        if (!success) {
          // trop de tentatives
          throw new Error("Trop de tentatives. Réessayez plus tard.");
        }
        // -----------------------------

        // Vérifie si l'utilisateur existe
        const user = await db
          .select()
          .from(admins)
          .where(eq(admins.email, credentials.email.toString()))
          .limit(1);

        if (user.length === 0) {
          return null;
        }

        // Vérifier is_active
        if (user[0].is_active === false) {
          return null;
        }

        const isPassword = await compare(
          credentials.password.toString(),
          user[0].password
        );

        if (!isPassword) {
          return null;
        }

        return {
          id: user[0].id,
          name: user[0].username,
          email: user[0].email,
          role: user[0].role,
          is_active: user[0].is_active,
        } as User & { role: string; is_active: boolean };
      },
    }),
  ],

  pages: {
    signIn: "/auth/admin",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = (user as any).role;
        token.is_active = (user as any).is_active;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        (session.user as any).role = token.role;
        (session.user as any).is_active = token.is_active;
      }
      return session;
    },
  },
});
