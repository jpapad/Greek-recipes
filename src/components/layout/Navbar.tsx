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
import { useTranslations } from "@/hooks/useTranslations";
import { useState, useEffect } from "react";

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const { t } = useTranslations();

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
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isVisible ? 'translate-y-0' : '-translate-y-full'
            }`}>
                <div className={`mx-auto px-6 transition-all duration-300 ${
                    isScrolled 
                        ? 'bg-white/70 dark:bg-black/70 backdrop-blur-xl shadow-lg border-b border-white/20 dark:border-white/5 py-3' 
                        : 'bg-transparent py-4'
                }`}>
                    <div className="flex items-center justify-between max-w-7xl mx-auto">
                        {/* Left Navigation */}
                        <nav className="hidden md:flex items-center gap-8 font-medium flex-1">
                            <Link href="/" className={`transition-all hover:scale-105 relative group ${
                                isScrolled ? 'text-foreground' : 'text-white drop-shadow-lg'
                            }`}>
                                {t('Navbar.home')}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full" />
                            </Link>
                            <Link href="/recipes" className={`transition-all hover:scale-105 relative group ${
                                isScrolled ? 'text-foreground' : 'text-white drop-shadow-lg'
                            }`}>
                                {t('Navbar.recipes')}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full" />
                            </Link>
                            <Link href="/regions" className={`transition-all hover:scale-105 relative group ${
                                isScrolled ? 'text-foreground' : 'text-white drop-shadow-lg'
                            }`}>
                                {t('Navbar.regions')}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full" />
                            </Link>
                            <Link href="/collections" className={`transition-all hover:scale-105 relative group ${
                                isScrolled ? 'text-foreground' : 'text-white drop-shadow-lg'
                            }`}>
                                {t('Navbar.collections')}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full" />
                            </Link>
                            <Link href="/recipes/search" className={`transition-all hover:scale-105 relative group ${
                                isScrolled ? 'text-foreground' : 'text-white drop-shadow-lg'
                            }`}>
                                Search
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full" />
                            </Link>
                            <Link href="/blog" className={`transition-all hover:scale-105 relative group ${
                                isScrolled ? 'text-foreground' : 'text-white drop-shadow-lg'
                            }`}>
                                Blog
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full" />
                            </Link>
                        </nav>

                        {/* Center Logo - Larger Size */}
                        <div className="flex items-center justify-center px-8">
                            <Link href="/" className="hover:scale-105 transition-transform group">
                                <div className={`relative transition-all duration-300 rounded-full border-3 border-white/80 bg-white/15 backdrop-blur-xl shadow-2xl p-3 ${
                                    isScrolled ? 'w-24 h-24' : 'w-32 h-32 md:w-40 md:h-40'
                                } drop-shadow-[0_0_30px_rgba(255,255,255,0.6)]`}>
                                    {/* Santa Hat */}
                                    <div className={`absolute -top-6 -right-4 transition-all duration-300 z-10 ${
                                        isScrolled ? 'w-16 h-16' : 'w-24 h-24 md:w-32 md:h-32'
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
                        <div className="flex items-center gap-6 flex-1 justify-end">
                            <nav className="hidden md:flex items-center gap-8 font-medium">
                                <Link href="/favorites" className={`transition-all hover:scale-105 relative group ${
                                    isScrolled ? 'text-foreground' : 'text-white drop-shadow-lg'
                                }`}>
                                    {t('Navbar.favorites')}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full" />
                                </Link>
                                <Link href="/meal-plan" className={`transition-all hover:scale-105 relative group ${
                                    isScrolled ? 'text-foreground' : 'text-white drop-shadow-lg'
                                }`}>
                                    {t('Navbar.mealPlan')}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full" />
                                </Link>
                            </nav>
                            
                            <div className="flex items-center gap-3">
                                <div className={isScrolled ? '' : 'text-white drop-shadow-lg'}>
                                    <SearchBar />
                                </div>
                                <div className={isScrolled ? '' : 'text-white drop-shadow-lg'}>
                                    <LanguageSwitcher />
                                </div>
                                <div className={isScrolled ? '' : 'text-white drop-shadow-lg'}>
                                    <ThemeToggle />
                                </div>
                                <div className={isScrolled ? '' : 'text-white drop-shadow-lg'}>
                                    <ShoppingListLink />
                                </div>
                                <div className={isScrolled ? '' : 'text-white drop-shadow-lg'}>
                                    <UserMenu />
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className={`md:hidden rounded-full transition-all hover:scale-110 ${
                                        isScrolled ? 'hover:bg-black/10' : 'text-white hover:bg-white/20'
                                    }`}
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                >
                                    {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 pt-24 md:hidden animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                    <GlassPanel className="relative mx-4 p-6 bg-white/95 backdrop-blur-2xl shadow-2xl animate-in slide-in-from-top duration-300">
                        <nav className="flex flex-col gap-4 font-medium text-muted-foreground">
                            <SearchAutocomplete placeholder={t('Common.search')} className="mb-2" />
                            <Link href="/" className="hover:text-primary transition-all p-2 hover:pl-4 rounded-lg hover:bg-white/50" onClick={() => setIsMobileMenuOpen(false)}>
                                {t('Navbar.home')}
                            </Link>
                            <Link href="/recipes" className="hover:text-primary transition-all p-2 hover:pl-4 rounded-lg hover:bg-white/50" onClick={() => setIsMobileMenuOpen(false)}>
                                {t('Navbar.recipes')}
                            </Link>
                            <Link href="/regions" className="hover:text-primary transition-colors p-2" onClick={() => setIsMobileMenuOpen(false)}>
                                {t('Navbar.regions')}
                            </Link>
                            <Link href="/collections" className="hover:text-primary transition-colors p-2" onClick={() => setIsMobileMenuOpen(false)}>
                                {t('Navbar.collections')}
                            </Link>
                            <Link href="/blog" className="hover:text-primary transition-colors p-2" onClick={() => setIsMobileMenuOpen(false)}>
                                Blog
                            </Link>
                            <Link href="/favorites" className="hover:text-primary transition-colors p-2" onClick={() => setIsMobileMenuOpen(false)}>
                                {t('Navbar.favorites')}
                            </Link>
                            <Link href="/meal-plan" className="hover:text-primary transition-colors p-2" onClick={() => setIsMobileMenuOpen(false)}>
                                {t('Navbar.mealPlan')}
                            </Link>
                            <Link href="/about" className="hover:text-primary transition-colors p-2" onClick={() => setIsMobileMenuOpen(false)}>
                                {t('Navbar.about')}
                            </Link>
                        </nav>
                    </GlassPanel>
                </div>
            )}
        </>
    );
}
