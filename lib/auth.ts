import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/db/prisma";
import { formSchema } from "@/app/(auth)/register/_schemas";

export const { auth, handlers } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const validatedValues = formSchema.safeParse(credentials);

        if (!validatedValues.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) {
          return null;
        }

        if (bcrypt.compareSync(credentials.password as string, user.password)) {
          return { id: user.id, email: user.email };
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user) {
        console.log("Sign-in failed: Invalid credentials or user not found");
      }
      return !!user;
    },
    async session({ session }) {
      return session;
    },
  },
});
