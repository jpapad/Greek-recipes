"use client";

import { useState } from "react";
import { deleteRegion } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface DeleteRegionButtonProps {
    id: string;
    name: string;
}

export function DeleteRegionButton({ id, name }: DeleteRegionButtonProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${name}"? This will affect all recipes in this region.`)) {
            return;
        }

        setIsDeleting(true);
        const success = await deleteRegion(id);

        if (success) {
            router.refresh();
        } else {
            alert("Failed to delete region");
            setIsDeleting(false);
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
            <Trash2 className="w-4 h-4" />
        </Button>
    );
}
