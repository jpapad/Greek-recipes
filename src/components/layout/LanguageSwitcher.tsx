"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export function LanguageSwitcher() {
    const [locale, setLocale] = useState('el');
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem('locale') || 'el';
        setLocale(stored);
    }, []);

    const toggleLanguage = () => {
        const newLocale = locale === 'el' ? 'en' : 'el';
        setLocale(newLocale);
        localStorage.setItem('locale', newLocale);
        
        // Set cookie for server components
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
        
        // Full page reload to apply all translations
        window.location.reload();
    };

    if (!mounted) {
        return (
            <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                disabled
            >
                <Languages className="w-5 h-5" />
            </Button>
        );
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="rounded-full"
            title={locale === 'el' ? 'Switch to English' : 'Αλλαγή σε Ελληνικά'}
        >
            <div className="flex items-center gap-1">
                <Languages className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">
                    {locale}
                </span>
            </div>
        </Button>
    );
}
