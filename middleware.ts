import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define specific routes as public
const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware((auth, request) => {
  const { userId, orgId } = auth(); // Destructure userId and orgId from auth()

  // Redirect if trying to access a protected route without being authenticated
  if (!isPublicRoute(request) && !userId) {
    // Redirect to sign-in page with a return URL
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect_url", request.url); // Set return URL in query params
    return NextResponse.redirect(signInUrl);
  }

  // Redirect authenticated users on public routes to the organization page or select-org
  if (userId && isPublicRoute(request)) {
    let path = "/select-org";

    if (orgId) {
      path = `/organization/${orgId}`;
    }

    const orgSelectionUrl = new URL(path, request.url);
    return NextResponse.redirect(orgSelectionUrl);
  }

  // Redirect signed-in users without an organization to the select-org page
  if (userId && !orgId && request.nextUrl.pathname !== "/select-org") {
    const selectOrgUrl = new URL("/select-org", request.url);
    return NextResponse.redirect(selectOrgUrl);
  }

  // If no redirect is necessary, continue with the request
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static assets (e.g., _next, images, etc.)
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

// import { NextResponse } from "next/server";
// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { RedirectToSignIn } from "@clerk/nextjs";

// // Define specific routes as public
// const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

// export default clerkMiddleware((auth, request) => {
//   // Protect all routes in application
//   if (!isPublicRoute(request)) {
//     auth().protect();
//   }

//   if (auth().userId && isPublicRoute(request)) {
//     let path = "/select-org";

//     if (auth().orgId) {
//       path = `/organization/${auth().orgId}`;
//     }

//     const orgSelection = new URL(path, request.url);
//     return NextResponse.redirect(orgSelection);
//   }

//   if (!auth().userId && !isPublicRoute) {
//     return RedirectToSignIn({ signInForceRedirectUrl: request.url });
//   }

//   if (
//     auth().userId &&
//     !auth().orgId &&
//     request.nextUrl.pathname !== "/select-org"
//   ) {
//     const orgSelection = new URL("/select-org", request.url);
//     return NextResponse.redirect(orgSelection);
//   }
// });

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// };
