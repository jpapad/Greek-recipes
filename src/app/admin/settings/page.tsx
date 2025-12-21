import { requireAdminServer } from "@/lib/adminServerGuard";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

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
        .order('setting_group', { ascending: true });

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
    setting_key TEXT UNIQUE NOT NULL,
    setting_group TEXT NOT NULL DEFAULT 'general',
    label TEXT NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initial settings
INSERT INTO site_settings (setting_key, setting_group, label, value, description) VALUES
('site_name', 'general', 'Site Name', '"Greek Recipes"', 'Site title'),
('site_description', 'general', 'Site Description', '"Authentic Greek Recipes"', 'Site description'),
('maintenance_mode', 'general', 'Maintenance Mode', 'false', 'Enable maintenance mode'),
('allow_registration', 'general', 'Allow Registration', 'true', 'Allow new user registration'),
('contact_email', 'general', 'Contact Email', '"info@greekrecipes.com"', 'Contact email'),
('max_upload_size_mb', 'general', 'Max Upload Size (MB)', '10', 'Maximum file upload size')
ON CONFLICT (setting_key) DO NOTHING;

-- RLS Policies
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view settings"
ON site_settings FOR SELECT
USING (true);

CREATE POLICY "Admins can update settings"
ON site_settings FOR UPDATE
USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
));`}
                            </pre>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Group settings by setting_group */}
                        {Array.isArray(settings) && settings.length > 0 ? (
                            <>
                                {/* Design Settings */}
                                {settings.filter(s => s.setting_group === 'design').length > 0 && (
                                    <section>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                            Design Settings
                                        </h2>
                                        <div className="space-y-6">
                                            {settings
                                                .filter(s => s.setting_group === 'design')
                                                .map(setting => (
                                                    <div key={setting.id} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                                                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                                                            {setting.label}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                            {setting.description}
                                                        </p>
                                                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                            <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-x-auto">
                                                                {JSON.stringify(setting.value, null, 2)}
                                                            </pre>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </section>
                                )}

                                {/* SEO Settings */}
                                {settings.filter(s => s.setting_group === 'seo').length > 0 && (
                                    <section>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                            SEO Settings
                                        </h2>
                                        <div className="space-y-6">
                                            {settings
                                                .filter(s => s.setting_group === 'seo')
                                                .map(setting => (
                                                    <div key={setting.id} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                                                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                                                            {setting.label}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                            {setting.description}
                                                        </p>
                                                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                            <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-x-auto">
                                                                {JSON.stringify(setting.value, null, 2)}
                                                            </pre>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </section>
                                )}

                                {/* All Other Settings */}
                                {settings.filter(s => !['design', 'seo'].includes(s.setting_group)).length > 0 && (
                                    <section>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                            Other Settings
                                        </h2>
                                        <div className="space-y-6">
                                            {settings
                                                .filter(s => !['design', 'seo'].includes(s.setting_group))
                                                .map(setting => (
                                                    <div key={setting.id} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                                                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                                                            {setting.label}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                            {setting.description}
                                                        </p>
                                                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                            <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-x-auto">
                                                                {JSON.stringify(setting.value, null, 2)}
                                                            </pre>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </section>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-600 dark:text-gray-400">
                                    No settings found. Please run the SQL migration above.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </GlassPanel>
        </div>
    );
}
