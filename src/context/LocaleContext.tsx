"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Locale = 'en' | 'el';

interface LocaleContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('en');
    const [messages, setMessages] = useState<any>({});

    useEffect(() => {
        // Get locale from localStorage or default to 'en'
        const storedLocale = (localStorage.getItem('locale') as Locale) || 'en';
        setLocaleState(storedLocale);
        loadMessages(storedLocale);
    }, []);

    const loadMessages = async (locale: Locale) => {
        try {
            const msgs = await import(`../../messages/${locale}.json`);
            setMessages(msgs.default);
        } catch (error) {
            console.error('Failed to load messages:', error);
            // Fallback to English
            const msgs = await import(`../../messages/en.json`);
            setMessages(msgs.default);
        }
    };

    const setLocale = (newLocale: Locale) => {
        localStorage.setItem('locale', newLocale);
        setLocaleState(newLocale);
        loadMessages(newLocale);
    };

    // Simple translation function
    const t = (key: string): string => {
        const keys = key.split('.');
        let value: any = messages;
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return key; // Return key if translation not found
            }
        }
        
        return typeof value === 'string' ? value : key;
    };

    return (
        <LocaleContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LocaleContext.Provider>
    );
}

export function useLocale() {
    const context = useContext(LocaleContext);
    if (context === undefined) {
        throw new Error('useLocale must be used within a LocaleProvider');
    }
    return context;
}
