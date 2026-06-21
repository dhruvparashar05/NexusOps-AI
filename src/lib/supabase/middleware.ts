import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  if (supabaseUrl.endsWith("/rest/v1/")) {
    supabaseUrl = supabaseUrl.substring(0, supabaseUrl.length - "/rest/v1/".length);
  } else if (supabaseUrl.endsWith("/rest/v1")) {
    supabaseUrl = supabaseUrl.substring(0, supabaseUrl.length - "/rest/v1".length);
  }
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  const supabase = createServerClient(
    supabaseUrl,
    anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  let user: any = null;
  const isDemoMode = supabaseUrl === "https://placeholder-project.supabase.co";

  if (isDemoMode) {
    const demoCookie = request.cookies.get("sb-demo-session");
    if (demoCookie?.value) {
      try {
        user = JSON.parse(decodeURIComponent(demoCookie.value));
      } catch (err) {
        user = {
          id: "demo-user-id",
          email: "admin@nexusops.com",
          user_metadata: {
            name: "Demo Admin",
            organization_name: "NexusOps Hub"
          }
        };
      }
    }
  } else {
    try {
      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser();
      user = supabaseUser;
    } catch (err) {
      console.error("Supabase auth session fetch error:", err);
    }
  }

  const url = request.nextUrl.clone();
  
  // Define protected dashboard routes
  const protectedRoutes = [
    "/dashboard",
    "/communities",
    "/events",
    "/tournaments",
    "/analytics",
    "/ai-copilot",
  ];

  const isProtectedRoute = protectedRoutes.some((route) =>
    url.pathname.startsWith(route)
  );

  // Redirect unauthenticated users to login
  if (isProtectedRoute && !user) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  if (
    (url.pathname.startsWith("/login") || url.pathname.startsWith("/signup")) &&
    user
  ) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Allow root path (Landing Page) to pass through without redirects

  return supabaseResponse;
}
