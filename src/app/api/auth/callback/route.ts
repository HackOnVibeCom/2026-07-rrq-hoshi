import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Fetch user profile onboarding status
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', data.user.id)
        .single()
      
      // If onboarding is completed, send them to dashboard, otherwise redirect to onboarding wizard
      if (profile?.onboarding_completed) {
        return NextResponse.redirect(`${origin}/dashboard/x`)
      } else {
        return NextResponse.redirect(`${origin}/profile`)
      }
    }
  }

  // Redirect to a simple login error page
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
