# 🚀 Νέα Features - Pages, Menu & Enhanced Backgrounds

## Περίληψη Νέων Δυνατοτήτων

### 1. **Page Builder** 📄
Δημιουργία & διαχείριση δυναμικών σελίδων με block-based editor

### 2. **Menu Manager** 🍔  
Πλήρης διαχείριση navigation menus με drag & drop

### 3. **Enhanced Backgrounds** 🎨
- Image Upload με Supabase Storage
- Advanced Pattern Settings με preview

---

## 1. Page Builder System

### Database Schema (`pages-table.sql`)

**Χαρακτηριστικά:**
- ✅ Block-based content (JSONB)
- ✅ SEO meta tags (title, description, keywords, OG image)
- ✅ 4 templates (default, full-width, sidebar-left, sidebar-right)
- ✅ Status workflow (draft → published → archived)
- ✅ Hierarchical pages (parent-child)
- ✅ Homepage designation
- ✅ Menu integration (display_in_menu, menu_order)
- ✅ Author tracking
- ✅ Published timestamp

**Προεπιλεγμένες Σελίδες:**
1. Αρχική (homepage)
2. Σχετικά με εμάς
3. Επικοινωνία
4. Όροι Χρήσης
5. Πολιτική Απορρήτου

### Διαθέσιμα Content Blocks

#### Content Blocks
- **Heading**: 6 levels (H1-H6), alignment, color
- **Paragraph**: Rich text, alignment, color
- **Quote**: Blockquote με author
- **List**: Ordered/Unordered lists
- **Code**: Syntax highlighted code με line numbers
- **Divider**: HR με styles (solid, dashed, dotted)
- **Spacer**: Custom height spacing

#### Media Blocks
- **Image**: URL, alt, caption, alignment, link, dimensions
- **Video**: YouTube, Vimeo, direct video support

#### Layout Blocks
- **Columns**: Multi-column layouts με custom widths
- **Hero**: Full-width hero section με background image
- **Button**: CTA buttons με styles & icons

#### Special Blocks
- **Home Sections**: Loads home_sections dynamically
- **Contact Form**: Configurable form fields
- **Contact Info**: Email, phone, address, social links
- **Recipes Grid**: Filtered recipe listings
- **Regions Grid**: Region cards
- **Custom HTML**: Raw HTML insertion

### Page Structure Example

```json
{
  "blocks": [
    {
      "id": "heading-1",
      "type": "heading",
      "data": {
        "level": 1,
        "text": "Καλώς ήρθατε",
        "align": "center",
        "color": "#ea580c"
      }
    },
    {
      "id": "paragraph-1",
      "type": "paragraph",
      "data": {
        "text": "Αυτή είναι μια παράγραφος...",
        "align": "justify"
      }
    },
    {
      "id": "image-1",
      "type": "image",
      "data": {
        "url": "/uploads/photo.jpg",
        "alt": "Photo description",
        "caption": "Photo caption",
        "align": "center"
      }
    },
    {
      "id": "columns-1",
      "type": "columns",
      "data": {
        "columns": [
          {
            "id": "col-1",
            "width": 50,
            "blocks": [...]
          },
          {
            "id": "col-2",
            "width": 50,
            "blocks": [...]
          }
        ],
        "gap": "2rem"
      }
    }
  ]
}
```

---

## 2. Menu Manager System

### Database Schema (`menu-items-table.sql`)

**Χαρακτηριστικά:**
- ✅ 5 menu locations (main, footer, mobile, user-menu, admin)
- ✅ Hierarchical menus (parent-child για dropdowns)
- ✅ Icons (Lucide React)
- ✅ Badges (NEW, BETA, etc.)
- ✅ Access control (requires_auth, requires_admin)
- ✅ Custom CSS classes
- ✅ Display order
- ✅ Active/Inactive toggle
- ✅ Target (_self, _blank)

**Προεπιλεγμένα Menus:**

