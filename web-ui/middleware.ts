import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {},
  {
    callbacks: {
      authorized({ token, req }) {
        if (req.nextUrl.pathname.startsWith("/me")) {
          if (token?.role !== "user") return false;
          return true;
        } else if (req.nextUrl.pathname.startsWith("/admin")) {
          if (token?.role !== "admin") return false;
          return true;
        }
        return true;
      },
    },
  }
);

export const config = { matcher: ["/me/:path*", "/admin/:path*"] };
