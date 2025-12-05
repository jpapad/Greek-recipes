import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // Handle locale from cookie
    const locale = request.cookies.get('NEXT_LOCALE')?.value || 'el';
    response.headers.set('x-locale', locale);

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: Record<string, unknown>) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: Record<string, unknown>) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    const { data: { user }, error } = await supabase.auth.getUser()

    // Protect /admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        console.log('🔒 Admin route protection active')
        console.log('📧 User email:', user?.email || 'Not logged in')
        console.log('👤 User metadata:', JSON.stringify(user?.user_metadata, null, 2))
        
        if (!user) {
            console.log('❌ No user found - redirecting to login')
            const loginUrl = new URL('/login', request.url)
            loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
            return NextResponse.redirect(loginUrl)
        }

        // Check if user is admin
        const isAdmin = user.user_metadata?.is_admin === true
        console.log('🔑 Is Admin?', isAdmin)
        console.log('📋 Full user_metadata:', user.user_metadata)
        
        if (!isAdmin) {
            console.log('⛔ User is not admin - redirecting to login')
            console.log('💡 To fix: Run set-admin-user.sql in Supabase SQL Editor')
            const loginUrl = new URL('/login', request.url)
            loginUrl.searchParams.set('error', 'admin_access_required')
            loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
            return NextResponse.redirect(loginUrl)
        }
        
        console.log('✅ Admin access granted')
    }

    return response
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
