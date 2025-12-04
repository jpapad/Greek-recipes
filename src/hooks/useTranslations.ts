"use client";

import { useState, useEffect } from 'react';

type Locale = 'en' | 'el';
type Messages = Record<string, any>;

export function useTranslations() {
    const [locale, setLocaleState] = useState<Locale>('el');
    const [messages, setMessages] = useState<Messages>({});

    useEffect(() => {
        // Get locale from localStorage or default to 'el' (Greek)
        const storedLocale = (localStorage.getItem('locale') as Locale) || 'el';
        setLocaleState(storedLocale);
        loadMessages(storedLocale);

        // Listen for locale changes
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'locale') {
                const newLocale = (e.newValue as Locale) || 'el';
                setLocaleState(newLocale);
                loadMessages(newLocale);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const loadMessages = async (locale: Locale) => {
        try {
            const msgs = await import(`../../messages/${locale}.json`);
            setMessages(msgs.default);
        } catch (error) {
            console.error('Failed to load messages:', error);
            // Fallback to Greek
            const msgs = await import(`../../messages/el.json`);
            setMessages(msgs.default);
        }
    };

    // Translation function with nested key support (e.g., "Navbar.home")
    const t = (key: string, fallback?: string): string => {
        const keys = key.split('.');
        let value: any = messages;
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return fallback || key; // Return fallback or key if translation not found
            }
        }
        
        return typeof value === 'string' ? value : (fallback || key);
    };

    return { t, locale };
}
