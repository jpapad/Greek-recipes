'use client';

import { useState } from 'react';
import { ContentBlock, BlockTemplate } from '@/lib/types/pages';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
    Plus, Trash2, GripVertical, ChevronUp, ChevronDown, Sparkles
} from 'lucide-react';

interface BlockEditorProps {
    content: { blocks: ContentBlock[] };
    onChange: (content: { blocks: ContentBlock[] }) => void;
}

const BLOCK_TEMPLATES: BlockTemplate[] = [
    { type: 'heading', icon: '📝', label: 'Επικεφαλίδα', category: 'content', defaultData: { level: 2, text: '', align: 'left' } },
    { type: 'paragraph', icon: '📄', label: 'Παράγραφος', category: 'content', defaultData: { text: '', align: 'left' } },
    { type: 'image', icon: '🖼️', label: 'Εικόνα', category: 'media', defaultData: { url: '', alt: '', align: 'center' } },
    { type: 'video', icon: '🎥', label: 'Video', category: 'media', defaultData: { url: '', provider: 'youtube' as const } },
    { type: 'code', icon: '💻', label: 'Κώδικας', category: 'content', defaultData: { code: '', language: 'typescript' } },
    { type: 'quote', icon: '💬', label: 'Quote', category: 'content', defaultData: { text: '', author: '', align: 'left' } },
    { type: 'list', icon: '📋', label: 'Λίστα', category: 'content', defaultData: { style: 'unordered' as const, items: [] } },
    { type: 'divider', icon: '➖', label: 'Διαχωριστής', category: 'layout', defaultData: { style: 'solid' as const } },
    { type: 'spacer', icon: '⬜', label: 'Κενό', category: 'layout', defaultData: { height: '2rem' } },
    { type: 'button', icon: '🔘', label: 'Κουμπί', category: 'content', defaultData: { text: 'Click me', url: '#', style: 'primary' as const } },
    { type: 'columns', icon: '📊', label: 'Στήλες', category: 'layout', defaultData: { columns: [] } },
    { type: 'hero', icon: '🎯', label: 'Hero', category: 'layout', defaultData: { title: '', subtitle: '' } },
    { type: 'home-sections', icon: '🏠', label: 'Home Sections', category: 'special', defaultData: { message: '' } },
    { type: 'contact-form', icon: '📧', label: 'Contact Form', category: 'special', defaultData: { fields: ['name', 'email', 'message'] as const } },
    { type: 'contact-info', icon: '📞', label: 'Contact Info', category: 'special', defaultData: { email: '', phone: '' } },
    { type: 'recipes-grid', icon: '🍽️', label: 'Recipes Grid', category: 'special', defaultData: { limit: 6 } },
    { type: 'regions-grid', icon: '🗺️', label: 'Regions Grid', category: 'special', defaultData: { limit: 6 } },
    { type: 'custom-html', icon: '⚙️', label: 'Custom HTML', category: 'special', defaultData: { html: '' } },
];

export default function BlockEditor({ content, onChange }: BlockEditorProps) {
    const [activeBlock, setActiveBlock] = useState<number | null>(null);
    const [showPalette, setShowPalette] = useState(false);

    function addBlock(type: ContentBlock['type']) {
        const newBlock = createDefaultBlock(type);
        const newBlocks = [...content.blocks, newBlock];
        onChange({ blocks: newBlocks });
        setActiveBlock(newBlocks.length - 1);
        setShowPalette(false);
    }

    function updateBlock(index: number, updates: any) {
        const newBlocks = [...content.blocks];
        newBlocks[index] = { 
            ...newBlocks[index], 
            data: { ...newBlocks[index].data, ...updates }
        } as ContentBlock;
        onChange({ blocks: newBlocks });
    }

    function deleteBlock(index: number) {
        const newBlocks = content.blocks.filter((_, i) => i !== index);
        onChange({ blocks: newBlocks });
        if (activeBlock === index) setActiveBlock(null);
    }

    function moveBlock(index: number, direction: 'up' | 'down') {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === content.blocks.length - 1) return;

        const newBlocks = [...content.blocks];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
        onChange({ blocks: newBlocks });
        setActiveBlock(targetIndex);
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h3 className="text-lg font-semibold">Block Editor</h3>
                    <p className="text-sm text-muted-foreground">
                        {content.blocks.length} {content.blocks.length === 1 ? 'block' : 'blocks'}
                    </p>
                </div>
                <Button onClick={() => setShowPalette(!showPalette)} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Προσθήκη Block</span>
                    <span className="sm:hidden">Block</span>
                </Button>
            </div>

            {/* Block Palette */}
            {showPalette && (
                <GlassPanel className="p-4">
                    <h4 className="font-semibold mb-3">Επιλέξτε Block Type</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        {BLOCK_TEMPLATES.map((template) => (
                            <button
                                key={template.type}
                                onClick={() => addBlock(template.type as ContentBlock['type'])}
                                className="p-3 bg-background border border-border rounded-lg hover:border-primary transition-colors text-center"
                            >
                                <div className="text-2xl mb-1">{template.icon}</div>
                                <div className="text-xs font-medium truncate">{template.label}</div>
                            </button>
                        ))}
                    </div>
                </GlassPanel>
            )}

            {/* Blocks List */}
            {content.blocks.length === 0 ? (
                <GlassPanel className="p-12 text-center">
                    <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h4 className="text-lg font-medium mb-2">Δεν υπάρχουν blocks</h4>
                    <p className="text-muted-foreground mb-4">Ξεκινήστε προσθέτοντας το πρώτο σας block</p>
                    <Button onClick={() => setShowPalette(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Προσθήκη Block
                    </Button>
                </GlassPanel>
            ) : (
                <div className="space-y-3">
                    {content.blocks.map((block, index) => (
                        <GlassPanel
                            key={index}
                            className={`p-4 ${activeBlock === index ? 'ring-2 ring-primary' : ''}`}
                        >
                            {/* Block Header */}
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                                <GripVertical className="w-4 h-4 text-muted-foreground cursor-move hidden sm:block" />
                                <div className="flex-1 flex items-center gap-2">
                                    <span className="text-lg">
                                        {BLOCK_TEMPLATES.find(t => t.type === block.type)?.icon}
                                    </span>
                                    <span className="font-medium capitalize text-sm sm:text-base">
                                        {BLOCK_TEMPLATES.find(t => t.type === block.type)?.label || block.type}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => moveBlock(index, 'up')}
                                        disabled={index === 0}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronUp className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => moveBlock(index, 'down')}
                                        disabled={index === content.blocks.length - 1}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deleteBlock(index)}
                                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Block Editor */}
                            <div 
                                onClick={() => setActiveBlock(index)}
                                className="cursor-pointer"
                            >
                                <BlockEditorContent 
                                    block={block} 
                                    onChange={(updates) => updateBlock(index, updates)}
                                />
                            </div>
                        </GlassPanel>
                    ))}
                </div>
            )}
        </div>
    );
}

