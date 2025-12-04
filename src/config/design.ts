/**
 * Design System Configuration
 * Easy way to customize the entire app appearance
 */

export const designConfig = {
  // ============================================
  // COLORS (OKLCH format for modern color space)
  // ============================================
  colors: {
    // Brand Colors
    primary: "oklch(0.65 0.22 35)",      // Main brand color (Orange)
    secondary: "oklch(0.97 0 0)",        // Secondary brand color
    accent: "oklch(0.97 0 0)",           // Accent highlights
    
    // UI Colors
    background: "oklch(0.98 0.01 200)",  // Page background
    foreground: "oklch(0.145 0 0)",      // Main text
    muted: "oklch(0.556 0 0)",           // Muted text
    border: "oklch(0.922 0 0)",          // Borders
    
    // Semantic Colors
    success: "oklch(0.65 0.18 145)",     // Success green
    warning: "oklch(0.75 0.22 85)",      // Warning amber
    error: "oklch(0.577 0.245 27.325)",  // Error red
    info: "oklch(0.6 0.25 250)",         // Info blue
  },

  // ============================================
  // TYPOGRAPHY
  // ============================================
  typography: {
    // Font Families
    fonts: {
      sans: "var(--font-geist-sans)",    // Body text
      mono: "var(--font-geist-mono)",    // Code/monospace
      heading: "var(--font-geist-sans)", // Headings
    },
    
    // Font Sizes (Tailwind scale)
    sizes: {
      xs: "0.75rem",      // 12px
      sm: "0.875rem",     // 14px
      base: "1rem",       // 16px
      lg: "1.125rem",     // 18px
      xl: "1.25rem",      // 20px
      "2xl": "1.5rem",    // 24px
      "3xl": "1.875rem",  // 30px
      "4xl": "2.25rem",   // 36px
      "5xl": "3rem",      // 48px
      "6xl": "3.75rem",   // 60px
      "7xl": "4.5rem",    // 72px
    },
    
    // Font Weights
    weights: {
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },

  // ============================================
  // SPACING (based on 4px grid)
  // ============================================
  spacing: {
    xs: "0.25rem",   // 4px
    sm: "0.5rem",    // 8px
    md: "1rem",      // 16px
    lg: "1.5rem",    // 24px
    xl: "2rem",      // 32px
    "2xl": "3rem",   // 48px
    "3xl": "4rem",   // 64px
    "4xl": "6rem",   // 96px
  },

  // ============================================
  // BORDER RADIUS
  // ============================================
  radius: {
    none: "0",
    sm: "0.25rem",    // 4px
    md: "0.5rem",     // 8px
    lg: "1rem",       // 16px - DEFAULT
    xl: "1.5rem",     // 24px
    "2xl": "2rem",    // 32px
    full: "9999px",   // Fully rounded
  },

  // ============================================
  // SHADOWS
  // ============================================
  shadows: {
    none: "none",
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    
    // Glass effects
    glass: "0 8px 32px 0 rgba(31, 38, 135, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)",
    glassCard: "0 4px 24px 0 rgba(31, 38, 135, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.4)",
  },

  // ============================================
  // ANIMATIONS
  // ============================================
  animations: {
    // Durations
    durations: {
      fast: "150ms",
      normal: "200ms",
      slow: "300ms",
      slower: "500ms",
    },
    
    // Easing functions
    easing: {
      default: "cubic-bezier(0.4, 0, 0.2, 1)",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      out: "cubic-bezier(0, 0, 0.2, 1)",
      inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },

  // ============================================
  // LAYOUT
  // ============================================
  layout: {
    // Container widths
    container: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    
    // Responsive breakpoints
    breakpoints: {
      mobile: "375px",
      tablet: "768px",
      desktop: "1024px",
      wide: "1440px",
    },
  },

  // ============================================
  // GLASS MORPHISM
  // ============================================
  glass: {
    blur: {
      sm: "8px",
      md: "12px",
      lg: "16px",
      xl: "24px",
      "2xl": "40px",
    },
    
    opacity: {
      light: "0.3",
      medium: "0.5",
      strong: "0.7",
    },
  },
};

/**
 * Usage Example:
 * 
 * // In your component:
 * import { designConfig } from '@/config/design';
 * 
 * <div style={{ 
 *   color: designConfig.colors.primary,
 *   fontSize: designConfig.typography.sizes.xl,
 *   borderRadius: designConfig.radius.lg
 * }}>
 *   Content
 * </div>
 * 
 * // Or with Tailwind (most common):
 * <div className="text-primary text-xl rounded-lg">
 *   Content
 * </div>
 */

export default designConfig;
