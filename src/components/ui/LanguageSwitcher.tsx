'use client';

import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useLocale } from 'next-intl';

export function LanguageSwitcher() {
    const locale = useLocale();

    const switchLanguage = (newLocale: string) => {
        // Set cookie for middleware
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

        // Reload to apply changes server-side
        window.location.reload();
    };

    return (
        <div className="relative group">
            <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-white/20"
                title={locale === 'en' ? 'Switch Language' : 'Αλλαγή Γλώσσας'}
            >
                <Globe className="h-5 w-5" />
                <span className="sr-only">
                    {locale === 'en' ? 'Switch Language' : 'Αλλαγή Γλώσσας'}
                </span>
            </Button>
            <div className="absolute right-0 mt-2 w-40 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <button
                    onClick={() => switchLanguage('en')}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg transition-colors ${locale === 'en' ? 'bg-blue-50 dark:bg-blue-900/30 font-semibold' : ''
                        }`}
                >
                    🇬🇧 English
                </button>
                <button
                    onClick={() => switchLanguage('el')}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg transition-colors ${locale === 'el' ? 'bg-blue-50 dark:bg-blue-900/30 font-semibold' : ''
                        }`}
                >
                    🇬🇷 Ελληνικά
                </button>
            </div>
        </div>
    );
}
