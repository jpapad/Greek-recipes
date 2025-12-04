'use client';

import { useEffect } from 'react';
import { getAllSiteSettings } from '@/lib/api';
import type { ColorSettings, BackgroundSettings, GlassmorphismSettings, TypographySettings, SpacingSettings } from '@/lib/types/site-settings';

export default function StyleInjector() {
  useEffect(() => {
    const loadAndApplyStyles = async () => {
      try {
        const settings = await getAllSiteSettings();

        // Build CSS variables string
        let cssVars = ':root {\n';

        // Apply Color Settings
        const colors = settings.find(s => s.setting_key === 'colors')?.value as ColorSettings | undefined;
        if (colors) {
          cssVars += `  --color-primary: ${colors.primary};\n`;
          cssVars += `  --color-primary-dark: ${colors.primaryDark};\n`;
          cssVars += `  --color-primary-light: ${colors.primaryLight};\n`;
          cssVars += `  --color-secondary: ${colors.secondary};\n`;
          cssVars += `  --color-secondary-dark: ${colors.secondaryDark};\n`;
          cssVars += `  --color-secondary-light: ${colors.secondaryLight};\n`;
          cssVars += `  --color-accent: ${colors.accent};\n`;
          cssVars += `  --color-background: ${colors.background};\n`;
          cssVars += `  --color-background-light: ${colors.backgroundLight};\n`;
          cssVars += `  --color-foreground: ${colors.foreground};\n`;
          cssVars += `  --color-muted: ${colors.muted};\n`;
          cssVars += `  --color-muted-foreground: ${colors.mutedForeground};\n`;
          cssVars += `  --color-accent-foreground: ${colors.accentForeground};\n`;
          cssVars += `  --color-success: ${colors.success};\n`;
          cssVars += `  --color-warning: ${colors.warning};\n`;
          cssVars += `  --color-error: ${colors.error};\n`;
          cssVars += `  --color-info: ${colors.info};\n`;
        }

        // Apply Background Settings
        const backgrounds = settings.find(s => s.setting_key === 'backgrounds')?.value as BackgroundSettings | undefined;
        if (backgrounds) {
          cssVars += `  --bg-mode: ${backgrounds.mode};\n`;
          
          if (backgrounds.mode === 'solid') {
            cssVars += `  --bg-color: ${backgrounds.solidColor};\n`;
          } else if (backgrounds.mode === 'gradient' && backgrounds.gradient) {
            const grad = backgrounds.gradient;
            const angle = grad.angle || '180deg';
            const via = grad.via || grad.from;
            if (grad.type === 'linear') {
              cssVars += `  --bg-gradient: linear-gradient(${angle}, ${grad.from}, ${via}, ${grad.to});\n`;
            } else if (grad.type === 'radial') {
              cssVars += `  --bg-gradient: radial-gradient(circle, ${grad.from}, ${via}, ${grad.to});\n`;
            }
          } else if (backgrounds.mode === 'image' && backgrounds.image) {
            cssVars += `  --bg-image-url: url('${backgrounds.image.url}');\n`;
            cssVars += `  --bg-image-opacity: ${backgrounds.image.opacity};\n`;
          } else if (backgrounds.mode === 'pattern' && backgrounds.pattern) {
            cssVars += `  --bg-pattern: ${backgrounds.pattern.type};\n`;
            cssVars += `  --bg-pattern-color: ${backgrounds.pattern.color};\n`;
            cssVars += `  --bg-pattern-opacity: ${backgrounds.pattern.opacity};\n`;
          }
        }

        // Apply Glassmorphism Settings
        const glass = settings.find(s => s.setting_key === 'glassmorphism')?.value as GlassmorphismSettings | undefined;
        if (glass) {
          cssVars += `  --glass-blur: ${glass.blur};\n`;
          cssVars += `  --glass-opacity: ${glass.opacity};\n`;
          cssVars += `  --glass-border-opacity: ${glass.borderOpacity};\n`;
          cssVars += `  --glass-shadow: ${glass.shadowIntensity};\n`;
        }

        // Apply Typography Settings
        const typography = settings.find(s => s.setting_key === 'typography')?.value as TypographySettings | undefined;
        if (typography) {
          cssVars += `  --font-family-sans: ${typography.fontFamily.sans};\n`;
          cssVars += `  --font-family-heading: ${typography.fontFamily.heading};\n`;
          cssVars += `  --font-size-xs: ${typography.fontSize.xs};\n`;
          cssVars += `  --font-size-sm: ${typography.fontSize.sm};\n`;
          cssVars += `  --font-size-base: ${typography.fontSize.base};\n`;
          cssVars += `  --font-size-lg: ${typography.fontSize.lg};\n`;
          cssVars += `  --font-size-xl: ${typography.fontSize.xl};\n`;
          cssVars += `  --font-size-2xl: ${typography.fontSize['2xl']};\n`;
          cssVars += `  --font-size-3xl: ${typography.fontSize['3xl']};\n`;
          cssVars += `  --font-size-4xl: ${typography.fontSize['4xl']};\n`;
          cssVars += `  --font-size-5xl: ${typography.fontSize['5xl']};\n`;
          cssVars += `  --font-size-6xl: ${typography.fontSize['6xl']};\n`;
          cssVars += `  --font-weight-light: ${typography.fontWeight.light};\n`;
          cssVars += `  --font-weight-normal: ${typography.fontWeight.normal};\n`;
          cssVars += `  --font-weight-medium: ${typography.fontWeight.medium};\n`;
          cssVars += `  --font-weight-semibold: ${typography.fontWeight.semibold};\n`;
          cssVars += `  --font-weight-bold: ${typography.fontWeight.bold};\n`;
          cssVars += `  --font-weight-extrabold: ${typography.fontWeight.extrabold};\n`;
          cssVars += `  --line-height-tight: ${typography.lineHeight.tight};\n`;
          cssVars += `  --line-height-normal: ${typography.lineHeight.normal};\n`;
          cssVars += `  --line-height-relaxed: ${typography.lineHeight.relaxed};\n`;
        }

        // Apply Spacing Settings
        const spacing = settings.find(s => s.setting_key === 'spacing')?.value as SpacingSettings | undefined;
        if (spacing) {
          cssVars += `  --container-max-width: ${spacing.containerMaxWidth};\n`;
          cssVars += `  --section-padding-sm: ${spacing.sectionPadding.sm};\n`;
          cssVars += `  --section-padding-md: ${spacing.sectionPadding.md};\n`;
          cssVars += `  --section-padding-lg: ${spacing.sectionPadding.lg};\n`;
          cssVars += `  --card-padding-sm: ${spacing.cardPadding.sm};\n`;
          cssVars += `  --card-padding-md: ${spacing.cardPadding.md};\n`;
          cssVars += `  --card-padding-lg: ${spacing.cardPadding.lg};\n`;
          cssVars += `  --border-radius-sm: ${spacing.borderRadius.sm};\n`;
          cssVars += `  --border-radius-md: ${spacing.borderRadius.md};\n`;
          cssVars += `  --border-radius-lg: ${spacing.borderRadius.lg};\n`;
          cssVars += `  --border-radius-xl: ${spacing.borderRadius.xl};\n`;
          cssVars += `  --border-radius-2xl: ${spacing.borderRadius['2xl']};\n`;
          cssVars += `  --border-radius-full: ${spacing.borderRadius.full};\n`;
          cssVars += `  --gap-xs: ${spacing.gap.xs};\n`;
          cssVars += `  --gap-sm: ${spacing.gap.sm};\n`;
          cssVars += `  --gap-md: ${spacing.gap.md};\n`;
          cssVars += `  --gap-lg: ${spacing.gap.lg};\n`;
          cssVars += `  --gap-xl: ${spacing.gap.xl};\n`;
        }

        cssVars += '}\n\n';

        // Apply background based on mode
        if (backgrounds) {
          if (backgrounds.mode === 'gradient') {
            cssVars += 'body { background: var(--bg-gradient); background-attachment: fixed; }\n';
          } else if (backgrounds.mode === 'image') {
            cssVars += `body { 
              background-image: var(--bg-image-url); 
              background-size: cover; 
              background-position: center;
              background-attachment: fixed;
              position: relative;
            }\n`;
            cssVars += `body::before { 
              content: ''; 
              position: fixed; 
              top: 0; 
              left: 0; 
              right: 0; 
              bottom: 0; 
              background: rgba(255, 255, 255, var(--bg-image-opacity)); 
              z-index: -1; 
            }\n`;
          } else if (backgrounds.mode === 'pattern') {
            cssVars += `body { background-color: var(--bg-pattern-color); }\n`;
          }
        }

        // Apply glass effects to GlassPanel components
        if (glass && glass.enabled) {
          cssVars += `.glass-panel {
  backdrop-filter: blur(var(--glass-blur));
  background-color: rgba(255, 255, 255, var(--glass-opacity));
  border: 1px solid rgba(255, 255, 255, var(--glass-border-opacity));
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
}\n`;
        }

        // Inject styles into document
        const styleId = 'dynamic-site-settings';
        let styleElement = document.getElementById(styleId) as HTMLStyleElement | null;
        
        if (!styleElement) {
          styleElement = document.createElement('style');
          styleElement.id = styleId;
          document.head.appendChild(styleElement);
        }
        
        styleElement.textContent = cssVars;

      } catch (error) {
        console.error('Failed to load site settings:', error);
      }
    };

    loadAndApplyStyles();
  }, []);

  return null; // This component only injects styles, no UI
}
