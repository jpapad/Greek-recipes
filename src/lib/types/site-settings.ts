// Site Settings Types

export interface SiteSetting {
  id: string;
  setting_key: string;
  setting_group: 'design' | 'seo' | 'social' | 'advanced';
  label: string;
  description?: string;
  value: Record<string, any>;
  default_value: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Color Settings
export interface ColorSettings {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  secondaryDark: string;
  secondaryLight: string;
  background: string;
  backgroundLight: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

// Background Settings
export interface BackgroundSettings {
  mode: 'solid' | 'gradient' | 'image' | 'pattern';
  solidColor: string;
  gradient?: {
    type: 'linear' | 'radial' | 'conic';
    from: string;
    via?: string;
    to: string;
    angle?: string;
  };
  image?: {
    url: string;
    opacity: number;
    blend: string;
    position: string;
    size: string;
    repeat: string;
  };
  pattern?: {
    type: 'dots' | 'grid' | 'lines' | 'waves';
    color: string;
    opacity: number;
    size: number;
    spacing: number;
  };
}

// Glassmorphism Settings
export interface GlassmorphismSettings {
  enabled: boolean;
  blur: string;
  opacity: number;
  borderOpacity: number;
  shadowIntensity: 'low' | 'medium' | 'high';
  backgroundColor?: string;
  borderColor?: string;
}

// Typography Settings
export interface TypographySettings {
  fontFamily: {
    sans: string;
    serif?: string;
    mono?: string;
    heading: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
}

// Spacing Settings
export interface SpacingSettings {
  containerMaxWidth: string;
  sectionPadding: {
    sm: string;
    md: string;
    lg: string;
  };
  cardPadding: {
    sm: string;
    md: string;
    lg: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    full: string;
  };
  gap: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// Animation Settings
export interface AnimationSettings {
  enabled: boolean;
  speed: {
    fast: string;
    normal: string;
    slow: string;
  };
  easing: {
    default: string;
    bounce: string;
    smooth: string;
  };
  hoverScale: number;
  hoverDuration: string;
}

// Theme Preset
export interface ThemePreset {
  background: string;
  foreground: string;
  primary: string;
  muted: string;
}

export interface ThemePresetSettings {
  current: 'light' | 'dark' | 'ocean' | 'sunset' | 'forest' | 'custom';
  presets: {
    light: ThemePreset;
    dark: ThemePreset;
    ocean: ThemePreset;
    sunset: ThemePreset;
    forest: ThemePreset;
  };
}

// SEO Settings
export interface SEOSettings {
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string;
  ogImage: string;
  twitterHandle: string;
  favicon: string;
}
