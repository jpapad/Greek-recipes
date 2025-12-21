import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // Locale -> pass as REQUEST header (useful for server components/handlers)
    const locale = request.cookies.get('NEXT_LOCALE')?.value || 'el'
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-locale', locale)

    let response = NextResponse.next({
        request: { headers: requestHeaders },
    })

    // Optional: never cache login
    if (pathname === '/login') {
        response.headers.set('cache-control', 'no-store')
        return response
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get: (name) => request.cookies.get(name)?.value,
                set: (name, value, options) => {
                    response.cookies.set({ name, value, ...options })
                },
                remove: (name, options) => {
                    response.cookies.set({ name, value: '', ...options })
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (pathname.startsWith('/admin')) {
        if (!user) {
            const loginUrl = new URL('/login', request.url)
            loginUrl.searchParams.set('redirect', request.nextUrl.pathname + request.nextUrl.search)
            return NextResponse.redirect(loginUrl, { headers: { 'cache-control': 'no-store' } })
        }

        // Check admin status from multiple sources (for compatibility)
        // Priority: profiles table > app_metadata > user_metadata
        let isAdmin = false;

        try {
            // First check profiles table (authoritative source)
            const { data: profile } = await supabase
                .from('profiles')
                .select('is_admin')
                .eq('id', user.id)
                .single();

            if (profile?.is_admin === true) {
                isAdmin = true;
            }
        } catch (error) {
            // If profile check fails, fall back to metadata
            console.error('Middleware: Failed to check profile admin status', error);
        }

        // Fallback to metadata if profile check didn't work
        if (!isAdmin) {
            isAdmin = user.app_metadata?.role === 'admin' || 
                      user.app_metadata?.is_admin === true ||
                      user.user_metadata?.is_admin === true ||
                      user.user_metadata?.is_admin === 'true';
        }

        if (!isAdmin) {
            const loginUrl = new URL('/login', request.url)
            loginUrl.searchParams.set('error', 'admin_access_required')
            loginUrl.searchParams.set('redirect', request.nextUrl.pathname + request.nextUrl.search)
            return NextResponse.redirect(loginUrl, { headers: { 'cache-control': 'no-store' } })
        }

        response.headers.set('cache-control', 'no-store')
    }

    return response
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/((?!_next/static|_next/image|favicon.ico|manifest.json|manifest.webmanifest|robots.txt|sitemap.xml|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
