import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value
  const { pathname } = req.nextUrl

  // 1. If trying to access dashboard WITHOUT a token -> Redirect to Sign In
  if (pathname.startsWith("/dashboard")) {
    if (!token) return NextResponse.redirect(new URL("/sign-in", req.url))

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET)
      await jwtVerify(token, secret)
      return NextResponse.next()
    } catch {
      return NextResponse.redirect(new URL("/sign-in", req.url))
    }
  }

  // 2. If already logged in and trying to access Sign In -> Redirect to Dashboard
  if ((pathname === "/sign-in" || pathname==="/sign-up" || pathname==="/verify") && token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET)
      await jwtVerify(token, secret)
      return NextResponse.redirect(new URL("/dashboard", req.url))
    } catch {
      // If token is invalid, let them stay on sign-in page
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in","/sign-up","/verify/:path*"],
}