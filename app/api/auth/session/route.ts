import { auth } from "@/lib/auth";
import { prisma } from "@/db/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user?.email) {
      return new Response(JSON.stringify(null), {
        status: 200,
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { email: true, role: true },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ email: user.email, role: user.role }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in GET handler:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}