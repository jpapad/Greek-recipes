"use client";

import { useState } from "react";
import { deleteRecipe } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface DeleteRecipeButtonProps {
    id: string;
    title: string;
}

export function DeleteRecipeButton({ id, title }: DeleteRecipeButtonProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) {
            return;
        }

        setIsDeleting(true);
        const success = await deleteRecipe(id);

        if (success) {
            router.refresh();
        } else {
            alert("Failed to delete recipe");
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
