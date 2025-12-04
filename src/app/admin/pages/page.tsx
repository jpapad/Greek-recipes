'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPages, deletePage, publishPage, duplicatePage, setHomepage } from '@/lib/api';
import { Page } from '@/lib/types/pages';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
    Plus, Search, Edit, Trash2, Eye, Copy, Home, 
    FileText, Clock, CheckCircle, XCircle 
} from 'lucide-react';

export default function PagesAdminPage() {
    const router = useRouter();
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        loadPages();
    }, []);

    async function loadPages() {
        setLoading(true);
        const data = await getPages();
        setPages(data);
        setLoading(false);
    }

    async function handleDelete(id: string, title: string) {
        if (!confirm(`Διαγραφή σελίδας "${title}";`)) return;
        
        const success = await deletePage(id);
        if (success) {
            setPages(pages.filter(p => p.id !== id));
        }
    }

    async function handlePublish(id: string) {
        const success = await publishPage(id);
        if (success) {
            loadPages();
        }
    }

    async function handleDuplicate(id: string) {
        const newPage = await duplicatePage(id);
        if (newPage) {
            loadPages();
        }
    }

    async function handleSetHomepage(id: string) {
        if (!confirm('Ορισμός αυτής της σελίδας ως αρχική;')) return;
        
        const success = await setHomepage(id);
        if (success) {
            loadPages();
        }
    }

    const filteredPages = pages.filter(page => {
        const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            page.slug.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published': return 'bg-green-500';
            case 'draft': return 'bg-yellow-500';
            case 'archived': return 'bg-gray-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'published': return <CheckCircle className="w-4 h-4" />;
            case 'draft': return <Clock className="w-4 h-4" />;
            case 'archived': return <XCircle className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Φόρτωση σελίδων...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold mb-2">📄 Σελίδες</h1>
                    <p className="text-muted-foreground">
                        Διαχείριση σελίδων του website
                    </p>
                </div>
                <Link href="/admin/pages/new">
                    <Button size="lg">
                        <Plus className="w-5 h-5 mr-2" />
                        Νέα Σελίδα
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <GlassPanel className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                placeholder="Αναζήτηση σελίδων..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {['all', 'published', 'draft', 'archived'].map(status => (
                            <Button
                                key={status}
                                variant={statusFilter === status ? 'default' : 'outline'}
                                onClick={() => setStatusFilter(status)}
                            >
                                {status === 'all' ? 'Όλες' : 
                                 status === 'published' ? 'Δημοσιευμένες' :
                                 status === 'draft' ? 'Πρόχειρα' : 'Αρχειοθετημένες'}
                            </Button>
                        ))}
                    </div>
                </div>
            </GlassPanel>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <GlassPanel className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-500/20 rounded-lg">
                            <FileText className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{pages.length}</p>
                            <p className="text-sm text-muted-foreground">Σύνολο</p>
                        </div>
                    </div>
                </GlassPanel>
                <GlassPanel className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-500/20 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                {pages.filter(p => p.status === 'published').length}
                            </p>
                            <p className="text-sm text-muted-foreground">Δημοσιευμένες</p>
                        </div>
                    </div>
                </GlassPanel>
                <GlassPanel className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-yellow-500/20 rounded-lg">
                            <Clock className="w-6 h-6 text-yellow-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                {pages.filter(p => p.status === 'draft').length}
                            </p>
                            <p className="text-sm text-muted-foreground">Πρόχειρα</p>
                        </div>
                    </div>
                </GlassPanel>
                <GlassPanel className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-500/20 rounded-lg">
                            <Home className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                {pages.filter(p => p.is_homepage).length}
                            </p>
                            <p className="text-sm text-muted-foreground">Αρχική</p>
                        </div>
                    </div>
                </GlassPanel>
            </div>

            {/* Pages List */}
            <GlassPanel className="p-6">
                {filteredPages.length === 0 ? (
                    <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">Δεν βρέθηκαν σελίδες</p>
                        <p className="text-muted-foreground mb-4">
                            {searchTerm ? 'Δοκιμάστε διαφορετική αναζήτηση' : 'Δημιουργήστε την πρώτη σας σελίδα'}
                        </p>
                        {!searchTerm && (
                            <Link href="/admin/pages/new">
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Δημιουργία Σελίδας
                                </Button>
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredPages.map(page => (
                            <div
                                key={page.id}
                                className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border hover:border-primary/50 transition-colors"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold">{page.title}</h3>
                                        {page.is_homepage && (
                                            <Badge variant="outline" className="bg-purple-500/20">
                                                <Home className="w-3 h-3 mr-1" />
                                                Αρχική
                                            </Badge>
                                        )}
                                        <Badge className={getStatusColor(page.status)}>
                                            {getStatusIcon(page.status)}
                                            <span className="ml-1 capitalize">{page.status}</span>
                                        </Badge>
                                        {page.display_in_menu && (
                                            <Badge variant="outline">
                                                Στο Menu
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span>/{page.slug}</span>
                                        <span>•</span>
                                        <span className="capitalize">{page.template}</span>
                                        <span>•</span>
                                        <span>{page.content.blocks.length} blocks</span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    {page.status === 'published' && (
                                        <Link href={`/${page.slug}`} target="_blank">
                                            <Button variant="ghost" size="sm">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                    )}
                                    {page.status === 'draft' && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handlePublish(page.id)}
                                        >
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Δημοσίευση
                                        </Button>
                                    )}
                                    {!page.is_homepage && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleSetHomepage(page.id)}
                                        >
                                            <Home className="w-4 h-4" />
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDuplicate(page.id)}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                    <Link href={`/admin/pages/${page.id}/edit`}>
                                        <Button variant="ghost" size="sm">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(page.id, page.title)}
                                        className="text-red-500 hover:text-red-600"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </GlassPanel>
        </div>
    );
}
