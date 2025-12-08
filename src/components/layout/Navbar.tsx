"use client";

import Link from "next/link";
import Image from "next/image";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "./UserMenu";
import { ShoppingListLink } from "@/components/shopping/ShoppingListLink";
import { SearchBar } from "@/components/layout/SearchBar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SearchAutocomplete } from "@/components/ui/SearchAutocomplete";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect } from "react";

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const t = useTranslations();
    const locale = useLocale();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Check if scrolled past hero (to change navbar style)
            setIsScrolled(currentScrollY > 50);

            // Hide on scroll down, show on scroll up
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'
                }`}>
                <div className={`mx-auto px-6 transition-all duration-300 ${isScrolled
                    ? 'bg-white/70 dark:bg-black/70 backdrop-blur-xl shadow-lg border-b border-white/20 dark:border-white/5 py-3'
                    : 'bg-transparent py-4'
                    }`}>
                    <div className="flex items-center justify-between max-w-7xl mx-auto">
                        {/* Mobile Hamburger - Left Side */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`md:hidden rounded-full transition-all hover:scale-110 z-50 ${isScrolled ? 'hover:bg-black/10' : 'text-white hover:bg-white/20'
                                }`}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </Button>

                        {/* Left Navigation - Desktop Only */}
                        <nav className="hidden md:flex items-center gap-8 font-medium flex-1">
                            <Link href="/" className={`transition-all hover:scale-105 relative group ${isScrolled ? 'text-foreground' : 'text-white drop-shadow-lg'
                                }`}>
                                {t('Navbar.home')}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full" />
                            </Link>
                            <Link href="/recipes" className={`transition-all hover:scale-105 relative group ${isScrolled ? 'text-foreground' : 'text-white drop-shadow-lg'
                                }`}>
                                {t('Navbar.recipes')}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full" />
                            </Link>
                            <Link href="/regions" className={`transition-all hover:scale-105 relative group ${isScrolled ? 'text-foreground' : 'text-white drop-shadow-lg'
                                }`}>
                                {t('Navbar.regions')}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full" />
                            </Link>
                            <Link href="/collections" className={`transition-all hover:scale-105 relative group ${isScrolled ? 'text-foreground' : 'text-white drop-shadow-lg'
                                }`}>
                                {t('Navbar.collections')}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full" />
                            </Link>
                            <Link href="/recipes/search" className={`transition-all hover:scale-105 relative group ${isScrolled ? 'text-foreground' : 'text-white drop-shadow-lg'
                                }`}>
                                Search
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full" />
                            </Link>
                            <Link href="/blog" className={`transition-all hover:scale-105 relative group ${isScrolled ? 'text-foreground' : 'text-white drop-shadow-lg'
                                }`}>
                                Blog
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full" />
                            </Link>
                        </nav>

                        {/* Center Logo - Larger Size */}
                        <div className="flex items-center justify-center md:px-8">
                            <Link href="/" className="hover:scale-105 transition-transform group">
                                <div className={`relative transition-all duration-300 rounded-full border-3 border-white/80 bg-white backdrop-blur-xl shadow-2xl p-3 ${isScrolled ? 'w-24 h-24 md:w-36 md:h-36' : 'w-32 h-32 md:w-60 md:h-60 lg:w-80 lg:h-80'
                                    } drop-shadow-[0_0_30px_rgba(255,255,255,0.6)]`}>
                                    {/* Santa Hat */}
                                    <div className={`absolute -top-4 -right-3 md:-top-8 md:-right-6 transition-all duration-300 z-10 ${isScrolled ? 'w-16 h-16 md:w-24 md:h-24' : 'w-24 h-24 md:w-40 md:h-40 lg:w-48 lg:h-48'
                                        }`}>
                                        <Image
                                            src="/santa-hat.svg"
                                            alt="Santa Hat"
                                            fill
                                            className="object-contain animate-swing drop-shadow-lg"
                                            priority
                                        />
                                    </div>
                                    <div className="relative w-full h-full">
                                        <Image
                                            src="/logo.svg"
                                            alt="ΕΛΛΑΔΑ ΣΤΟ ΠΙΑΤΟ"
                                            fill
                                            className="object-contain"
                                            priority
                                        />
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Right Navigation & Actions */}
                        <div className="flex items-center gap-2 md:gap-6 flex-1 justify-end">
                            <nav className="hidden md:flex items-center gap-8 font-medium">
                                <Link href="/favorites" className={`transition-all hover:scale-105 relative group ${isScrolled ? 'text-foreground' : 'text-white drop-shadow-lg'
                                    }`}>
                                    {t('Navbar.favorites')}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full" />
                                </Link>
                                <Link href="/meal-plan" className={`transition-all hover:scale-105 relative group ${isScrolled ? 'text-foreground' : 'text-white drop-shadow-lg'
                                    }`}>
                                    {t('Navbar.mealPlan')}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full" />
                                </Link>
                            </nav>

                            <div className="flex items-center gap-2 md:gap-3">
                                <div className={`hidden sm:block ${isScrolled ? '' : 'text-white drop-shadow-lg'}`}>
                                    <SearchBar />
                                </div>
                                <div className={`hidden sm:block ${isScrolled ? '' : 'text-white drop-shadow-lg'}`}>
                                    <LanguageSwitcher />
                                </div>
                                <div className={`hidden sm:block ${isScrolled ? '' : 'text-white drop-shadow-lg'}`}>
                                    <ThemeToggle />
                                </div>
                                <div className={isScrolled ? '' : 'text-white drop-shadow-lg'}>
                                    <ShoppingListLink />
                                </div>
                                <div className={isScrolled ? '' : 'text-white drop-shadow-lg'}>
                                    <UserMenu />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu - Full Screen Overlay */}
            <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}>
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
                        }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                />

                {/* Menu Panel */}
                <div className={`absolute top-0 left-0 right-0 bottom-0 flex flex-col transition-transform duration-300 ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
                    }`}>
                    {/* Spacer for navbar */}
                    <div className="h-20" />

                    {/* Menu Content */}
                    <GlassPanel className="flex-1 mx-4 my-4 p-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl shadow-2xl overflow-y-auto">
                        {/* Search Bar at Top */}
                        <div className="mb-6">
                            <SearchAutocomplete placeholder={t('Common.search')} />
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex-1">
                                <LanguageSwitcher />
                            </div>
                            <ThemeToggle />
                            <ShoppingListLink />
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex flex-col gap-1">
                            <Link
                                href="/"
                                className="flex items-center gap-3 p-4 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all font-medium text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                🏠 {t('Navbar.home')}
                            </Link>
                            <Link
                                href="/recipes"
                                className="flex items-center gap-3 p-4 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all font-medium text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                🍳 {t('Navbar.recipes')}
                            </Link>
                            <Link
                                href="/regions"
                                className="flex items-center gap-3 p-4 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all font-medium text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                🗺️ {t('Navbar.regions')}
                            </Link>
                            <Link
                                href="/collections"
                                className="flex items-center gap-3 p-4 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all font-medium text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                📚 {t('Navbar.collections')}
                            </Link>
                            <Link
                                href="/blog"
                                className="flex items-center gap-3 p-4 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all font-medium text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                ✍️ Blog
                            </Link>
                            <Link
                                href="/favorites"
                                className="flex items-center gap-3 p-4 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all font-medium text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                ❤️ {t('Navbar.favorites')}
                            </Link>
                            <Link
                                href="/meal-plan"
                                className="flex items-center gap-3 p-4 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all font-medium text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                📅 {t('Navbar.mealPlan')}
                            </Link>
                            <Link
                                href="/recipes/search"
                                className="flex items-center gap-3 p-4 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all font-medium text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                🔍 Search
                            </Link>
                        </nav>
                    </GlassPanel>
                </div>
            </div>
        </>
    );
}
