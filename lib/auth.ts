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
          throw new Error("Данните в полетата са невалидни");
        }
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        
        if (!user) {
          throw new Error("Invalid credentials");
        }

        if (bcrypt.compareSync(credentials.password as string, user.password)) {
          return { id: user.id, email: user.email };
        } else {
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
});
