import { supabase } from './supabaseClient';

export async function signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        throw error;
    }

    return data;
}

export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        throw error;
    }

    return data;
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        throw error;
    }
}

export async function getUser() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
            // Suppress "Auth session missing" errors for anonymous users
            if (error.message?.includes('session')) {
                return null;
            }
            throw error;
        }

        return user;
    } catch (error: any) {
        // Suppress auth session errors
        if (error.message?.includes('session') || error.name === 'AuthSessionMissingError') {
            return null;
        }
        throw error;
    }
}

export async function getSession() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
            return null;
        }

        return session;
    } catch (error) {
        return null;
    }
}