function BlockEditorContent({ 
    block, 
    onChange 
}: { 
    block: ContentBlock; 
    onChange: (updates: any) => void;
}) {
    const commonInputClass = "text-sm";

    switch (block.type) {
        case 'heading':
            return (
                <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <Label className="text-xs">Επίπεδο (H1-H6)</Label>
                            <select
                                value={block.data.level}
                                onChange={(e) => onChange({ level: parseInt(e.target.value) as any })}
                                className={`w-full px-3 py-2 bg-background border border-border rounded-md ${commonInputClass}`}
                            >
                                {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>H{n}</option>)}
                            </select>
                        </div>
                        <div>
                            <Label className="text-xs">Στοίχιση</Label>
                            <select
                                value={block.data.align || 'left'}
                                onChange={(e) => onChange({ align: e.target.value as any })}
                                className={`w-full px-3 py-2 bg-background border border-border rounded-md ${commonInputClass}`}
                            >
                                <option value="left">Αριστερά</option>
                                <option value="center">Κέντρο</option>
                                <option value="right">Δεξιά</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <Label className="text-xs">Κείμενο</Label>
                        <Input
                            value={block.data.text}
                            onChange={(e) => onChange({ text: e.target.value })}
                            placeholder="Εισάγετε τον τίτλο..."
                            className={commonInputClass}
                        />
                    </div>
                </div>
            );

        case 'paragraph':
            return (
                <div className="space-y-3">
                    <div>
                        <Label className="text-xs">Κείμενο</Label>
                        <Textarea
                            value={block.data.text}
                            onChange={(e) => onChange({ text: e.target.value })}
                            placeholder="Εισάγετε την παράγραφο..."
                            rows={4}
                            className={commonInputClass}
                        />
                    </div>
                    <div>
                        <Label className="text-xs">Στοίχιση</Label>
                        <select
                            value={block.data.align || 'left'}
                            onChange={(e) => onChange({ align: e.target.value as any })}
                            className={`w-full px-3 py-2 bg-background border border-border rounded-md ${commonInputClass}`}
                        >
                            <option value="left">Αριστερά</option>
                            <option value="center">Κέντρο</option>
                            <option value="right">Δεξιά</option>
                            <option value="justify">Πλήρης</option>
                        </select>
                    </div>
                </div>
            );

        case 'image':
            return (
                <div className="space-y-3">
                    <div>
                        <Label className="text-xs">URL Εικόνας</Label>
                        <Input
                            value={block.data.url}
                            onChange={(e) => onChange({ url: e.target.value })}
                            placeholder="https://..."
                            className={commonInputClass}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <Label className="text-xs">Alt Text</Label>
                            <Input
                                value={block.data.alt}
                                onChange={(e) => onChange({ alt: e.target.value })}
                                placeholder="Περιγραφή εικόνας"
                                className={commonInputClass}
                            />
                        </div>
                        <div>
                            <Label className="text-xs">Caption</Label>
                            <Input
                                value={block.data.caption || ''}
                                onChange={(e) => onChange({ caption: e.target.value })}
                                placeholder="Λεζάντα (προαιρετικό)"
                                className={commonInputClass}
                            />
                        </div>
                    </div>
                </div>
            );

        case 'button':
            return (
                <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <Label className="text-xs">Κείμενο Κουμπιού</Label>
                            <Input
                                value={block.data.text}
                                onChange={(e) => onChange({ text: e.target.value })}
                                placeholder="π.χ. Μάθετε Περισσότερα"
                                className={commonInputClass}
                            />
                        </div>
                        <div>
                            <Label className="text-xs">URL</Label>
                            <Input
                                value={block.data.url}
                                onChange={(e) => onChange({ url: e.target.value })}
                                placeholder="/recipes"
                                className={commonInputClass}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div>
                            <Label className="text-xs">Στυλ</Label>
                            <select
                                value={block.data.style || 'primary'}
                                onChange={(e) => onChange({ style: e.target.value as any })}
                                className={`w-full px-3 py-2 bg-background border border-border rounded-md ${commonInputClass}`}
                            >
                                <option value="primary">Primary</option>
                                <option value="secondary">Secondary</option>
                                <option value="outline">Outline</option>
                            </select>
                        </div>
                        <div>
                            <Label className="text-xs">Μέγεθος</Label>
                            <select
                                value={block.data.size || 'md'}
                                onChange={(e) => onChange({ size: e.target.value as any })}
                                className={`w-full px-3 py-2 bg-background border border-border rounded-md ${commonInputClass}`}
                            >
                                <option value="sm">Small</option>
                                <option value="md">Medium</option>
                                <option value="lg">Large</option>
                            </select>
                        </div>
                        <div>
                            <Label className="text-xs">Στοίχιση</Label>
                            <select
                                value={block.data.align || 'left'}
                                onChange={(e) => onChange({ align: e.target.value as any })}
                                className={`w-full px-3 py-2 bg-background border border-border rounded-md ${commonInputClass}`}
                            >
                                <option value="left">Αριστερά</option>
                                <option value="center">Κέντρο</option>
                                <option value="right">Δεξιά</option>
                            </select>
                        </div>
                    </div>
                </div>
            );

        case 'list':
            return (
                <div className="space-y-3">
                    <div>
                        <Label className="text-xs">Τύπος Λίστας</Label>
                        <select
                            value={block.data.style}
                            onChange={(e) => onChange({ style: e.target.value as any })}
                            className={`w-full px-3 py-2 bg-background border border-border rounded-md ${commonInputClass}`}
                        >
                            <option value="unordered">Bullets (•)</option>
                            <option value="ordered">Αριθμημένη (1, 2, 3)</option>
                        </select>
                    </div>
                    <div>
                        <Label className="text-xs">Στοιχεία (ένα ανά γραμμή)</Label>
                        <Textarea
                            value={block.data.items.join('\n')}
                            onChange={(e) => onChange({ items: e.target.value.split('\n').filter(i => i.trim()) })}
                            placeholder="Στοιχείο 1&#10;Στοιχείο 2&#10;Στοιχείο 3"
                            rows={5}
                            className={commonInputClass}
                        />
                    </div>
                </div>
            );

        case 'spacer':
            return (
                <div>
                    <Label className="text-xs">Ύψος</Label>
                    <Input
                        type="text"
                        value={block.data.height}
                        onChange={(e) => onChange({ height: e.target.value })}
                        placeholder="2rem ή 50px"
                        className={commonInputClass}
                    />
                </div>
            );

        case 'divider':
            return (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                        <Label className="text-xs">Στυλ</Label>
                        <select
                            value={block.data.style || 'solid'}
                            onChange={(e) => onChange({ style: e.target.value as any })}
                            className={`w-full px-3 py-2 bg-background border border-border rounded-md ${commonInputClass}`}
                        >
                            <option value="solid">Solid</option>
                            <option value="dashed">Dashed</option>
                            <option value="dotted">Dotted</option>
                        </select>
                    </div>
                    <div>
                        <Label className="text-xs">Πλάτος</Label>
                        <select
                            value={block.data.width || '100%'}
                            onChange={(e) => onChange({ width: e.target.value })}
                            className={`w-full px-3 py-2 bg-background border border-border rounded-md ${commonInputClass}`}
                        >
                            <option value="100%">100%</option>
                            <option value="75%">75%</option>
                            <option value="50%">50%</option>
                        </select>
                    </div>
                    <div>
                        <Label className="text-xs">Χρώμα</Label>
                        <Input
                            type="color"
                            value={block.data.color || '#e5e7eb'}
                            onChange={(e) => onChange({ color: e.target.value })}
                            className={`h-10 ${commonInputClass}`}
                        />
                    </div>
                </div>
            );

        default:
            return (
                <div className="text-sm text-muted-foreground p-4 bg-muted/50 rounded">
                    ℹ️ Block type: <strong>{block.type}</strong>
                    <br />
                    Για προχωρημένες ρυθμίσεις χρησιμοποιήστε τον JSON editor
                </div>
            );
    }
}

function createDefaultBlock(type: ContentBlock['type']): ContentBlock {
    const template = BLOCK_TEMPLATES.find(t => t.type === type);
    return {
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: type as any,
        data: template?.defaultData || {}
    };
}
