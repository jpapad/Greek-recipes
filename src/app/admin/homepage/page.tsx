"use client";

import { useState, useEffect } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getHomepageSettingBySection, updateHomepageSetting } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save } from "lucide-react";
import type { StatsContent, CategoriesContent, NewsletterContent, StatItem, CategoryItem } from "@/lib/types/homepage";

export default function HomepageSettingsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'stats' | 'categories' | 'newsletter'>('stats');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Stats settings
    const [statsSettings, setStatsSettings] = useState<StatsContent>({
        title: '',
        subtitle: '',
        stats: []
    });

    // Categories settings
    const [categoriesSettings, setCategoriesSettings] = useState<CategoriesContent>({
        title: '',
        subtitle: '',
        categories: []
    });

    // Newsletter settings
    const [newsletterSettings, setNewsletterSettings] = useState<NewsletterContent>({
        badge: '',
        title: '',
        subtitle: '',
        placeholder: '',
        buttonText: '',
        privacyText: ''
    });

    async function loadSettings() {
        setLoading(true);
        
        const [stats, categories, newsletter] = await Promise.all([
            getHomepageSettingBySection('stats'),
            getHomepageSettingBySection('categories'),
            getHomepageSettingBySection('newsletter')
        ]);

        if (stats?.content) setStatsSettings(stats.content);
        if (categories?.content) setCategoriesSettings(categories.content);
        if (newsletter?.content) setNewsletterSettings(newsletter.content);

        setLoading(false);
    }

    useEffect(() => {
        loadSettings();
    }, []);

    async function handleSave() {
        setSaving(true);
        let success = false;

        if (activeTab === 'stats') {
            success = await updateHomepageSetting('stats', statsSettings);
        } else if (activeTab === 'categories') {
            success = await updateHomepageSetting('categories', categoriesSettings);
        } else if (activeTab === 'newsletter') {
            success = await updateHomepageSetting('newsletter', newsletterSettings);
        }

        if (success) {
            alert('Οι αλλαγές αποθηκεύτηκαν επιτυχώς!');
            router.refresh();
        } else {
            alert('Προέκυψε σφάλμα κατά την αποθήκευση.');
        }

        setSaving(false);
    }

    // Stats handlers
    function addStat() {
        setStatsSettings(prev => ({
            ...prev,
            stats: [...prev.stats, { label: '', value: '', icon: 'ChefHat', color: 'from-orange-500 to-pink-500' }]
        }));
    }

    function removeStat(index: number) {
        setStatsSettings(prev => ({
            ...prev,
            stats: prev.stats.filter((_, i) => i !== index)
        }));
    }

    function updateStat(index: number, field: keyof StatItem, value: string) {
        setStatsSettings(prev => ({
            ...prev,
            stats: prev.stats.map((stat, i) => i === index ? { ...stat, [field]: value } : stat)
        }));
    }

    // Categories handlers
    function addCategory() {
        setCategoriesSettings(prev => ({
            ...prev,
            categories: [...prev.categories, { 
                name: '', 
                slug: '', 
                icon: 'Utensils', 
                color: 'from-orange-500 to-pink-500',
                description: ''
            }]
        }));
    }

    function removeCategory(index: number) {
        setCategoriesSettings(prev => ({
            ...prev,
            categories: prev.categories.filter((_, i) => i !== index)
        }));
    }

    function updateCategory(index: number, field: keyof CategoryItem, value: string) {
        setCategoriesSettings(prev => ({
            ...prev,
            categories: prev.categories.map((cat, i) => i === index ? { ...cat, [field]: value } : cat)
        }));
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold mb-2">Ρυθμίσεις Αρχικής Σελίδας</h1>
                <p className="text-muted-foreground">Διαχειριστείτε τα sections της αρχικής σελίδας</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-border">
                <button
                    onClick={() => setActiveTab('stats')}
                    className={`px-6 py-3 font-medium transition-colors ${
                        activeTab === 'stats'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    Stats Section
                </button>
                <button
                    onClick={() => setActiveTab('categories')}
                    className={`px-6 py-3 font-medium transition-colors ${
                        activeTab === 'categories'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    Categories Section
                </button>
                <button
                    onClick={() => setActiveTab('newsletter')}
                    className={`px-6 py-3 font-medium transition-colors ${
                        activeTab === 'newsletter'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    Newsletter Section
                </button>
            </div>

            {/* Stats Tab */}
            {activeTab === 'stats' && (
                <GlassPanel className="p-8 space-y-6">
                    <h2 className="text-2xl font-bold">Stats Section</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <Label>Τίτλος</Label>
                            <Input
                                value={statsSettings.title}
                                onChange={(e) => setStatsSettings(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Τα Νούμερά μας"
                            />
                        </div>

                        <div>
                            <Label>Υπότιτλος</Label>
                            <Input
                                value={statsSettings.subtitle}
                                onChange={(e) => setStatsSettings(prev => ({ ...prev, subtitle: e.target.value }))}
                                placeholder="Η ελληνική κουζίνα σε αριθμούς"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Στατιστικά</Label>
                                <Button onClick={addStat} size="sm" variant="outline">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Προσθήκη
                                </Button>
                            </div>

                            {statsSettings.stats.map((stat, index) => (
                                <GlassPanel key={index} className="p-4 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-semibold">Stat {index + 1}</h4>
                                        <Button onClick={() => removeStat(index)} size="sm" variant="destructive">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Label</Label>
                                            <Input
                                                value={stat.label}
                                                onChange={(e) => updateStat(index, 'label', e.target.value)}
                                                placeholder="Αυθεντικές Συνταγές"
                                            />
                                        </div>
                                        <div>
                                            <Label>Τιμή</Label>
                                            <Input
                                                value={stat.value}
                                                onChange={(e) => updateStat(index, 'value', e.target.value)}
                                                placeholder="150+"
                                            />
                                        </div>
                                        <div>
                                            <Label>Icon (ChefHat, MapPin, Star)</Label>
                                            <Input
                                                value={stat.icon}
                                                onChange={(e) => updateStat(index, 'icon', e.target.value)}
                                                placeholder="ChefHat"
                                            />
                                        </div>
                                        <div>
                                            <Label>Gradient Color</Label>
                                            <Input
                                                value={stat.color}
                                                onChange={(e) => updateStat(index, 'color', e.target.value)}
                                                placeholder="from-orange-500 to-pink-500"
                                            />
                                        </div>
                                    </div>
                                </GlassPanel>
                            ))}
                        </div>
                    </div>
                </GlassPanel>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
                <GlassPanel className="p-8 space-y-6">
                    <h2 className="text-2xl font-bold">Categories Section</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <Label>Τίτλος</Label>
                            <Input
                                value={categoriesSettings.title}
                                onChange={(e) => setCategoriesSettings(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Κατηγορίες Φαγητού"
                            />
                        </div>

                        <div>
                            <Label>Υπότιτλος</Label>
                            <Input
                                value={categoriesSettings.subtitle}
                                onChange={(e) => setCategoriesSettings(prev => ({ ...prev, subtitle: e.target.value }))}
                                placeholder="Εξερευνήστε την ελληνική κουζίνα ανά κατηγορία"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Κατηγορίες</Label>
                                <Button onClick={addCategory} size="sm" variant="outline">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Προσθήκη
                                </Button>
                            </div>

                            {categoriesSettings.categories.map((category, index) => (
                                <GlassPanel key={index} className="p-4 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-semibold">{category.name || `Κατηγορία ${index + 1}`}</h4>
                                        <Button onClick={() => removeCategory(index)} size="sm" variant="destructive">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Όνομα</Label>
                                            <Input
                                                value={category.name}
                                                onChange={(e) => updateCategory(index, 'name', e.target.value)}
                                                placeholder="Ορεκτικά"
                                            />
                                        </div>
                                        <div>
                                            <Label>Slug</Label>
                                            <Input
                                                value={category.slug}
                                                onChange={(e) => updateCategory(index, 'slug', e.target.value)}
                                                placeholder="appetizer"
                                            />
                                        </div>
                                        <div>
                                            <Label>Icon</Label>
                                            <Input
                                                value={category.icon}
                                                onChange={(e) => updateCategory(index, 'icon', e.target.value)}
                                                placeholder="Salad"
                                            />
                                        </div>
                                        <div>
                                            <Label>Gradient Color</Label>
                                            <Input
                                                value={category.color}
                                                onChange={(e) => updateCategory(index, 'color', e.target.value)}
                                                placeholder="from-green-500 to-emerald-500"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <Label>Περιγραφή</Label>
                                            <Textarea
                                                value={category.description}
                                                onChange={(e) => updateCategory(index, 'description', e.target.value)}
                                                placeholder="Νόστιμα ορεκτικά για κάθε περίσταση"
                                                rows={2}
                                            />
                                        </div>
                                    </div>
                                </GlassPanel>
                            ))}
                        </div>
                    </div>
                </GlassPanel>
            )}

            {/* Newsletter Tab */}
            {activeTab === 'newsletter' && (
                <GlassPanel className="p-8 space-y-6">
                    <h2 className="text-2xl font-bold">Newsletter Section</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <Label>Badge Text</Label>
                            <Input
                                value={newsletterSettings.badge}
                                onChange={(e) => setNewsletterSettings(prev => ({ ...prev, badge: e.target.value }))}
                                placeholder="Newsletter"
                            />
                        </div>

                        <div>
                            <Label>Τίτλος</Label>
                            <Textarea
                                value={newsletterSettings.title}
                                onChange={(e) => setNewsletterSettings(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Λάβετε τις καλύτερες συνταγές στο inbox σας"
                                rows={2}
                            />
                        </div>

                        <div>
                            <Label>Υπότιτλος</Label>
                            <Textarea
                                value={newsletterSettings.subtitle}
                                onChange={(e) => setNewsletterSettings(prev => ({ ...prev, subtitle: e.target.value }))}
                                placeholder="Κάθε εβδομάδα μοιραζόμαστε νέες αυθεντικές ελληνικές συνταγές..."
                                rows={3}
                            />
                        </div>

                        <div>
                            <Label>Email Placeholder</Label>
                            <Input
                                value={newsletterSettings.placeholder}
                                onChange={(e) => setNewsletterSettings(prev => ({ ...prev, placeholder: e.target.value }))}
                                placeholder="Το email σας..."
                            />
                        </div>

                        <div>
                            <Label>Κείμενο Κουμπιού</Label>
                            <Input
                                value={newsletterSettings.buttonText}
                                onChange={(e) => setNewsletterSettings(prev => ({ ...prev, buttonText: e.target.value }))}
                                placeholder="Εγγραφή"
                            />
                        </div>

                        <div>
                            <Label>Privacy Text</Label>
                            <Input
                                value={newsletterSettings.privacyText}
                                onChange={(e) => setNewsletterSettings(prev => ({ ...prev, privacyText: e.target.value }))}
                                placeholder="🔒 Δεν θα μοιραστούμε ποτέ το email σας με τρίτους"
                            />
                        </div>
                    </div>
                </GlassPanel>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
                <Button 
                    onClick={handleSave} 
                    disabled={saving}
                    size="lg"
                    className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                >
                    {saving ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                            Αποθήκευση...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Αποθήκευση Αλλαγών
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
