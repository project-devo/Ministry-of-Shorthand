import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { loginSchema } from "@/schemas/auth";
import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      authorize: async (credentials) => {
        const parsedCredentials = loginSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          throw new Error("Please enter a valid email and password.");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: parsedCredentials.data.email.toLowerCase(),
          },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            role: true,
            isBanned: true,
            image: true,
            emailVerified: true,
          },
        });

        if (!user?.password) {
          throw new Error("Invalid email or password.");
        }

        if (user.isBanned) {
          throw new Error("This account has been suspended. Please contact support.");
        }

        if (!user.emailVerified) {
          throw new Error("Please verify your email before logging in.");
        }

        const isPasswordValid = await verifyPassword(
          parsedCredentials.data.password,
          user.password,
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password.");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (user) {
        token.role = user.role;
        token.sub = user.id;
      }

      if (account?.provider === "google" && token.email) {
        await prisma.user.update({
          where: {
            email: token.email,
          },
          data: {
            emailVerified: new Date(),
          },
        });
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role;
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
