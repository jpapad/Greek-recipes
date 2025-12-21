import { requireAdminServer } from "@/lib/adminServerGuard";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Globe, Image as ImageIcon, Share2 } from "lucide-react";

export const metadata = {
    title: "SEO Tools | Admin Dashboard",
    description: "SEO optimization tools and meta tags",
};

async function getSEOSettings() {
    const supabase = await getSupabaseServerClient();
    
    const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('setting_group', 'seo')
        .single();

    return { seo: data?.value || {}, error };
}

export default async function SEOToolsPage() {
    const { user } = await requireAdminServer();
    const { seo } = await getSEOSettings();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    SEO Tools
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Optimize your site for search engines
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">~150</div>
                        <p className="text-xs text-muted-foreground">Indexed pages</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Sitemap</CardTitle>
                        <Globe className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">✓</div>
                        <p className="text-xs text-muted-foreground">Auto-generated</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Meta Images</CardTitle>
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">OG</div>
                        <p className="text-xs text-muted-foreground">Configured</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Social</CardTitle>
                        <Share2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">Platforms</p>
                    </CardContent>
                </Card>
            </div>

            <GlassPanel>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Global Meta Tags
                </h2>
                <div className="space-y-6">
                    <div>
                        <Label htmlFor="siteTitle">Site Title</Label>
                        <Input
                            id="siteTitle"
                            defaultValue={seo.siteTitle || "Greek Recipes"}
                            placeholder="Your site title"
                            className="mt-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Shown in browser tabs and search results
                        </p>
                    </div>

                    <div>
                        <Label htmlFor="siteDescription">Site Description</Label>
                        <Textarea
                            id="siteDescription"
                            defaultValue={seo.siteDescription || "Discover authentic Greek recipes"}
                            placeholder="Brief description of your site"
                            rows={3}
                            className="mt-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Meta description for search engines (150-160 characters)
                        </p>
                    </div>

                    <div>
                        <Label htmlFor="keywords">Keywords</Label>
                        <Input
                            id="keywords"
                            defaultValue={seo.siteKeywords || "greek recipes, mediterranean food"}
                            placeholder="keyword1, keyword2, keyword3"
                            className="mt-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Comma-separated keywords (optional, less important nowadays)
                        </p>
                    </div>

                    <div>
                        <Label htmlFor="ogImage">OG Image URL</Label>
                        <Input
                            id="ogImage"
                            defaultValue={seo.ogImage || "/og-image.jpg"}
                            placeholder="/images/og-image.jpg"
                            className="mt-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Default social media preview image (1200x630px recommended)
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="twitterHandle">Twitter Handle</Label>
                            <Input
                                id="twitterHandle"
                                defaultValue={seo.twitterHandle || "@greekrecipes"}
                                placeholder="@yourusername"
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <Label htmlFor="favicon">Favicon Path</Label>
                            <Input
                                id="favicon"
                                defaultValue={seo.favicon || "/favicon.ico"}
                                placeholder="/favicon.ico"
                                className="mt-2"
                            />
                        </div>
                    </div>
                </div>
            </GlassPanel>

            <GlassPanel>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    SEO Quick Actions
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                    <Button variant="outline" className="justify-start">
                        <Globe className="h-4 w-4 mr-2" />
                        Generate Sitemap
                    </Button>
                    <Button variant="outline" className="justify-start">
                        <FileText className="h-4 w-4 mr-2" />
                        Generate robots.txt
                    </Button>
                    <Button variant="outline" className="justify-start">
                        <Share2 className="h-4 w-4 mr-2" />
                        Test Social Previews
                    </Button>
                    <Button variant="outline" className="justify-start">
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Validate Structured Data
                    </Button>
                </div>
            </GlassPanel>

            <GlassPanel>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    SEO Best Practices
                </h2>
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <p>Each recipe should have unique title and description</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <p>Images should have alt text describing the dish</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <p>Use structured data (Schema.org Recipe format)</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <p>Keep page load times under 3 seconds</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <p>Mobile-responsive design is essential</p>
                    </div>
                </div>
            </GlassPanel>

            <div className="flex justify-end gap-3">
                <Button variant="outline">
                    Reset to Defaults
                </Button>
                <Button>
                    Save SEO Settings
                </Button>
            </div>
        </div>
    );
}
