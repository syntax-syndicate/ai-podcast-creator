import { type NextRequest, NextResponse } from "next/server";
// import { createAuthClient } from "better-auth/client";

// const client = createAuthClient();

// Private routes that require authentication
// const protectedRoutes = ["/create(.*)"];

export async function middleware(request: NextRequest) {
  // const { pathname } = request.nextUrl;

  // Check if the current path is a protected route
  // const isProtectedRoute = protectedRoutes.some((route) => {
  //   const regex = new RegExp(`^${route}$`);
  //   return regex.test(pathname);
  // });

  // For non-public routes, check authentication
  // if (isProtectedRoute) {
  //   const { data: session } = await client.getSession({
  //     fetchOptions: {
  //       headers: {
  //         cookie: request.headers.get("cookie") ?? "",
  //       },
  //     },
  //   });

  //   if (!session) {
  //     return NextResponse.redirect(new URL("/signin", request.url));
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - api routes
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
