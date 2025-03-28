import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// protected routes
const protectedRoutes = createRouteMatcher([
  "/dashboard(.*)",
  "/resume(.*)",
  "/interview(.*)",
  "/ai-cover-letter(.*)",
  "/onboarding(.*)",
])


export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  // if user is not logged in and the route is protecte redirect user to the sign in page
  if (!userId && protectedRoutes(req)) {
    const { redirectToSignIn } = await auth()
    return redirectToSignIn()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}