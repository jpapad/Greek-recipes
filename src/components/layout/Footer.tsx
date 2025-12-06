"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";

export function Footer() {
    const { t } = useTranslations();
    
    return (
        <footer className="mt-32 relative">
            {/* Wave Divider */}
            <div className="absolute top-0 left-0 right-0 -translate-y-full">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20">
                    <path d="M0,0 C150,80 350,80 600,40 C850,0 1050,0 1200,40 L1200,120 L0,120 Z" 
                          fill="oklch(0.92 0.02 220)" 
                          fillOpacity="0.3" />
                    <path d="M0,20 C200,100 400,100 600,60 C800,20 1000,20 1200,60 L1200,120 L0,120 Z" 
                          fill="oklch(0.94 0.015 215)" 
                          fillOpacity="0.5" />
                </svg>
            </div>

            <GlassPanel className="rounded-none bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-white/40 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                        {/* Brand Section */}
                        <div className="space-y-4">
                            <Link href="/" className="inline-flex items-center gap-3 group">
                                <div className="relative w-16 h-16 rounded-full bg-white shadow-lg p-2">
                                    <Image
                                        src="/logo.svg"
                                        alt={t('Footer.brandTitle')}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div className="flex flex-col leading-tight">
                                    <span className="text-lg font-bold text-foreground">{t('Footer.brandTitle')}</span>
                                    <span className="text-xs text-muted-foreground">{t('Footer.brandSubtitle')}</span>
                                </div>
                            </Link>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {t('Footer.brandDescription')}
                            </p>
                            {/* Social Links */}
                            <div className="flex gap-3 pt-2">
                                <a href="#" className="w-10 h-10 rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all hover:scale-110">
                                    <Facebook className="w-5 h-5" />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all hover:scale-110">
                                    <Instagram className="w-5 h-5" />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all hover:scale-110">
                                    <Twitter className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wide">{t('Footer.quickLinks')}</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/" className="text-sm text-muted-foreground hover:text-orange-500 transition-colors flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        {t('Footer.home')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/recipes" className="text-sm text-muted-foreground hover:text-orange-500 transition-colors flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        {t('Footer.recipes')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/regions" className="text-sm text-muted-foreground hover:text-orange-500 transition-colors flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        {t('Footer.regions')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/favorites" className="text-sm text-muted-foreground hover:text-orange-500 transition-colors flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        {t('Footer.favorites')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/meal-plan" className="text-sm text-muted-foreground hover:text-orange-500 transition-colors flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        {t('Footer.mealPlan')}
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Categories */}
                        <div>
                            <h3 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wide">{t('Footer.categories')}</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/recipes?category=appetizer" className="text-sm text-muted-foreground hover:text-orange-500 transition-colors flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        {t('Footer.appetizers')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/recipes?category=main" className="text-sm text-muted-foreground hover:text-orange-500 transition-colors flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        {t('Footer.mainDishes')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/recipes?category=dessert" className="text-sm text-muted-foreground hover:text-orange-500 transition-colors flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        {t('Footer.desserts')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/recipes?category=salad" className="text-sm text-muted-foreground hover:text-orange-500 transition-colors flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        {t('Footer.salads')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/recipes?category=soup" className="text-sm text-muted-foreground hover:text-orange-500 transition-colors flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        {t('Footer.soups')}
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wide">{t('Footer.contact')}</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                    <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                                    <span>Athens, Greece</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                    <Mail className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                                    <a href="mailto:info@greececuisine.com" className="hover:text-orange-500 transition-colors">
                                        info@greececuisine.com
                                    </a>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                    <Phone className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                                    <span>+30 210 123 4567</span>
                                </li>
                            </ul>
                            
                            {/* Newsletter */}
                            <div className="mt-6 p-4 bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-xl border border-orange-500/20">
                                <p className="text-sm font-semibold text-foreground mb-2">{t('Footer.newsletter')}</p>
                                <p className="text-xs text-muted-foreground mb-3">{t('Footer.newsletterDescription')}</p>
                                <div className="flex gap-2">
                                    <input 
                                        type="email" 
                                        placeholder={t('Footer.newsletterPlaceholder')}
                                        className="flex-1 px-3 py-2 text-sm rounded-lg bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                    <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all hover:scale-105">
                                        →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 border-t border-white/40 dark:border-white/10">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-sm text-muted-foreground text-center md:text-left">
                                &copy; {new Date().getFullYear()} {t('Footer.brandTitle')}. {t('Footer.copyright')}
                            </p>
                            <div className="flex gap-6 text-sm text-muted-foreground">
                                <Link href="/privacy" className="hover:text-orange-500 transition-colors">
                                    {t('Footer.privacy')}
                                </Link>
                                <Link href="/terms" className="hover:text-orange-500 transition-colors">
                                    {t('Footer.terms')}
                                </Link>
                                <Link href="/about" className="hover:text-orange-500 transition-colors">
                                    {t('Footer.about')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </GlassPanel>
        </footer>
    );
}
