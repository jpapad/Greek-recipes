"use client";

import { useEffect, useState } from "react";
import { getAllSiteSettings, updateSiteSetting, resetSiteSettingToDefault, applyThemePreset } from "@/lib/api";
import { SiteSetting, ColorSettings, BackgroundSettings, GlassmorphismSettings, TypographySettings, SpacingSettings } from "@/lib/types/site-settings";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, RotateCcw, Palette, Image, Sparkles, Type, Layout as LayoutIcon, Zap, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SiteSettingsPage() {
    const [settings, setSettings] = useState<SiteSetting[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('colors');

    // State for each setting type
    const [colors, setColors] = useState<ColorSettings | null>(null);
    const [backgrounds, setBackgrounds] = useState<BackgroundSettings | null>(null);
    const [glassmorphism, setGlassmorphism] = useState<GlassmorphismSettings | null>(null);
    const [typography, setTypography] = useState<TypographySettings | null>(null);
    const [spacing, setSpacing] = useState<SpacingSettings | null>(null);

    useEffect(() => {
        loadSettings();
    }, []);

    async function loadSettings() {
        setLoading(true);
        const data = await getAllSiteSettings();
        setSettings(data);

        // Parse individual settings
        const colorsSetting = data.find(s => s.setting_key === 'colors');
        const bgSetting = data.find(s => s.setting_key === 'backgrounds');
        const glassSetting = data.find(s => s.setting_key === 'glassmorphism');
        const typographySetting = data.find(s => s.setting_key === 'typography');
        const spacingSetting = data.find(s => s.setting_key === 'spacing');

        if (colorsSetting) setColors(colorsSetting.value as ColorSettings);
        if (bgSetting) setBackgrounds(bgSetting.value as BackgroundSettings);
        if (glassSetting) setGlassmorphism(glassSetting.value as GlassmorphismSettings);
        if (typographySetting) setTypography(typographySetting.value as TypographySettings);
        if (spacingSetting) setSpacing(spacingSetting.value as SpacingSettings);

        setLoading(false);
    }

    async function handleSaveColors() {
        if (!colors) return;
        setSaving(true);
        const success = await updateSiteSetting('colors', colors);
        if (success) {
            alert('Τα χρώματα αποθηκεύτηκαν! Κάντε refresh τη σελίδα για να δείτε τις αλλαγές.');
        }
        setSaving(false);
    }

    async function handleSaveBackgrounds() {
        if (!backgrounds) return;
        setSaving(true);
        const success = await updateSiteSetting('backgrounds', backgrounds);
        if (success) {
            alert('Τα backgrounds αποθηκεύτηκαν! Κάντε refresh τη σελίδα.');
        }
        setSaving(false);
    }

    async function handleSaveGlass() {
        if (!glassmorphism) return;
        setSaving(true);
        const success = await updateSiteSetting('glassmorphism', glassmorphism);
        if (success) {
            alert('Τα glass effects αποθηκεύτηκαν! Κάντε refresh τη σελίδα.');
        }
        setSaving(false);
    }

    async function handleSaveTypography() {
        if (!typography) return;
        setSaving(true);
        const success = await updateSiteSetting('typography', typography);
        if (success) {
            alert('Τα typography settings αποθηκεύτηκαν! Κάντε refresh τη σελίδα.');
        }
        setSaving(false);
    }

    async function handleSaveSpacing() {
        if (!spacing) return;
        setSaving(true);
        const success = await updateSiteSetting('spacing', spacing);
        if (success) {
            alert('Τα spacing settings αποθηκεύτηκαν! Κάντε refresh τη σελίδα.');
        }
        setSaving(false);
    }

    async function handleResetTypography() {
        if (!confirm('Επαναφορά typography στις προεπιλεγμένες τιμές;')) return;
        const success = await resetSiteSettingToDefault('typography');
        if (success) {
            await loadSettings();
            alert('Τα typography settings επαναφέρθηκαν!');
        }
    }

    async function handleResetSpacing() {
        if (!confirm('Επαναφορά spacing στις προεπιλεγμένες τιμές;')) return;
        const success = await resetSiteSettingToDefault('spacing');
        if (success) {
            await loadSettings();
            alert('Τα spacing settings επαναφέρθηκαν!');
        }
    }

    async function handleResetColors() {
        if (!confirm('Επαναφορά χρωμάτων στις προεπιλεγμένες τιμές;')) return;
        const success = await resetSiteSettingToDefault('colors');
        if (success) {
            await loadSettings();
            alert('Τα χρώματα επαναφέρθηκαν!');
        }
    }

    async function handleApplyPreset(preset: string) {
        setSaving(true);
        const success = await applyThemePreset(preset);
        if (success) {
            await loadSettings();
            alert(`Το θέμα "${preset}" εφαρμόστηκε! Κάντε refresh τη σελίδα.`);
        }
        setSaving(false);
    }

    if (loading) {
        return <div className="p-8 text-center">Φόρτωση...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-bold mb-2">🎨 Site Design Settings</h1>
                <p className="text-muted-foreground">
                    Προσαρμόστε την εμφάνιση του site (χρώματα, backgrounds, typography, κλπ)
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
                    <TabsTrigger value="colors" className="gap-2">
                        <Palette className="w-4 h-4" />
                        Χρώματα
                    </TabsTrigger>
                    <TabsTrigger value="backgrounds" className="gap-2">
                        <Image className="w-4 h-4" />
                        Backgrounds
                    </TabsTrigger>
                    <TabsTrigger value="glass" className="gap-2">
                        <Sparkles className="w-4 h-4" />
                        Glass Effects
                    </TabsTrigger>
                    <TabsTrigger value="typography" className="gap-2">
                        <Type className="w-4 h-4" />
                        Typography
                    </TabsTrigger>
                    <TabsTrigger value="spacing" className="gap-2">
                        <LayoutIcon className="w-4 h-4" />
                        Spacing
                    </TabsTrigger>
                    <TabsTrigger value="presets" className="gap-2">
                        <Zap className="w-4 h-4" />
                        Presets
                    </TabsTrigger>
                </TabsList>

                {/* COLORS TAB */}
                <TabsContent value="colors">
                    <GlassPanel className="p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Χρώματα Site</h2>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={handleResetColors}>
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Reset
                                </Button>
                                <Button onClick={handleSaveColors} disabled={saving}>
                                    <Save className="w-4 h-4 mr-2" />
                                    {saving ? 'Αποθήκευση...' : 'Αποθήκευση'}
                                </Button>
                            </div>
                        </div>

                        {colors && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {Object.entries(colors).map(([key, value]) => (
                                    <div key={key} className="space-y-2">
                                        <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                                        <div className="flex gap-2 items-center">
                                            <input
                                                type="color"
                                                value={value}
                                                onChange={(e) => setColors({ ...colors, [key]: e.target.value })}
                                                className="w-12 h-12 rounded border-2 border-border cursor-pointer"
                                            />
                                            <Input
                                                value={value}
                                                onChange={(e) => setColors({ ...colors, [key]: e.target.value })}
                                                className="font-mono text-sm"
                                            />
                                        </div>
                                        <div
                                            className="h-8 rounded border border-border"
                                            style={{ backgroundColor: value }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </GlassPanel>
                </TabsContent>

                {/* BACKGROUNDS TAB */}
                <TabsContent value="backgrounds">
                    <GlassPanel className="p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Background Settings</h2>
                            <Button onClick={handleSaveBackgrounds} disabled={saving}>
                                <Save className="w-4 h-4 mr-2" />
                                Αποθήκευση
                            </Button>
                        </div>

                        {backgrounds && (
                            <div className="space-y-6">
                                <div>
                                    <Label>Background Mode</Label>
                                    <div className="grid grid-cols-4 gap-3 mt-2">
                                        {['solid', 'gradient', 'image', 'pattern'].map((mode) => (
                                            <button
                                                key={mode}
                                                type="button"
                                                onClick={() => setBackgrounds({ ...backgrounds, mode: mode as any })}
                                                className={`
                                                    p-4 rounded-lg border-2 capitalize
                                                    ${backgrounds.mode === mode
                                                        ? 'border-primary bg-primary/10'
                                                        : 'border-border hover:border-primary/50'
                                                    }
                                                `}
                                            >
                                                {mode}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {backgrounds.mode === 'solid' && (
                                    <div>
                                        <Label>Solid Color</Label>
                                        <div className="flex gap-2 mt-2">
                                            <input
                                                type="color"
                                                value={backgrounds.solidColor}
                                                onChange={(e) => setBackgrounds({ ...backgrounds, solidColor: e.target.value })}
                                                className="w-12 h-12 rounded border-2"
                                            />
                                            <Input
                                                value={backgrounds.solidColor}
                                                onChange={(e) => setBackgrounds({ ...backgrounds, solidColor: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                )}

                                {backgrounds.mode === 'gradient' && backgrounds.gradient && (
                                    <div className="space-y-4">
                                        <div>
                                            <Label>Gradient Type</Label>
                                            <select
                                                value={backgrounds.gradient.type}
                                                onChange={(e) => setBackgrounds({
                                                    ...backgrounds,
                                                    gradient: { ...backgrounds.gradient!, type: e.target.value as any }
                                                })}
                                                className="w-full p-2 rounded-lg border bg-background mt-2"
                                            >
                                                <option value="linear">Linear</option>
                                                <option value="radial">Radial</option>
                                                <option value="conic">Conic</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <Label>From</Label>
                                                <Input
                                                    value={backgrounds.gradient.from}
                                                    onChange={(e) => setBackgrounds({
                                                        ...backgrounds,
                                                        gradient: { ...backgrounds.gradient!, from: e.target.value }
                                                    })}
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div>
                                                <Label>Via (optional)</Label>
                                                <Input
                                                    value={backgrounds.gradient.via || ''}
                                                    onChange={(e) => setBackgrounds({
                                                        ...backgrounds,
                                                        gradient: { ...backgrounds.gradient!, via: e.target.value }
                                                    })}
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div>
                                                <Label>To</Label>
                                                <Input
                                                    value={backgrounds.gradient.to}
                                                    onChange={(e) => setBackgrounds({
                                                        ...backgrounds,
                                                        gradient: { ...backgrounds.gradient!, to: e.target.value }
                                                    })}
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </GlassPanel>
                </TabsContent>

                {/* GLASS EFFECTS TAB */}
                <TabsContent value="glass">
                    <GlassPanel className="p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Glassmorphism Effects</h2>
                            <Button onClick={handleSaveGlass} disabled={saving}>
                                <Save className="w-4 h-4 mr-2" />
                                Αποθήκευση
                            </Button>
                        </div>

                        {glassmorphism && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={glassmorphism.enabled}
                                        onChange={(e) => setGlassmorphism({ ...glassmorphism, enabled: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    <Label>Ενεργοποίηση Glass Effects</Label>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <Label>Blur Amount: {glassmorphism.blur}</Label>
                                        <Input
                                            value={glassmorphism.blur}
                                            onChange={(e) => setGlassmorphism({ ...glassmorphism, blur: e.target.value })}
                                            placeholder="24px"
                                            className="mt-2"
                                        />
                                    </div>

                                    <div>
                                        <Label>Opacity: {glassmorphism.opacity}</Label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={glassmorphism.opacity}
                                            onChange={(e) => setGlassmorphism({ ...glassmorphism, opacity: parseFloat(e.target.value) })}
                                            className="w-full mt-2"
                                        />
                                    </div>

                                    <div>
                                        <Label>Border Opacity: {glassmorphism.borderOpacity}</Label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={glassmorphism.borderOpacity}
                                            onChange={(e) => setGlassmorphism({ ...glassmorphism, borderOpacity: parseFloat(e.target.value) })}
                                            className="w-full mt-2"
                                        />
                                    </div>

                                    <div>
                                        <Label>Shadow Intensity</Label>
                                        <select
                                            value={glassmorphism.shadowIntensity}
                                            onChange={(e) => setGlassmorphism({ ...glassmorphism, shadowIntensity: e.target.value as any })}
                                            className="w-full p-2 rounded-lg border bg-background mt-2"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Preview */}
                                <div className="mt-8">
                                    <Label>Preview</Label>
                                    <div 
                                        className="mt-4 p-8 rounded-lg border"
                                        style={{
                                            backdropFilter: `blur(${glassmorphism.blur})`,
                                            backgroundColor: `rgba(255, 255, 255, ${glassmorphism.opacity * 0.1})`,
                                            borderColor: `rgba(255, 255, 255, ${glassmorphism.borderOpacity})`
                                        }}
                                    >
                                        <h3 className="text-xl font-bold mb-2">Glass Panel Preview</h3>
                                        <p className="text-muted-foreground">Αυτό είναι ένα preview του glass effect.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </GlassPanel>
                </TabsContent>

                {/* PRESETS TAB */}
                <TabsContent value="presets">
                    <GlassPanel className="p-8 space-y-6">
                        <h2 className="text-2xl font-bold">Theme Presets</h2>
                        <p className="text-muted-foreground">Επιλέξτε ένα προκαθορισμένο θέμα</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {['dark', 'light', 'ocean', 'sunset', 'forest'].map((preset) => (
                                <button
                                    key={preset}
                                    onClick={() => handleApplyPreset(preset)}
                                    className="p-6 rounded-lg border-2 border-border hover:border-primary transition-all text-left group"
                                >
                                    <h3 className="text-xl font-bold capitalize mb-2 group-hover:text-primary">{preset}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        {preset === 'dark' && 'Σκούρο θέμα με μπλε απόχρωση'}
                                        {preset === 'light' && 'Φωτεινό θέμα'}
                                        {preset === 'ocean' && 'Θέμα με γαλάζιες αποχρώσεις'}
                                        {preset === 'sunset' && 'Θερμά πορτοκαλί χρώματα'}
                                        {preset === 'forest' && 'Πράσινες φυσικές αποχρώσεις'}
                                    </p>
                                    <Button size="sm" className="w-full">
                                        Εφαρμογή
                                    </Button>
                                </button>
                            ))}
                        </div>
                    </GlassPanel>
                </TabsContent>

                {/* TYPOGRAPHY TAB */}
                <TabsContent value="typography">
                    <GlassPanel className="p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Typography Settings</h2>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={handleResetTypography}>
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Reset
                                </Button>
                                <Button onClick={handleSaveTypography} disabled={saving}>
                                    <Save className="w-4 h-4 mr-2" />
                                    {saving ? 'Αποθήκευση...' : 'Αποθήκευση'}
                                </Button>
                            </div>
                        </div>

                        {typography && (
                            <div className="space-y-8">
                                {/* Font Family */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Font Family</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Sans-Serif Font</Label>
                                            <select
                                                value={typography.fontFamily.sans}
                                                onChange={(e) => setTypography({ 
                                                    ...typography, 
                                                    fontFamily: { ...typography.fontFamily, sans: e.target.value }
                                                })}
                                                className="w-full p-3 rounded-lg border bg-background mt-2"
                                            >
                                                <option value="Inter, sans-serif">Inter (Default)</option>
                                                <option value="Arial, sans-serif">Arial</option>
                                                <option value="'Roboto', sans-serif">Roboto</option>
                                                <option value="'Open Sans', sans-serif">Open Sans</option>
                                                <option value="'Lato', sans-serif">Lato</option>
                                                <option value="'Montserrat', sans-serif">Montserrat</option>
                                            </select>
                                        </div>
                                        <div>
                                            <Label>Heading Font</Label>
                                            <select
                                                value={typography.fontFamily.heading}
                                                onChange={(e) => setTypography({ 
                                                    ...typography, 
                                                    fontFamily: { ...typography.fontFamily, heading: e.target.value }
                                                })}
                                                className="w-full p-3 rounded-lg border bg-background mt-2"
                                            >
                                                <option value="Inter, sans-serif">Inter (Default)</option>
                                                <option value="Georgia, serif">Georgia</option>
                                                <option value="'Times New Roman', serif">Times New Roman</option>
                                                <option value="'Playfair Display', serif">Playfair Display</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Font Sizes */}
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-semibold mb-4">Font Sizes</h3>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {Object.entries(typography.fontSize).map(([key, value]) => (
                                            <div key={key}>
                                                <Label className="capitalize">{key}</Label>
                                                <Input
                                                    type="text"
                                                    value={value}
                                                    onChange={(e) => setTypography({
                                                        ...typography,
                                                        fontSize: { ...typography.fontSize, [key]: e.target.value }
                                                    })}
                                                    className="mt-2"
                                                    placeholder="e.g., 1rem, 16px"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Font Weights */}
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-semibold mb-4">Font Weights</h3>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {Object.entries(typography.fontWeight).map(([key, value]) => (
                                            <div key={key}>
                                                <Label className="capitalize">{key}</Label>
                                                <select
                                                    value={value}
                                                    onChange={(e) => setTypography({
                                                        ...typography,
                                                        fontWeight: { ...typography.fontWeight, [key]: parseInt(e.target.value) }
                                                    })}
                                                    className="w-full p-3 rounded-lg border bg-background mt-2"
                                                >
                                                    <option value="300">Light (300)</option>
                                                    <option value="400">Normal (400)</option>
                                                    <option value="500">Medium (500)</option>
                                                    <option value="600">Semibold (600)</option>
                                                    <option value="700">Bold (700)</option>
                                                    <option value="800">Extrabold (800)</option>
                                                </select>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Line Heights */}
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-semibold mb-4">Line Heights</h3>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        {Object.entries(typography.lineHeight).map(([key, value]) => (
                                            <div key={key}>
                                                <Label className="capitalize">{key}: {value}</Label>
                                                <input
                                                    type="range"
                                                    min="1"
                                                    max="2.5"
                                                    step="0.05"
                                                    value={value}
                                                    onChange={(e) => setTypography({
                                                        ...typography,
                                                        lineHeight: { ...typography.lineHeight, [key]: parseFloat(e.target.value) }
                                                    })}
                                                    className="w-full mt-2"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </GlassPanel>
                </TabsContent>

                <TabsContent value="spacing">
                    <GlassPanel className="p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Spacing & Layout</h2>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={handleResetSpacing}>
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Reset
                                </Button>
                                <Button onClick={handleSaveSpacing} disabled={saving}>
                                    <Save className="w-4 h-4 mr-2" />
                                    {saving ? 'Αποθήκευση...' : 'Αποθήκευση'}
                                </Button>
                            </div>
                        </div>

                        {spacing && (
                            <div className="space-y-8">
                                {/* Container */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Container Settings</h3>
                                    <Label>Max Width</Label>
                                    <select
                                        value={spacing.containerMaxWidth}
                                        onChange={(e) => setSpacing({ ...spacing, containerMaxWidth: e.target.value })}
                                        className="w-full p-3 rounded-lg border bg-background mt-2"
                                    >
                                        <option value="1280px">1280px (Default)</option>
                                        <option value="1024px">1024px (Compact)</option>
                                        <option value="1536px">1536px (Wide)</option>
                                        <option value="1920px">1920px (Extra Wide)</option>
                                        <option value="100%">100% (Full Width)</option>
                                    </select>
                                </div>

                                {/* Section Padding */}
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-semibold mb-4">Section Padding</h3>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div>
                                            <Label>Small</Label>
                                            <Input
                                                value={spacing.sectionPadding.sm}
                                                onChange={(e) => setSpacing({ 
                                                    ...spacing, 
                                                    sectionPadding: { ...spacing.sectionPadding, sm: e.target.value }
                                                })}
                                                className="mt-2"
                                                placeholder="e.g., 2rem"
                                            />
                                        </div>
                                        <div>
                                            <Label>Medium</Label>
                                            <Input
                                                value={spacing.sectionPadding.md}
                                                onChange={(e) => setSpacing({ 
                                                    ...spacing, 
                                                    sectionPadding: { ...spacing.sectionPadding, md: e.target.value }
                                                })}
                                                className="mt-2"
                                                placeholder="e.g., 4rem"
                                            />
                                        </div>
                                        <div>
                                            <Label>Large</Label>
                                            <Input
                                                value={spacing.sectionPadding.lg}
                                                onChange={(e) => setSpacing({ 
                                                    ...spacing, 
                                                    sectionPadding: { ...spacing.sectionPadding, lg: e.target.value }
                                                })}
                                                className="mt-2"
                                                placeholder="e.g., 6rem"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Card Padding */}
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-semibold mb-4">Card Padding</h3>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div>
                                            <Label>Small</Label>
                                            <Input
                                                value={spacing.cardPadding.sm}
                                                onChange={(e) => setSpacing({ 
                                                    ...spacing, 
                                                    cardPadding: { ...spacing.cardPadding, sm: e.target.value }
                                                })}
                                                className="mt-2"
                                                placeholder="e.g., 1rem"
                                            />
                                        </div>
                                        <div>
                                            <Label>Medium</Label>
                                            <Input
                                                value={spacing.cardPadding.md}
                                                onChange={(e) => setSpacing({ 
                                                    ...spacing, 
                                                    cardPadding: { ...spacing.cardPadding, md: e.target.value }
                                                })}
                                                className="mt-2"
                                                placeholder="e.g., 1.5rem"
                                            />
                                        </div>
                                        <div>
                                            <Label>Large</Label>
                                            <Input
                                                value={spacing.cardPadding.lg}
                                                onChange={(e) => setSpacing({ 
                                                    ...spacing, 
                                                    cardPadding: { ...spacing.cardPadding, lg: e.target.value }
                                                })}
                                                className="mt-2"
                                                placeholder="e.g., 2rem"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Border Radius */}
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-semibold mb-4">Border Radius</h3>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {Object.entries(spacing.borderRadius).map(([key, value]) => (
                                            <div key={key}>
                                                <Label className="capitalize">{key}</Label>
                                                <Input
                                                    type="text"
                                                    value={value}
                                                    onChange={(e) => setSpacing({
                                                        ...spacing,
                                                        borderRadius: { ...spacing.borderRadius, [key]: e.target.value }
                                                    })}
                                                    className="mt-2"
                                                    placeholder="e.g., 0.5rem, 8px"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Gap Sizes */}
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-semibold mb-4">Gap Sizes (Grid/Flex)</h3>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        {Object.entries(spacing.gap).map(([key, value]) => (
                                            <div key={key}>
                                                <Label className="capitalize">{key}</Label>
                                                <Input
                                                    type="text"
                                                    value={value}
                                                    onChange={(e) => setSpacing({
                                                        ...spacing,
                                                        gap: { ...spacing.gap, [key]: e.target.value }
                                                    })}
                                                    className="mt-2"
                                                    placeholder="e.g., 1rem, 16px"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </GlassPanel>
                </TabsContent>
            </Tabs>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                <p className="text-sm">
                    ⚠️ <strong>Σημείωση:</strong> Μετά την αποθήκευση αλλαγών, κάντε <strong>hard refresh</strong> (Ctrl+Shift+R) για να δείτε τις αλλαγές.
                </p>
            </div>
        </div>
    );
}
