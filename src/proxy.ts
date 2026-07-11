import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function proxy(request: NextRequest) {
  const { supabaseResponse } = await updateSession(request)

  // ⚠️ FRONTEND-ONLY MODE (temporary)
  // Route guards (auth + onboarding) are disabled while backend wiring is in progress.
  // To re-enable once Supabase auth, profiles table, and RLS are ready:
  //   1. Restore the gating logic below (see git history).
  //   2. Delete the early-return NextResponse.next() and uncomment the
  //      auth/onboarding checks.
  // Reference: PRDERD.md §10 "Middleware route guard".
  return supabaseResponse

  /* eslint-disable */
  // const url = new URL(request.url)
  // const pathname = url.pathname
  // const isPublicPath =
  //   pathname === '/' ||
  //   pathname === '/login' ||
  //   pathname.startsWith('/api/auth/callback') ||
  //   pathname.startsWith('/api/billing/webhook')
  // const isAssetPath =
  //   pathname.startsWith('/_next') ||
  //   pathname.includes('.')
  // if (isAssetPath) return supabaseResponse
  // if (!user) {
  //   if (!isPublicPath) return NextResponse.redirect(new URL('/login', request.url))
  //   return supabaseResponse
  // }
  // if (user) {
  //   if (pathname === '/login') return NextResponse.redirect(new URL('/dashboard/x', request.url))
  //   if (pathname.startsWith('/dashboard') || pathname === '/profile') {
  //     // ...onboarding_completed check
  //   }
  // }
  // return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}