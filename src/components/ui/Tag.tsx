import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagProps {
    label: string;
    active?: boolean;
    onClick?: () => void;
    className?: string;
}

export function Tag({ label, active, onClick, className }: TagProps) {
    return (
        <Badge
            onClick={onClick}
            variant={active ? "default" : "outline"}
            className={cn(
                "cursor-pointer px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                active
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-white/40 hover:bg-white/60 text-foreground border-white/40 backdrop-blur-sm",
                className
            )}
        >
            {label}
        </Badge>
    );
}
