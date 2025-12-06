'use client';

import { useEffect, useState } from 'react';
 
import { getAllMenuItems, deleteMenuItem, toggleMenuItem, createMenuItem, updateMenuItem } from '@/lib/api';
import { MenuItem } from '@/lib/types/pages';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
    Plus, Menu as MenuIcon, Trash2, Edit, Eye, EyeOff,
    GripVertical, ChevronDown, ChevronRight, Save, X
} from 'lucide-react';

export default function MenuAdminPage() {
    
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [locationFilter, setLocationFilter] = useState<string>('all');
    const [editingItem, setEditingItem] = useState<string | null>(null);
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const [formData, setFormData] = useState({
        label: '',
        url: '',
        icon: '',
        menu_location: 'main' as 'main' | 'footer' | 'mobile' | 'user-menu' | 'admin',
        parent_id: null as string | null,
        display_order: 0,
        is_active: true,
        requires_auth: false,
        requires_admin: false,
        badge_text: '',
        badge_color: '',
        target: '_self' as '_self' | '_blank',
        css_class: ''
    });

    async function loadMenuItems() {
        setLoading(true);
        const data = await getAllMenuItems();
        setMenuItems(data);
        setLoading(false);
    }

    useEffect(() => {
        loadMenuItems();
    }, []);

    async function handleDelete(id: string, label: string) {
        if (!confirm(`Διαγραφή του "${label}" και όλων των υπο-στοιχείων;`)) return;
        
        const success = await deleteMenuItem(id);
        if (success) {
            loadMenuItems();
        }
    }

    async function handleToggle(id: string, currentState: boolean) {
        const success = await toggleMenuItem(id, !currentState);
        if (success) {
            loadMenuItems();
        }
    }

    async function handleSave(item: MenuItem) {
        const success = await updateMenuItem(item.id, {
            label: item.label,
            url: item.url,
            icon: item.icon,
            display_order: item.display_order
        });
        
        if (success) {
            setEditingItem(null);
            loadMenuItems();
        }
    }

    async function handleCreate() {
        if (!formData.label || !formData.url) {
            alert('Το Label και το URL είναι υποχρεωτικά');
            return;
        }

        const menuData = {
            ...formData,
            parent_id: formData.parent_id || undefined,
        };

        const newItem = await createMenuItem(menuData);
        if (newItem) {
            setFormData({
                label: '',
                url: '',
                icon: '',
                menu_location: 'main' as 'main' | 'footer' | 'mobile' | 'user-menu' | 'admin',
                parent_id: null,
                display_order: 0,
                is_active: true,
                requires_auth: false,
                requires_admin: false,
                badge_text: '',
                badge_color: '',
                target: '_self' as '_self' | '_blank',
                css_class: ''
            });
            loadMenuItems();
        }
    }

    function toggleExpanded(id: string) {
        const newSet = new Set(expandedItems);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setExpandedItems(newSet);
    }

    const filteredItems = locationFilter === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.menu_location === locationFilter);

    const getLocationColor = (location: string) => {
        switch (location) {
            case 'main': return 'bg-blue-500';
            case 'footer': return 'bg-green-500';
            case 'mobile': return 'bg-purple-500';
            case 'user-menu': return 'bg-orange-500';
            case 'admin': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getLocationLabel = (location: string) => {
        switch (location) {
            case 'main': return 'Κύριο Menu';
            case 'footer': return 'Footer';
            case 'mobile': return 'Mobile';
            case 'user-menu': return 'User Menu';
            case 'admin': return 'Admin';
            default: return location;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Φόρτωση menu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold mb-2">🍔 Menu Manager</h1>
                    <p className="text-muted-foreground">
                        Διαχείριση πλοήγησης του website
                    </p>
                </div>
            </div>

            {/* Location Filter */}
            <GlassPanel className="p-6">
                <div className="flex flex-wrap gap-2">
                    {['all', 'main', 'footer', 'mobile', 'user-menu', 'admin'].map(loc => (
                        <Button
                            key={loc}
                            variant={locationFilter === loc ? 'default' : 'outline'}
                            onClick={() => setLocationFilter(loc)}
                            size="sm"
                        >
                            {loc === 'all' ? 'Όλα' : getLocationLabel(loc)}
                            <Badge variant="outline" className="ml-2">
                                {loc === 'all' 
                                    ? menuItems.length 
                                    : menuItems.filter(i => i.menu_location === loc).length}
                            </Badge>
                        </Button>
                    ))}
                </div>
            </GlassPanel>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Menu Items List */}
                <div className="lg:col-span-2">
                    <GlassPanel className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Στοιχεία Menu</h2>
                        
                        {filteredItems.length === 0 ? (
                            <div className="text-center py-12">
                                <MenuIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                                <p className="text-lg font-medium mb-2">Δεν βρέθηκαν στοιχεία</p>
                                <p className="text-muted-foreground">
                                    Προσθέστε το πρώτο σας στοιχείο menu
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredItems
                                    .filter(item => !item.parent_id)
                                    .sort((a, b) => a.display_order - b.display_order)
                                    .map(item => (
                                        <MenuItemRow
                                            key={item.id}
                                            item={item}
                                            allItems={filteredItems}
                                            editingItem={editingItem}
                                            setEditingItem={setEditingItem}
                                            expandedItems={expandedItems}
                                            toggleExpanded={toggleExpanded}
                                            handleToggle={handleToggle}
                                            handleDelete={handleDelete}
                                            handleSave={handleSave}
                                            getLocationColor={getLocationColor}
                                            getLocationLabel={getLocationLabel}
                                            level={0}
                                        />
                                    ))}
                            </div>
                        )}
                    </GlassPanel>
                </div>

                {/* Add New Item Form */}
                <div>
                    <GlassPanel className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Προσθήκη Στοιχείου</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="label">Label *</Label>
                                <Input
                                    id="label"
                                    value={formData.label}
                                    onChange={(e) => setFormData({...formData, label: e.target.value})}
                                    placeholder="π.χ. Αρχική"
                                />
                            </div>

                            <div>
                                <Label htmlFor="url">URL *</Label>
                                <Input
                                    id="url"
                                    value={formData.url}
                                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                                    placeholder="π.χ. /"
                                />
                            </div>

                            <div>
                                <Label htmlFor="icon">Icon (Lucide)</Label>
                                <Input
                                    id="icon"
                                    value={formData.icon}
                                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                                    placeholder="π.χ. Home"
                                />
                            </div>

                            <div>
                                <Label htmlFor="location">Τοποθεσία</Label>
                                <select
                                    id="location"
                                    value={formData.menu_location}
                                    onChange={(e) => setFormData({...formData, menu_location: e.target.value as 'main' | 'footer' | 'mobile' | 'user-menu' | 'admin'})}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-md"
                                >
                                    <option value="main">Κύριο Menu</option>
                                    <option value="footer">Footer</option>
                                    <option value="mobile">Mobile</option>
                                    <option value="user-menu">User Menu</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div>
                                <Label htmlFor="parent">Parent (για dropdown)</Label>
                                <select
                                    id="parent"
                                    value={formData.parent_id || ''}
                                    onChange={(e) => setFormData({...formData, parent_id: e.target.value || null})}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-md"
                                >
                                    <option value="">Κανένα (Top Level)</option>
                                    {menuItems
                                        .filter(i => !i.parent_id && i.menu_location === formData.menu_location)
                                        .map(i => (
                                            <option key={i.id} value={i.id}>{i.label}</option>
                                        ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="requires_auth"
                                    checked={formData.requires_auth}
                                    onChange={(e) => setFormData({...formData, requires_auth: e.target.checked})}
                                    className="w-4 h-4"
                                />
                                <Label htmlFor="requires_auth" className="cursor-pointer">
                                    Απαιτεί Login
                                </Label>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="requires_admin"
                                    checked={formData.requires_admin}
                                    onChange={(e) => setFormData({...formData, requires_admin: e.target.checked})}
                                    className="w-4 h-4"
                                />
                                <Label htmlFor="requires_admin" className="cursor-pointer">
                                    Μόνο Admin
                                </Label>
                            </div>

                            <Button onClick={handleCreate} className="w-full">
                                <Plus className="w-4 h-4 mr-2" />
                                Προσθήκη
                            </Button>
                        </div>
                    </GlassPanel>
                </div>
            </div>
        </div>
    );
}

function MenuItemRow({ 
    item, 
    allItems, 
    editingItem, 
    setEditingItem,
    expandedItems,
    toggleExpanded,
    handleToggle, 
    handleDelete, 
    handleSave,
    getLocationColor,
    getLocationLabel,
    level = 0
}: any) {
    const [editLabel, setEditLabel] = useState(item.label);
    const [editUrl, setEditUrl] = useState(item.url);
    const [editIcon, setEditIcon] = useState(item.icon || '');

    const children = allItems.filter((i: MenuItem) => i.parent_id === item.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedItems.has(item.id);

    return (
        <>
            <div
                className={`flex items-center gap-2 p-3 bg-background/50 rounded-lg border border-border hover:border-primary/50 transition-colors ${
                    level > 0 ? 'ml-8' : ''
                }`}
            >
                <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                
                {hasChildren && (
                    <button onClick={() => toggleExpanded(item.id)} className="p-1">
                        {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                        ) : (
                            <ChevronRight className="w-4 h-4" />
                        )}
                    </button>
                )}

                <div className="flex-1">
                    {editingItem === item.id ? (
                        <div className="flex gap-2">
                            <Input
                                value={editLabel}
                                onChange={(e) => setEditLabel(e.target.value)}
                                className="h-8"
                                placeholder="Label"
                            />
                            <Input
                                value={editUrl}
                                onChange={(e) => setEditUrl(e.target.value)}
                                className="h-8"
                                placeholder="URL"
                            />
                            <Input
                                value={editIcon}
                                onChange={(e) => setEditIcon(e.target.value)}
                                className="h-8 w-24"
                                placeholder="Icon"
                            />
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="font-medium">{item.label}</span>
                            <span className="text-xs text-muted-foreground">{item.url}</span>
                            <Badge className={getLocationColor(item.menu_location)}>
                                {getLocationLabel(item.menu_location)}
                            </Badge>
                            {item.requires_auth && <Badge variant="outline">Auth</Badge>}
                            {item.requires_admin && <Badge variant="outline">Admin</Badge>}
                            {!item.is_active && <Badge variant="outline">Κρυφό</Badge>}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1">
                    {editingItem === item.id ? (
                        <>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                    handleSave({ ...item, label: editLabel, url: editUrl, icon: editIcon });
                                }}
                            >
                                <Save className="w-4 h-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingItem(null)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleToggle(item.id, item.is_active)}
                            >
                                {item.is_active ? (
                                    <Eye className="w-4 h-4" />
                                ) : (
                                    <EyeOff className="w-4 h-4" />
                                )}
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                    setEditingItem(item.id);
                                    setEditLabel(item.label);
                                    setEditUrl(item.url);
                                    setEditIcon(item.icon || '');
                                }}
                            >
                                <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(item.id, item.label)}
                                className="text-red-500 hover:text-red-600"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {hasChildren && isExpanded && (
                <div>
                    {children
                        .sort((a: MenuItem, b: MenuItem) => a.display_order - b.display_order)
                        .map((child: MenuItem) => (
                            <MenuItemRow
                                key={child.id}
                                item={child}
                                allItems={allItems}
                                editingItem={editingItem}
                                setEditingItem={setEditingItem}
                                expandedItems={expandedItems}
                                toggleExpanded={toggleExpanded}
                                handleToggle={handleToggle}
                                handleDelete={handleDelete}
                                handleSave={handleSave}
                                getLocationColor={getLocationColor}
                                getLocationLabel={getLocationLabel}
                                level={level + 1}
                            />
                        ))}
                </div>
            )}
        </>
    );
}
