import { NextResponse, type NextRequest } from "next/server";
import axios from "axios";

const guestRoutes = ["/login", "/register"];
const loggedInRoutes = ["/dashboard"];

export default async function authMiddleware(request: NextRequest) {
  try {
    const currentRoute = request.nextUrl.pathname;

    
    
    const isGuestRoute = guestRoutes.includes(currentRoute);
    const isLoggedInRoute = loggedInRoutes.includes(currentRoute);
    
    const sessionApiUrl = `${request.nextUrl.origin}/api/auth/session`;
    
    const response = await axios.get(sessionApiUrl, {
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
    });
    
    const session = response.data;
    
    if (!session && isLoggedInRoute) {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
    
    if (session && isLoggedInRoute) {
      if (session.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", request.nextUrl));
      }
    }
    
    if (session && isGuestRoute) {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error("Error in authMiddleware:", error);
  }
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
