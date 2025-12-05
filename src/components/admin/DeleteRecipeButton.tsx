"use client";

import { useState } from "react";
import { deleteRecipe } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/components/ui/toast";

interface DeleteRecipeButtonProps {
    id: string;
    title: string;
}

export function DeleteRecipeButton({ id, title }: DeleteRecipeButtonProps) {
    const { t } = useTranslations();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const { showToast } = useToast();

    const handleDelete = async () => {
        if (!confirm(t('Admin.confirmDelete') + ` "${title}"?`)) {
            return;
        }

        // Show info toast that deletion is in progress
        showToast(t('Admin.deleting') || 'Deleting...', 'info');

        setIsDeleting(true);
        const success = await deleteRecipe(id);

        if (success) {
            showToast(t('Admin.deleted') || 'Deleted', 'success');
            router.refresh();
        } else {
            showToast(t('Admin.error') || 'Error deleting', 'error');
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
