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

    // Debug logging
    console.log('Middleware - Path:', request.nextUrl.pathname)
    console.log('Middleware - User:', user?.email)
    console.log('Middleware - Is Admin:', user?.user_metadata?.is_admin)
    console.log('Middleware - Error:', error)

    // Protect /admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!user) {
            console.log('Middleware - No user, redirecting to login')
            const loginUrl = new URL('/login', request.url)
            loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
            return NextResponse.redirect(loginUrl)
        }

        // Check if user is admin
        const isAdmin = user.user_metadata?.is_admin === true
        console.log('Middleware - Admin check:', isAdmin)
        
        if (!isAdmin) {
            console.log('Middleware - User is not admin, redirecting to home')
            // Redirect to home with error message
            const url = new URL('/', request.url)
            url.searchParams.set('error', 'unauthorized')
            return NextResponse.redirect(url)
        }
        
        console.log('Middleware - Admin access granted')
    }

    return response
}

export const config = {
    matcher: [],
}
