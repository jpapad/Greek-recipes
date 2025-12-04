# 🎨 Figma to Code Guide

## How to Apply a Figma Design to Your App

### Step 1: Extract Design Tokens from Figma

#### Colors:
1. Open Figma file → Select "Inspect" panel
2. Copy color values (hex, RGB, or HSL)
3. Convert to OKLCH (modern color space)

**Example:**
```
Figma: #F97316 (Orange)
Convert: oklch(0.65 0.22 35)
```

#### Typography:
- Font families
- Font sizes
- Line heights
- Letter spacing
- Font weights

#### Spacing:
- Padding values
- Margin values
- Gap values
- Border radius

#### Shadows:
- Box shadows
- Text shadows
- Drop shadows

---

## Step 2: Update CSS Variables

### Edit `src/app/globals.css`:

```css
:root {
  /* Colors from Figma */
  --primary: oklch(0.65 0.22 35);        /* Main brand color */
  --secondary: oklch(0.7 0.15 280);      /* Secondary color */
  --accent: oklch(0.75 0.18 120);        /* Accent color */
  
  --background: oklch(0.98 0.01 200);    /* Background */
  --foreground: oklch(0.145 0 0);        /* Text color */
  
  --muted: oklch(0.556 0 0);             /* Muted text */
  --border: oklch(0.922 0 0);            /* Borders */
  
  /* Typography from Figma */
  --font-heading: "Your Figma Font", sans-serif;
  --font-body: "Your Body Font", sans-serif;
  
  /* Spacing from Figma */
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  
  /* Border Radius from Figma */
  --radius: 0.5rem;        /* 8px */
  --radius-lg: 1rem;       /* 16px */
  --radius-xl: 1.5rem;     /* 24px */
  
  /* Shadows from Figma */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

---

## Step 3: Update Components

### Option A: Keep Existing Components, Update Styles

Just change the CSS variables - all components update automatically!

### Option B: Create New Components from Figma

#### Example: Figma Button → React Component

**Figma Design:**
- Background: Linear gradient (Purple → Pink)
- Border radius: 12px
- Padding: 12px 24px
- Font: 16px semibold
- Shadow: Large shadow

**Code:**
```tsx
// src/components/ui/FigmaButton.tsx
import { cn } from "@/lib/utils";

export function FigmaButton({ 
  children, 
  className, 
  ...props 
}: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "px-6 py-3 rounded-xl font-semibold text-base",
        "bg-gradient-to-r from-purple-500 to-pink-500",
        "shadow-lg hover:shadow-xl",
        "transition-all duration-200",
        "hover:scale-105 active:scale-95",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

---

## Step 4: Update Layout & Spacing

### Grid System from Figma:
```css
/* If Figma uses 12-column grid */
.container {
  max-width: 1440px;  /* From Figma frame width */
  margin: 0 auto;
  padding: 0 24px;    /* From Figma margins */
}

.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;          /* From Figma gutter */
}
```

### Responsive Breakpoints:
```css
/* Match Figma breakpoints */
:root {
  --mobile: 375px;   /* From Figma mobile frame */
  --tablet: 768px;   /* From Figma tablet frame */
  --desktop: 1440px; /* From Figma desktop frame */
}
```

---

## Tools to Help

### 1. Figma Plugins:
- **Figma to Code** - Auto-generates Tailwind classes
- **Inspect (built-in)** - Shows CSS properties
- **Design Tokens** - Exports color/spacing variables
- **Tailwind CSS** - Generates Tailwind classes

### 2. Color Conversion:
- Use: https://colordesigner.io/convert/hextooklch
- Convert Figma hex colors → OKLCH

### 3. Font Loading:
```tsx
// src/app/layout.tsx
import { YourFigmaFont } from "next/font/google";

const figmaFont = YourFigmaFont({
  variable: "--font-figma",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});
```

---

## Example: Full Theme Transformation

### Before (Current Orange Theme):
```css
:root {
  --primary: oklch(0.65 0.22 35);  /* Orange */
  --radius: 1rem;
}
```

### After (Figma Blue Theme):
```css
:root {
  --primary: oklch(0.55 0.25 250);  /* Blue from Figma */
  --secondary: oklch(0.65 0.18 280); /* Purple from Figma */
  --accent: oklch(0.75 0.15 180);    /* Teal from Figma */
  --radius: 0.75rem;                 /* 12px from Figma */
}
```

**Result:** Entire app updates instantly! 🎉

---

## Common Figma Patterns → Code

### 1. Auto Layout → Flexbox/Grid
```tsx
{/* Figma: Auto Layout (Horizontal, gap: 16px) */}
<div className="flex gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### 2. Frames → Containers
```tsx
{/* Figma: Frame 1440x900 */}
<div className="max-w-[1440px] h-[900px] mx-auto">
  {/* Content */}
</div>
```

### 3. Effects → CSS
```tsx
{/* Figma: Drop Shadow (0, 4, 8, rgba(0,0,0,0.1)) */}
<div className="shadow-[0_4px_8px_rgba(0,0,0,0.1)]">
  {/* Content */}
</div>
```

### 4. Blur → Backdrop Filter
```tsx
{/* Figma: Background Blur 24px */}
<div className="backdrop-blur-2xl">
  {/* Content */}
</div>
```

---

## Workflow

### When you find a Figma design:

1. **Share the Figma link** with me
2. I'll extract:
   - Color palette
   - Typography system
   - Spacing values
   - Component styles
   - Layout structure
3. I'll update:
   - `globals.css` (design tokens)
   - Components (matching Figma)
   - Layout structure
4. **Done!** Your app matches the Figma design

---

## What I Need from Figma File:

### Essential:
- [ ] Color palette (primary, secondary, accent, neutrals)
- [ ] Typography (fonts, sizes, weights)
- [ ] Spacing system (8px grid? custom?)
- [ ] Border radius values
- [ ] Shadow styles

### Optional but Helpful:
- [ ] Component designs (buttons, cards, inputs)
- [ ] Page layouts (homepage, detail pages)
- [ ] Navigation design
- [ ] Icons/illustrations
- [ ] Responsive breakpoints

---

## Example Transformation Time:

- **Simple color/spacing update:** 15 minutes
- **Full component redesign:** 1-2 hours
- **Complete theme overhaul:** 2-4 hours

Your current architecture is **perfectly designed** for this!
All components use the CSS variables, so changing the theme 
is mostly updating `globals.css`. 🎨

---

## Pro Tips:

1. **Use Figma Dev Mode** (if available) - Shows exact CSS
2. **Export assets** as SVG for icons
3. **Copy CSS** directly from Figma Inspect panel
4. **Test responsive** - Figma has mobile/tablet/desktop frames
5. **Match animations** - Note transitions in Figma prototypes

---

Ready when you are! Just send me:
1. Figma link (view access)
2. Or screenshots of the design
3. Which parts you want to apply (full theme? specific components?)

I'll transform it into working code! 🚀
