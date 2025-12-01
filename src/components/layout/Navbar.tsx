import Link from "next/link";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "./UserMenu";
import { ShoppingListLink } from "@/components/shopping/ShoppingListLink";

export function Navbar() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6">
            <GlassPanel className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between backdrop-blur-2xl bg-white/60 border-white/40">
                <div className="flex items-center gap-2">
                    <Link href="/" className="text-2xl font-bold tracking-tight text-primary">
                        Greek<span className="text-foreground">Recipes</span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-8 font-medium text-muted-foreground">
                    <Link href="/" className="hover:text-primary transition-colors">
                        Home
                    </Link>
                    <Link href="/recipes" className="hover:text-primary transition-colors">
                        Recipes
                    </Link>
                    <Link href="/regions" className="hover:text-primary transition-colors">
                        Regions
                    </Link>
                    <Link href="/favorites" className="hover:text-primary transition-colors">
                        Favorites
                    </Link>
                    <Link href="/about" className="hover:text-primary transition-colors">
                        About
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <ShoppingListLink />
                    <UserMenu />
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/20">
                        <Search className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="md:hidden rounded-full hover:bg-white/20">
                        <Menu className="w-5 h-5" />
                    </Button>
                </div>
            </GlassPanel>
        </header>
    );
}
