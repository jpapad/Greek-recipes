-- Site Settings Table for global design customization
-- Drop existing table if it exists
DROP TABLE IF EXISTS site_settings CASCADE;

-- Create site_settings table
CREATE TABLE site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT NOT NULL UNIQUE, -- e.g., 'colors', 'typography', 'layout', 'backgrounds'
    setting_group TEXT NOT NULL, -- 'design', 'seo', 'social', 'advanced'
    label TEXT NOT NULL,
    description TEXT,
    value JSONB NOT NULL DEFAULT '{}'::jsonb,
    default_value JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes
CREATE INDEX idx_site_settings_key ON site_settings(setting_key);
CREATE INDEX idx_site_settings_group ON site_settings(setting_group);
CREATE INDEX idx_site_settings_active ON site_settings(is_active);

-- Insert default design settings
INSERT INTO site_settings (setting_key, setting_group, label, description, value, default_value, is_active) VALUES
(
    'colors',
    'design',
    'Χρώματα Σελίδας',
    'Κύρια χρώματα του site (Primary, Secondary, Background, κλπ)',
    '{
        "primary": "#ea580c",
        "primaryDark": "#c2410c",
        "primaryLight": "#fb923c",
        "secondary": "#3b82f6",
        "secondaryDark": "#1d4ed8",
        "secondaryLight": "#60a5fa",
        "background": "#0a0e1a",
        "backgroundLight": "#1a1f35",
        "foreground": "#f8fafc",
        "muted": "#475569",
        "mutedForeground": "#94a3b8",
        "accent": "#ec4899",
        "accentForeground": "#fce7f3",
        "success": "#22c55e",
        "warning": "#f59e0b",
        "error": "#ef4444",
        "info": "#06b6d4"
    }'::jsonb,
    '{
        "primary": "#ea580c",
        "primaryDark": "#c2410c",
        "primaryLight": "#fb923c",
        "secondary": "#3b82f6",
        "secondaryDark": "#1d4ed8",
        "secondaryLight": "#60a5fa",
        "background": "#0a0e1a",
        "backgroundLight": "#1a1f35",
        "foreground": "#f8fafc",
        "muted": "#475569",
        "mutedForeground": "#94a3b8",
        "accent": "#ec4899",
        "accentForeground": "#fce7f3",
        "success": "#22c55e",
        "warning": "#f59e0b",
        "error": "#ef4444",
        "info": "#06b6d4"
    }'::jsonb,
    true
),
(
    'backgrounds',
    'design',
    'Backgrounds',
    'Ρυθμίσεις background (Solid, Gradient, Image, Pattern)',
    '{
        "mode": "gradient",
        "solidColor": "#0a0e1a",
        "gradient": {
            "type": "radial",
            "from": "oklch(0.12 0.01 240)",
            "via": "oklch(0.10 0.015 260)",
            "to": "oklch(0.08 0.02 280)",
            "angle": "135deg"
        },
        "image": {
            "url": "",
            "opacity": 0.1,
            "blend": "overlay",
            "position": "center",
            "size": "cover",
            "repeat": "no-repeat"
        },
        "pattern": {
            "type": "dots",
            "color": "#ffffff",
            "opacity": 0.05,
            "size": 20,
            "spacing": 40
        }
    }'::jsonb,
    '{
        "mode": "gradient",
        "solidColor": "#0a0e1a",
        "gradient": {
            "type": "radial",
            "from": "oklch(0.12 0.01 240)",
            "via": "oklch(0.10 0.015 260)",
            "to": "oklch(0.08 0.02 280)",
            "angle": "135deg"
        }
    }'::jsonb,
    true
),
(
    'glassmorphism',
    'design',
    'Glass Effects',
    'Ρυθμίσεις glassmorphism για cards και panels',
    '{
        "enabled": true,
        "blur": "24px",
        "opacity": 0.8,
        "borderOpacity": 0.2,
        "shadowIntensity": "medium",
        "backgroundColor": "rgba(255, 255, 255, 0.05)",
        "borderColor": "rgba(255, 255, 255, 0.1)"
    }'::jsonb,
    '{
        "enabled": true,
        "blur": "24px",
        "opacity": 0.8,
        "borderOpacity": 0.2,
        "shadowIntensity": "medium"
    }'::jsonb,
    true
),
(
    'typography',
    'design',
    'Τυπογραφία',
    'Ρυθμίσεις fonts, sizes, weights',
    '{
        "fontFamily": {
            "sans": "Inter, system-ui, sans-serif",
            "serif": "Playfair Display, Georgia, serif",
            "mono": "Fira Code, monospace",
            "heading": "Poppins, sans-serif"
        },
        "fontSize": {
            "xs": "0.75rem",
            "sm": "0.875rem",
            "base": "1rem",
            "lg": "1.125rem",
            "xl": "1.25rem",
            "2xl": "1.5rem",
            "3xl": "1.875rem",
            "4xl": "2.25rem",
            "5xl": "3rem",
            "6xl": "3.75rem"
        },
        "fontWeight": {
            "light": 300,
            "normal": 400,
            "medium": 500,
            "semibold": 600,
            "bold": 700,
            "extrabold": 800
        },
        "lineHeight": {
            "tight": 1.25,
            "normal": 1.5,
            "relaxed": 1.75,
            "loose": 2
        }
    }'::jsonb,
    '{
        "fontFamily": {
            "sans": "Inter, system-ui, sans-serif",
            "heading": "Poppins, sans-serif"
        }
    }'::jsonb,
    true
),
(
    'spacing',
    'design',
    'Spacing & Layout',
    'Margins, paddings, container widths',
    '{
        "containerMaxWidth": "1400px",
        "sectionPadding": {
            "sm": "3rem",
            "md": "5rem",
            "lg": "8rem"
        },
        "cardPadding": {
            "sm": "1rem",
            "md": "1.5rem",
            "lg": "2rem"
        },
        "borderRadius": {
            "sm": "0.375rem",
            "md": "0.5rem",
            "lg": "0.75rem",
            "xl": "1rem",
            "2xl": "1.5rem",
            "full": "9999px"
        },
        "gap": {
            "xs": "0.5rem",
            "sm": "1rem",
            "md": "1.5rem",
            "lg": "2rem",
            "xl": "3rem"
        }
    }'::jsonb,
    '{
        "containerMaxWidth": "1400px",
        "sectionPadding": {"md": "5rem"}
    }'::jsonb,
    true
),
(
    'animations',
    'design',
    'Animations & Transitions',
    'Ταχύτητα animations, easing functions',
    '{
        "enabled": true,
        "speed": {
            "fast": "150ms",
            "normal": "300ms",
            "slow": "500ms"
        },
        "easing": {
            "default": "cubic-bezier(0.4, 0, 0.2, 1)",
            "bounce": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
            "smooth": "cubic-bezier(0.25, 0.46, 0.45, 0.94)"
        },
        "hoverScale": 1.05,
        "hoverDuration": "300ms"
    }'::jsonb,
    '{
        "enabled": true,
        "speed": {"normal": "300ms"}
    }'::jsonb,
    true
),
(
    'theme_presets',
    'design',
    'Theme Presets',
    'Προκαθορισμένα θέματα (Light, Dark, Ocean, Sunset)',
    '{
        "current": "dark",
        "presets": {
            "light": {
                "background": "#ffffff",
                "foreground": "#0a0e1a",
                "primary": "#ea580c",
                "muted": "#f1f5f9"
            },
            "dark": {
                "background": "#0a0e1a",
                "foreground": "#f8fafc",
                "primary": "#ea580c",
                "muted": "#475569"
            },
            "ocean": {
                "background": "#0c1e2e",
                "foreground": "#e0f2fe",
                "primary": "#0ea5e9",
                "muted": "#334155"
            },
            "sunset": {
                "background": "#2d1b1e",
                "foreground": "#fef3c7",
                "primary": "#f97316",
                "muted": "#78350f"
            },
            "forest": {
                "background": "#1a2e1a",
                "foreground": "#f0fdf4",
                "primary": "#22c55e",
                "muted": "#365314"
            }
        }
    }'::jsonb,
    '{
        "current": "dark"
    }'::jsonb,
    true
),
(
    'seo',
    'seo',
    'SEO Settings',
    'Meta tags, site title, description',
    '{
        "siteTitle": "Greek Recipes - Αυθεντικές Ελληνικές Συνταγές",
        "siteDescription": "Ανακαλύψτε παραδοσιακές ελληνικές συνταγές από όλη την Ελλάδα",
        "siteKeywords": "ελληνικές συνταγές, greek recipes, παραδοσιακή κουζίνα",
        "ogImage": "/og-image.jpg",
        "twitterHandle": "@greekrecipes",
        "favicon": "/favicon.ico"
    }'::jsonb,
    '{
        "siteTitle": "Greek Recipes",
        "siteDescription": "Discover authentic Greek recipes"
    }'::jsonb,
    true
);

-- Add RLS policies
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to site_settings"
ON site_settings FOR SELECT
TO public
USING (is_active = true);

-- Allow authenticated users to manage
CREATE POLICY "Allow authenticated users to manage site_settings"
ON site_settings FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_site_settings_timestamp
BEFORE UPDATE ON site_settings
FOR EACH ROW
EXECUTE FUNCTION update_site_settings_updated_at();