#### Main Menu
- Αρχική (/)
- Συνταγές (/recipes) - με dropdown:
  - Ορεκτικά
  - Κυρίως Πιάτα
  - Γλυκά
  - Σαλάτες
- Περιοχές (/regions)
- Σχετικά (/about)
- Επικοινωνία (/contact)

#### User Menu (requires_auth)
- Αγαπημένα (/favorites)
- Λίστα Αγορών (/shopping-list)
- Meal Plan (/meal-plan)
- Προφίλ (/profile)

#### Admin Menu (requires_admin)
- Dashboard (/admin)
- Συνταγές (/admin/recipes)
- Περιοχές (/admin/regions)
- Home Sections (/admin/home-sections)
- **Σελίδες (/admin/pages)** - ΝΕΟ!
- **Menu (/admin/menu)** - ΝΕΟ!
- Site Settings (/admin/site-settings)

#### Footer Menu
- Όροι Χρήσης
- Πολιτική Απορρήτου
- Cookies
- Sitemap

### Menu Item Structure

```typescript
{
  label: "Συνταγές",
  url: "/recipes",
  icon: "UtensilsCrossed",
  menu_location: "main",
  display_order: 2,
  children: [
    {
      label: "Ορεκτικά",
      url: "/recipes?category=appetizer",
      icon: "Salad",
      parent_id: "parent-uuid"
    }
  ],
  badge_text: "NEW",
  badge_color: "#22c55e"
}
```

---

## 3. Enhanced Background Settings

### Image Upload Feature

**Νέες Δυνατότητες:**
- ✅ Direct upload σε Supabase Storage
- ✅ Image preview
- ✅ Drag & drop support
- ✅ Remove uploaded image
- ✅ Public URL generation

**Storage Structure:**
```
Bucket: backgrounds
Path: images/{random-id}-{timestamp}.{ext}
```

**Component:**
```tsx
<ImageUpload 
  onUpload={(url) => setBackgrounds({...backgrounds, image: {..., url}})}
  currentImage={backgrounds.image?.url}
  bucket="backgrounds"
  path="images"
/>
```

### Pattern Settings

**Διαθέσιμα Patterns:**
1. **Dots**: Dot grid pattern
2. **Grid**: Square grid
3. **Lines**: Diagonal/horizontal/vertical lines
4. **Waves**: Wave pattern
5. **Hexagons**: Hexagonal pattern
6. **Triangles**: Triangle mosaic

**Pattern Configuration:**
```json
{
  "mode": "pattern",
  "pattern": {
    "type": "dots",
    "color": "#ffffff",
    "opacity": 0.05,
    "size": 20,
    "spacing": 40,
    "rotation": 0
  }
}
```

**CSS Generation:**
```css
body {
  background-image: radial-gradient(
    circle, 
    rgba(255, 255, 255, 0.05) 2px, 
    transparent 2px
  );
  background-size: 40px 40px;
}
```

---

## Επόμενα Βήματα για Υλοποίηση

### Βήμα 1: Database Setup

```bash
# Στο Supabase SQL Editor:
# 1. Τρέξτε pages-table.sql
# 2. Τρέξτε menu-items-table.sql
```

### Βήμα 2: Supabase Storage Setup

```bash
# Στο Supabase Dashboard → Storage:
# 1. Create new bucket: "backgrounds"
# 2. Make it public
# 3. Set allowed file types: image/*
# 4. Set max file size: 5MB
```

### Βήμα 3: API Functions

Προσθήκη στο `src/lib/api.ts`:

```typescript
// Pages API
export async function getPages(filters?: {...}): Promise<Page[]>
export async function getPageBySlug(slug: string): Promise<Page | null>
export async function createPage(data: Partial<Page>): Promise<Page>
export async function updatePage(id: string, data: Partial<Page>): Promise<boolean>
export async function deletePage(id: string): Promise<boolean>
export async function publishPage(id: string): Promise<boolean>
export async function setHomepage(id: string): Promise<boolean>

// Menu API
export async function getMenuItems(location?: string): Promise<MenuItem[]>
export async function createMenuItem(data: Partial<MenuItem>): Promise<MenuItem>
export async function updateMenuItem(id: string, data: Partial<MenuItem>): Promise<boolean>
export async function deleteMenuItem(id: string): Promise<boolean>
export async function reorderMenuItems(items: {id: string, order: number}[]): Promise<boolean>
```

