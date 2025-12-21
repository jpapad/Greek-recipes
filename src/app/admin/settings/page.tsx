import { requireAdminServer } from "@/lib/adminServerGuard";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const metadata = {
    title: "Settings | Admin Dashboard",
    description: "Configure site-wide settings",
};

export default async function AdminSettingsPage() {
    const { user } = await requireAdminServer();
    const supabase = await getSupabaseServerClient();

    // Try to fetch site settings
    const { data: settings, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Site Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Configure global site parameters
                </p>
            </div>

            <GlassPanel>
                {error ? (
                    <div className="text-center py-12">
                        <p className="text-amber-600 dark:text-amber-400 mb-4">
                            Site settings table not configured yet
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Run the SQL migration to create the <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">site_settings</code> table
                        </p>
                        <div className="mt-6 text-left bg-gray-50 dark:bg-gray-800 p-4 rounded-lg max-w-2xl mx-auto">
                            <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-x-auto">
{`-- Run in Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Initial settings
INSERT INTO site_settings (key, value, description) VALUES
('site_name', '"Greek Recipes"', 'Site title'),
('site_description', '"Authentic Greek Recipes"', 'Site description'),
('maintenance_mode', 'false', 'Enable maintenance mode'),
('allow_registration', 'true', 'Allow new user registration'),
('contact_email', '"info@greekrecipes.com"', 'Contact email'),
('max_upload_size_mb', '10', 'Maximum file upload size')
ON CONFLICT (key) DO NOTHING;

-- RLS Policies
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view settings"
ON site_settings FOR SELECT
USING (true);

CREATE POLICY "Admins can update settings"
ON site_settings FOR UPDATE
USING (public.is_admin());`}
                            </pre>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* General Settings */}
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                General Settings
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="site_name">Site Name</Label>
                                    <Input
                                        id="site_name"
                                        defaultValue="Greek Recipes"
                                        placeholder="Site name"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="site_description">Site Description</Label>
                                    <Textarea
                                        id="site_description"
                                        defaultValue="Authentic Greek Recipes and Culinary Traditions"
                                        placeholder="Site description"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="contact_email">Contact Email</Label>
                                    <Input
                                        id="contact_email"
                                        type="email"
                                        defaultValue="info@greekrecipes.com"
                                        placeholder="contact@example.com"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Registration Settings */}
                        <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                User Settings
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="allow_registration"
                                        defaultChecked
                                        className="w-4 h-4 rounded"
                                    />
                                    <Label htmlFor="allow_registration" className="cursor-pointer">
                                        Allow new user registration
                                    </Label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="email_verification"
                                        defaultChecked
                                        className="w-4 h-4 rounded"
                                    />
                                    <Label htmlFor="email_verification" className="cursor-pointer">
                                        Require email verification
                                    </Label>
                                </div>
                            </div>
                        </section>

                        {/* Upload Settings */}
                        <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                Upload Settings
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="max_upload_size">Max Upload Size (MB)</Label>
                                    <Input
                                        id="max_upload_size"
                                        type="number"
                                        defaultValue="10"
                                        min="1"
                                        max="50"
                                    />
                                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                                        Maximum file size for image uploads
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Maintenance Mode */}
                        <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                Maintenance
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="maintenance_mode"
                                        className="w-4 h-4 rounded"
                                    />
                                    <Label htmlFor="maintenance_mode" className="cursor-pointer">
                                        Enable maintenance mode
                                    </Label>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    When enabled, the site will display a maintenance message to non-admin users.
                                    Admins can still access the site normally.
                                </p>
                            </div>
                        </section>

                        {/* API Settings */}
                        <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                API Configuration
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="openai_key">OpenAI API Key</Label>
                                    <Input
                                        id="openai_key"
                                        type="password"
                                        placeholder="sk-..."
                                    />
                                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                                        For AI-powered recipe suggestions and translations
                                    </p>
                                </div>
                                <div>
                                    <Label htmlFor="unsplash_key">Unsplash API Key</Label>
                                    <Input
                                        id="unsplash_key"
                                        type="password"
                                        placeholder="Access Key"
                                    />
                                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                                        For recipe image search
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Save Button */}
                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <Button variant="outline">
                                Reset to Defaults
                            </Button>
                            <Button>
                                Save Settings
                            </Button>
                        </div>

                        {/* Note */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                                <strong>Note:</strong> This is a placeholder UI. Connect to the <code>site_settings</code> table
                                and implement save/update functionality using Server Actions or API routes.
                            </p>
                        </div>
                    </div>
                )}
            </GlassPanel>
        </div>
    );
}
