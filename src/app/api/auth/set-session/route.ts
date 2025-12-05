import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { access_token, refresh_token } = body || {};

        const cookieStore = await cookies();

        const res = NextResponse.json({ success: false });

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                    set(name: string, value: string, options: any) {
                        // Set cookie on the outgoing response
                        res.cookies.set({ name, value, ...options });
                    },
                    remove(name: string, options: any) {
                        res.cookies.set({ name, value: '', ...options });
                    },
                },
            }
        );

        // Set session on server side - this will use cookies callback above
        const { error } = await supabase.auth.setSession({ access_token, refresh_token });

        if (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 400 });
        }

        res.headers.set('Cache-Control', 'no-store');
        // Return the response which contains set-cookie headers
        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
    }
}
