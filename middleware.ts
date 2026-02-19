import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Allow access to login page
    if (path === "/login") {
      return NextResponse.next();
    }

    // Redirect to login if no token
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Check permissions for specific routes
    const permissions = (token.permissions as string[]) || [];

    // Inventory routes
    if (path.startsWith("/inventory")) {
      if (!permissions.includes("inventory.view") && !permissions.includes("admin")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Production routes
    if (path.startsWith("/production")) {
      if (!permissions.includes("production.view") && !permissions.includes("admin")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Purchases routes
    if (path.startsWith("/purchases")) {
      if (!permissions.includes("purchases.view") && !permissions.includes("admin")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Sales routes
    if (path.startsWith("/sales")) {
      if (!permissions.includes("sales.view") && !permissions.includes("admin")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Alerts routes - dashboard.view permission
    if (path.startsWith("/alerts")) {
      if (!permissions.includes("dashboard.view") && !permissions.includes("admin")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Settings/Users routes - admin only
    if (path.startsWith("/settings") || path.startsWith("/users")) {
      if (!permissions.includes("admin")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        if (path === "/login") return true;
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
