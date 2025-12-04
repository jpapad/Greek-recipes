'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useState, useEffect } from 'react';

export function LanguageSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const [currentLocale, setCurrentLocale] = useState<'en' | 'el'>('el');

    useEffect(() => {
        // Get locale from localStorage or default to 'el' (Greek)
        const storedLocale = localStorage.getItem('locale') as 'en' | 'el' || 'el';
        setCurrentLocale(storedLocale);
    }, []);

    const switchLanguage = (locale: 'en' | 'el') => {
        localStorage.setItem('locale', locale);
        setCurrentLocale(locale);
        
        // Reload the page to apply new locale
        window.location.reload();
    };

    return (
        <div className="relative group">
            <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-white/20"
                title={currentLocale === 'en' ? 'Switch Language' : 'Αλλαγή Γλώσσας'}
            >
                <Globe className="h-5 w-5" />
                <span className="sr-only">
                    {currentLocale === 'en' ? 'Switch Language' : 'Αλλαγή Γλώσσας'}
                </span>
            </Button>
            <div className="absolute right-0 mt-2 w-40 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <button
                    onClick={() => switchLanguage('en')}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg transition-colors ${
                        currentLocale === 'en' ? 'bg-blue-50 dark:bg-blue-900/30 font-semibold' : ''
                    }`}
                >
                    🇬🇧 English
                </button>
                <button
                    onClick={() => switchLanguage('el')}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg transition-colors ${
                        currentLocale === 'el' ? 'bg-blue-50 dark:bg-blue-900/30 font-semibold' : ''
                    }`}
                >
                    🇬🇷 Ελληνικά
                </button>
            </div>
        </div>
    );
}