### Βήμα 4: Admin Interfaces

**Δημιουργία σελίδων:**
- `/admin/pages` - Pages list με filter (status, template)
- `/admin/pages/new` - Create new page με block editor
- `/admin/pages/[id]/edit` - Edit page
- `/admin/menu` - Menu manager με drag & drop
- `/admin/menu/new` - Add menu item

### Βήμα 5: Enhanced Backgrounds UI

Ενημέρωση `/admin/site-settings` Backgrounds tab:

```tsx
{backgrounds.mode === 'image' && (
  <div className="space-y-4">
    <Label>Upload Background Image</Label>
    <ImageUpload 
      onUpload={(url) => setBackgrounds({
        ...backgrounds, 
        image: {...backgrounds.image, url}
      })}
      currentImage={backgrounds.image?.url}
    />
    
    <div>
      <Label>Opacity: {backgrounds.image?.opacity}</Label>
      <input 
        type="range" 
        min="0" 
        max="1" 
        step="0.1"
        value={backgrounds.image?.opacity}
        onChange={(e) => setBackgrounds({...})}
      />
    </div>
    
    <div>
      <Label>Blend Mode</Label>
      <select value={backgrounds.image?.blend}>
        <option>overlay</option>
        <option>multiply</option>
        <option>screen</option>
        <option>normal</option>
      </select>
    </div>
  </div>
)}

{backgrounds.mode === 'pattern' && (
  <div className="space-y-4">
    <Label>Pattern Type</Label>
    <div className="grid grid-cols-3 gap-3">
      {['dots', 'grid', 'lines', 'waves', 'hexagons', 'triangles'].map(p => (
        <button 
          onClick={() => setBackgrounds({
            ...backgrounds,
            pattern: {...backgrounds.pattern, type: p}
          })}
          className={backgrounds.pattern?.type === p ? 'border-primary' : ''}
        >
          <PatternPreview type={p} />
          {p}
        </button>
      ))}
    </div>
    
    <Label>Pattern Color</Label>
    <input type="color" value={backgrounds.pattern?.color} />
    
    <Label>Opacity: {backgrounds.pattern?.opacity}</Label>
    <input type="range" min="0" max="1" step="0.05" />
    
    <Label>Size: {backgrounds.pattern?.size}px</Label>
    <input type="range" min="10" max="100" />
    
    <Label>Spacing: {backgrounds.pattern?.spacing}px</Label>
    <input type="range" min="20" max="200" />
  </div>
)}
```

---

## Block Editor Component

```tsx
// src/components/admin/BlockEditor.tsx
interface BlockEditorProps {
  content: PageContent;
  onChange: (content: PageContent) => void;
}

export function BlockEditor({ content, onChange }: BlockEditorProps) {
  function addBlock(type: string) {
    const newBlock = createBlockFromTemplate(type);
    onChange({
      blocks: [...content.blocks, newBlock]
    });
  }
  
  function updateBlock(id: string, data: any) {
    onChange({
      blocks: content.blocks.map(b => 
        b.id === id ? {...b, data} : b
      )
    });
  }
  
  function deleteBlock(id: string) {
    onChange({
      blocks: content.blocks.filter(b => b.id !== id)
    });
  }
  
  function moveBlock(id: string, direction: 'up' | 'down') {
    // Reorder logic
  }
  
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={content.blocks}>
        {content.blocks.map(block => (
          <BlockRenderer 
            key={block.id}
            block={block}
            onUpdate={(data) => updateBlock(block.id, data)}
            onDelete={() => deleteBlock(block.id)}
          />
        ))}
      </SortableContext>
      
      <BlockPalette onSelect={addBlock} />
    </DndContext>
  );
}
```

---

