"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    className?: string;
}

export function SearchBar({ onSearch, placeholder = "Search recipes...", className }: SearchBarProps) {
    const [value, setValue] = useState("");
    const debouncedValue = useDebounce(value, 500);

    useEffect(() => {
        onSearch(debouncedValue);
    }, [debouncedValue, onSearch]);

    return (
        <div className={`relative ${className}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="pl-9 bg-white/60 backdrop-blur-sm border-white/20 focus:bg-white/80 transition-all"
                placeholder={placeholder}
            />
        </div>
    );
}
