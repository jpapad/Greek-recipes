"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb" className="text-sm print:hidden">
            <ol className="flex items-center gap-2 flex-wrap">
                {/* Home */}
                <li>
                    <Link 
                        href="/" 
                        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        <span className="sr-only">Αρχική</span>
                    </Link>
                </li>

                {/* Dynamic items */}
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    
                    return (
                        <li key={item.href} className="flex items-center gap-2">
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            {isLast ? (
                                <span className="text-foreground font-medium" aria-current="page">
                                    {item.label}
                                </span>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