## Folder Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── pages/
│   │   │   ├── page.tsx         # Pages list
│   │   │   ├── new/
│   │   │   │   └── page.tsx     # Create page
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx # Edit page
│   │   └── menu/
│   │       ├── page.tsx         # Menu manager
│   │       └── new/
│   │           └── page.tsx     # Add menu item
│   └── [slug]/
│       └── page.tsx             # Dynamic page renderer
├── components/
│   ├── admin/
│   │   ├── BlockEditor.tsx      # Page builder
│   │   ├── BlockRenderer.tsx    # Block display
│   │   ├── BlockPalette.tsx     # Block picker
│   │   ├── MenuManager.tsx      # Menu drag & drop
│   │   └── PatternPreview.tsx   # Pattern previews
│   ├── blocks/                  # Individual block components
│   │   ├── HeadingBlock.tsx
│   │   ├── ParagraphBlock.tsx
│   │   ├── ImageBlock.tsx
│   │   └── ... (15+ blocks)
│   └── ui/
│       └── ImageUpload.tsx      # (Already exists)
└── lib/
    ├── api.ts                   # +15 new functions
    └── types/
        └── pages.ts             # (Created)
```

---

## Feature Comparison

| Feature | Υπάρχει | Χρειάζεται |
|---------|---------|------------|
| **Pages System** | ❌ | ✅ |
| Database Schema | ✅ | - |
| TypeScript Types | ✅ | - |
| API Functions | ❌ | ✅ |
| Admin Interface | ❌ | ✅ |
| Block Editor | ❌ | ✅ |
| Frontend Renderer | ❌ | ✅ |
| **Menu System** | ❌ | ✅ |
| Database Schema | ✅ | - |
| TypeScript Types | ✅ | - |
| API Functions | ❌ | ✅ |
| Menu Manager UI | ❌ | ✅ |
| Dynamic Navbar | ❌ | ✅ |
| **Enhanced Backgrounds** | Partial | ✅ |
| Image Upload | ✅ (component exists) | Integration |
| Pattern Settings | ❌ | ✅ |
| Pattern Preview | ❌ | ✅ |
| CSS Generation | ❌ | ✅ |

---

## Estimated Implementation Time

- **Pages System**: 8-10 hours
  - API functions: 2h
  - Block Editor: 4h
  - Admin UI: 2h
  - Frontend Renderer: 2h

- **Menu System**: 4-6 hours
  - API functions: 1h
  - Menu Manager UI: 3h
  - Dynamic Navbar integration: 2h

- **Enhanced Backgrounds**: 2-3 hours
  - Upload integration: 1h
  - Pattern UI: 1h
  - CSS generation: 1h

**Total**: 14-19 hours για πλήρη υλοποίηση

---

## Priorities

### High Priority (Core Functionality)
1. ✅ Database schemas (DONE)
2. ✅ TypeScript types (DONE)
3. API functions για Pages & Menu
4. Basic Page Builder με 5-6 βασικά blocks
5. Menu Manager με drag & drop

### Medium Priority (Enhanced UX)
6. Image Upload integration
7. Pattern settings UI
8. Advanced blocks (Columns, Hero, etc.)
9. Block templates library
10. SEO preview

### Low Priority (Nice to Have)
11. Block duplication
12. Version history για pages
13. Page templates (save/load)
14. Multi-language pages
15. Scheduled publishing

---

## SQL Scripts Created

1. ✅ `pages-table.sql` - 200+ lines
2. ✅ `menu-items-table.sql` - 150+ lines

## TypeScript Files Created

1. ✅ `src/lib/types/pages.ts` - Complete types για Pages & Menu

## Next Actions

Θέλετε να συνεχίσω με:
1. **API Functions** (Pages & Menu CRUD)
2. **Admin UI** (Pages Manager & Menu Manager)
3. **Enhanced Backgrounds** (Upload + Patterns)
4. **Block Editor** (Drag & drop page builder)

Ποιο προτιμάτε να υλοποιήσουμε πρώτα;
