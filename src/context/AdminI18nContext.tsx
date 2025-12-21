"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";

type AdminLocale = "el" | "en";

interface AdminI18nContext {
    locale: AdminLocale;
    setLocale: (locale: AdminLocale) => void;
    t: (key: string) => string;
}

const AdminI18nContext = createContext<AdminI18nContext | undefined>(undefined);

const ADMIN_LOCALE_COOKIE = "admin_locale";

// Admin translations
const translations: Record<AdminLocale, Record<string, string>> = {
    el: {
        // Sidebar
        "sidebar.dashboard": "Πίνακας Ελέγχου",
        "sidebar.recipes": "Συνταγές",
        "sidebar.regions": "Περιφέρειες",
        "sidebar.prefectures": "Νομοί",
        "sidebar.cities": "Πόλεις",
        "sidebar.media": "Μέσα",
        "sidebar.settings": "Ρυθμίσεις",
        "sidebar.users": "Χρήστες",
        "sidebar.audit": "Αρχείο Ενεργειών",
        
        // Topbar
        "topbar.search": "Αναζήτηση...",
        "topbar.notifications": "Ειδοποιήσεις",
        "topbar.profile": "Προφίλ",
        "topbar.logout": "Αποσύνδεση",
        "topbar.backToSite": "Πίσω στην Ιστοσελίδα",
        
        // Common
        "common.loading": "Φόρτωση...",
        "common.save": "Αποθήκευση",
        "common.cancel": "Ακύρωση",
        "common.delete": "Διαγραφή",
        "common.edit": "Επεξεργασία",
        "common.create": "Δημιουργία",
        "common.search": "Αναζήτηση",
        "common.filter": "Φίλτρο",
        "common.actions": "Ενέργειες",
        "common.status": "Κατάσταση",
        "common.createdAt": "Δημιουργήθηκε",
        "common.updatedAt": "Ενημερώθηκε",
        
        // Dashboard
        "dashboard.title": "Πίνακας Ελέγχου",
        "dashboard.totalRecipes": "Συνολικές Συνταγές",
        "dashboard.totalRegions": "Συνολικές Περιφέρειες",
        "dashboard.totalPrefectures": "Συνολικοί Νομοί",
        "dashboard.totalCities": "Συνολικές Πόλεις",
        "dashboard.recentRecipes": "Πρόσφατες Συνταγές",
        "dashboard.quickActions": "Γρήγορες Ενέργειες",
        "dashboard.addRecipe": "Προσθήκη Συνταγής",
        "dashboard.addRegion": "Προσθήκη Περιφέρειας",
        
        // Recipes
        "recipes.title": "Συνταγές",
        "recipes.createNew": "Νέα Συνταγή",
        "recipes.editRecipe": "Επεξεργασία Συνταγής",
        "recipes.deleteRecipe": "Διαγραφή Συνταγής",
        "recipes.recipeName": "Όνομα Συνταγής",
        "recipes.description": "Περιγραφή",
        "recipes.ingredients": "Υλικά",
        "recipes.steps": "Βήματα",
        "recipes.category": "Κατηγορία",
        "recipes.region": "Περιφέρεια",
        "recipes.image": "Εικόνα",
        
        // Users
        "users.title": "Διαχείριση Χρηστών",
        "users.email": "Email",
        "users.isAdmin": "Διαχειριστής",
        "users.makeAdmin": "Ορισμός Διαχειριστή",
        "users.removeAdmin": "Αφαίρεση Διαχειριστή",
    },
    en: {
        // Sidebar
        "sidebar.dashboard": "Dashboard",
        "sidebar.recipes": "Recipes",
        "sidebar.regions": "Regions",
        "sidebar.prefectures": "Prefectures",
        "sidebar.cities": "Cities",
        "sidebar.media": "Media",
        "sidebar.settings": "Settings",
        "sidebar.users": "Users",
        "sidebar.audit": "Audit Log",
        
        // Topbar
        "topbar.search": "Search...",
        "topbar.notifications": "Notifications",
        "topbar.profile": "Profile",
        "topbar.logout": "Logout",
        "topbar.backToSite": "Back to Site",
        
        // Common
        "common.loading": "Loading...",
        "common.save": "Save",
        "common.cancel": "Cancel",
        "common.delete": "Delete",
        "common.edit": "Edit",
        "common.create": "Create",
        "common.search": "Search",
        "common.filter": "Filter",
        "common.actions": "Actions",
        "common.status": "Status",
        "common.createdAt": "Created",
        "common.updatedAt": "Updated",
        
        // Dashboard
        "dashboard.title": "Dashboard",
        "dashboard.totalRecipes": "Total Recipes",
        "dashboard.totalRegions": "Total Regions",
        "dashboard.totalPrefectures": "Total Prefectures",
        "dashboard.totalCities": "Total Cities",
        "dashboard.recentRecipes": "Recent Recipes",
        "dashboard.quickActions": "Quick Actions",
        "dashboard.addRecipe": "Add Recipe",
        "dashboard.addRegion": "Add Region",
        
        // Recipes
        "recipes.title": "Recipes",
        "recipes.createNew": "New Recipe",
        "recipes.editRecipe": "Edit Recipe",
        "recipes.deleteRecipe": "Delete Recipe",
        "recipes.recipeName": "Recipe Name",
        "recipes.description": "Description",
        "recipes.ingredients": "Ingredients",
        "recipes.steps": "Steps",
        "recipes.category": "Category",
        "recipes.region": "Region",
        "recipes.image": "Image",
        
        // Users
        "users.title": "User Management",
        "users.email": "Email",
        "users.isAdmin": "Administrator",
        "users.makeAdmin": "Make Admin",
        "users.removeAdmin": "Remove Admin",
    },
};

export function AdminI18nProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<AdminLocale>("el");
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const savedLocale = Cookies.get(ADMIN_LOCALE_COOKIE) as AdminLocale;
        if (savedLocale && (savedLocale === "el" || savedLocale === "en")) {
            setLocaleState(savedLocale);
        }
    }, []);

    const setLocale = (newLocale: AdminLocale) => {
        setLocaleState(newLocale);
        Cookies.set(ADMIN_LOCALE_COOKIE, newLocale, { expires: 365 });
        router.refresh();
    };

    const t = (key: string): string => {
        return translations[locale][key] || key;
    };

    return (
        <AdminI18nContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </AdminI18nContext.Provider>
    );
}

export function useAdminI18n() {
    const context = useContext(AdminI18nContext);
    if (!context) {
        throw new Error("useAdminI18n must be used within AdminI18nProvider");
    }
    return context;
}
