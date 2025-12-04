"use client";

import { useState, useEffect } from "react";
import { getFooterSettingBySection, updateFooterSetting } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Save, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FooterSettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('brand');
    
    const [brandSettings, setBrandSettings] = useState({
        title: '',
        subtitle: '',
        description: ''
    });
    
    const [socialSettings, setSocialSettings] = useState({
        facebook: '',
        instagram: '',
        twitter: ''
    });
    
    const [contactSettings, setContactSettings] = useState({
        address: '',
        email: '',
        phone: ''
    });
    
    const [newsletterSettings, setNewsletterSettings] = useState({
        title: '',
        description: '',
        placeholder: ''
    });

    const [copyrightSettings, setCopyrightSettings] = useState({
        text: '',
        links: [
            { label: '', href: '' }
        ]
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setLoading(true);
        
        const [brand, social, contact, newsletter, copyright] = await Promise.all([
            getFooterSettingBySection('brand'),
            getFooterSettingBySection('social'),
            getFooterSettingBySection('contact'),
            getFooterSettingBySection('newsletter'),
            getFooterSettingBySection('copyright')
        ]);

        if (brand) setBrandSettings(brand.content);
        if (social) setSocialSettings(social.content);
        if (contact) setContactSettings(contact.content);
        if (newsletter) setNewsletterSettings(newsletter.content);
        if (copyright) setCopyrightSettings(copyright.content);

        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);

        let success = true;
        
        if (activeTab === 'brand') {
            success = await updateFooterSetting('brand', brandSettings);
        } else if (activeTab === 'social') {
            success = await updateFooterSetting('social', socialSettings);
        } else if (activeTab === 'contact') {
            success = await updateFooterSetting('contact', contactSettings);
        } else if (activeTab === 'newsletter') {
            success = await updateFooterSetting('newsletter', newsletterSettings);
        } else if (activeTab === 'copyright') {
            success = await updateFooterSetting('copyright', copyrightSettings);
        }

        setSaving(false);

        if (success) {
            alert('Οι αλλαγές αποθηκεύτηκαν επιτυχώς!');
            router.refresh();
        } else {
            alert('Σφάλμα κατά την αποθήκευση!');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold">Ρυθμίσεις Footer</h1>
                <p className="text-muted-foreground mt-2">
                    Διαχειριστείτε το περιεχόμενο του footer της εφαρμογής
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 flex-wrap">
                {['brand', 'social', 'contact', 'newsletter', 'copyright'].map((tab) => (
                    <Button
                        key={tab}
                        variant={activeTab === tab ? 'default' : 'outline'}
                        onClick={() => setActiveTab(tab)}
                        className="capitalize"
                    >
                        {tab === 'brand' && 'Επωνυμία'}
                        {tab === 'social' && 'Social Media'}
                        {tab === 'contact' && 'Επικοινωνία'}
                        {tab === 'newsletter' && 'Newsletter'}
                        {tab === 'copyright' && 'Copyright'}
                    </Button>
                ))}
            </div>

            <GlassPanel className="p-8">
                {/* Brand Settings */}
                {activeTab === 'brand' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Επωνυμία & Περιγραφή</h2>
                        
                        <div>
                            <Label htmlFor="title">Τίτλος</Label>
                            <Input
                                id="title"
                                value={brandSettings.title}
                                onChange={(e) => setBrandSettings({ ...brandSettings, title: e.target.value })}
                                placeholder="ΕΛΛΑΔΑ ΣΤΟ ΠΙΑΤΟ"
                            />
                        </div>

                        <div>
                            <Label htmlFor="subtitle">Υπότιτλος</Label>
                            <Input
                                id="subtitle"
                                value={brandSettings.subtitle}
                                onChange={(e) => setBrandSettings({ ...brandSettings, subtitle: e.target.value })}
                                placeholder="Ας γευτούμε την παράδοση"
                            />
                        </div>

                        <div>
                            <Label htmlFor="description">Περιγραφή</Label>
                            <Textarea
                                id="description"
                                value={brandSettings.description}
                                onChange={(e) => setBrandSettings({ ...brandSettings, description: e.target.value })}
                                placeholder="Ανακαλύψτε αυθεντικές ελληνικές συνταγές..."
                                rows={4}
                            />
                        </div>
                    </div>
                )}

                {/* Social Settings */}
                {activeTab === 'social' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Social Media Links</h2>
                        
                        <div>
                            <Label htmlFor="facebook">Facebook URL</Label>
                            <Input
                                id="facebook"
                                value={socialSettings.facebook}
                                onChange={(e) => setSocialSettings({ ...socialSettings, facebook: e.target.value })}
                                placeholder="https://facebook.com/your-page"
                            />
                        </div>

                        <div>
                            <Label htmlFor="instagram">Instagram URL</Label>
                            <Input
                                id="instagram"
                                value={socialSettings.instagram}
                                onChange={(e) => setSocialSettings({ ...socialSettings, instagram: e.target.value })}
                                placeholder="https://instagram.com/your-profile"
                            />
                        </div>

                        <div>
                            <Label htmlFor="twitter">Twitter URL</Label>
                            <Input
                                id="twitter"
                                value={socialSettings.twitter}
                                onChange={(e) => setSocialSettings({ ...socialSettings, twitter: e.target.value })}
                                placeholder="https://twitter.com/your-handle"
                            />
                        </div>
                    </div>
                )}

                {/* Contact Settings */}
                {activeTab === 'contact' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Στοιχεία Επικοινωνίας</h2>
                        
                        <div>
                            <Label htmlFor="address">Διεύθυνση</Label>
                            <Input
                                id="address"
                                value={contactSettings.address}
                                onChange={(e) => setContactSettings({ ...contactSettings, address: e.target.value })}
                                placeholder="Αθήνα, Ελλάδα"
                            />
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={contactSettings.email}
                                onChange={(e) => setContactSettings({ ...contactSettings, email: e.target.value })}
                                placeholder="info@elladastopjato.gr"
                            />
                        </div>

                        <div>
                            <Label htmlFor="phone">Τηλέφωνο</Label>
                            <Input
                                id="phone"
                                value={contactSettings.phone}
                                onChange={(e) => setContactSettings({ ...contactSettings, phone: e.target.value })}
                                placeholder="+30 210 123 4567"
                            />
                        </div>
                    </div>
                )}

                {/* Newsletter Settings */}
                {activeTab === 'newsletter' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Newsletter Section</h2>
                        
                        <div>
                            <Label htmlFor="nl-title">Τίτλος</Label>
                            <Input
                                id="nl-title"
                                value={newsletterSettings.title}
                                onChange={(e) => setNewsletterSettings({ ...newsletterSettings, title: e.target.value })}
                                placeholder="Newsletter"
                            />
                        </div>

                        <div>
                            <Label htmlFor="nl-desc">Περιγραφή</Label>
                            <Input
                                id="nl-desc"
                                value={newsletterSettings.description}
                                onChange={(e) => setNewsletterSettings({ ...newsletterSettings, description: e.target.value })}
                                placeholder="Λάβετε νέες συνταγές στο email σας"
                            />
                        </div>

                        <div>
                            <Label htmlFor="nl-placeholder">Placeholder</Label>
                            <Input
                                id="nl-placeholder"
                                value={newsletterSettings.placeholder}
                                onChange={(e) => setNewsletterSettings({ ...newsletterSettings, placeholder: e.target.value })}
                                placeholder="Το email σας"
                            />
                        </div>
                    </div>
                )}

                {/* Copyright Settings */}
                {activeTab === 'copyright' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Copyright & Links</h2>
                        
                        <div>
                            <Label htmlFor="copyright-text">Copyright Text</Label>
                            <Input
                                id="copyright-text"
                                value={copyrightSettings.text}
                                onChange={(e) => setCopyrightSettings({ ...copyrightSettings, text: e.target.value })}
                                placeholder="Με ❤️ από την Ελλάδα"
                            />
                        </div>

                        <div className="space-y-4">
                            <Label>Footer Links</Label>
                            {copyrightSettings.links.map((link, index) => (
                                <div key={index} className="flex gap-4">
                                    <Input
                                        value={link.label}
                                        onChange={(e) => {
                                            const newLinks = [...copyrightSettings.links];
                                            newLinks[index].label = e.target.value;
                                            setCopyrightSettings({ ...copyrightSettings, links: newLinks });
                                        }}
                                        placeholder="Label"
                                    />
                                    <Input
                                        value={link.href}
                                        onChange={(e) => {
                                            const newLinks = [...copyrightSettings.links];
                                            newLinks[index].href = e.target.value;
                                            setCopyrightSettings({ ...copyrightSettings, links: newLinks });
                                        }}
                                        placeholder="/path"
                                    />
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            const newLinks = copyrightSettings.links.filter((_, i) => i !== index);
                                            setCopyrightSettings({ ...copyrightSettings, links: newLinks });
                                        }}
                                    >
                                        Διαγραφή
                                    </Button>
                                </div>
                            ))}
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setCopyrightSettings({
                                        ...copyrightSettings,
                                        links: [...copyrightSettings.links, { label: '', href: '' }]
                                    });
                                }}
                            >
                                + Προσθήκη Link
                            </Button>
                        </div>
                    </div>
                )}

                {/* Save Button */}
                <div className="pt-6 border-t mt-8">
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        size="lg"
                        className="w-full md:w-auto"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Αποθήκευση...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5 mr-2" />
                                Αποθήκευση Αλλαγών
                            </>
                        )}
                    </Button>
                </div>
            </GlassPanel>
        </div>
    );
}
