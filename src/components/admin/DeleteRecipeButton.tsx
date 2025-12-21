"use client";

import { useState } from "react";
import { deleteRecipe } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface DeleteRecipeButtonProps {
    id: string;
    title: string;
    onBeforeDelete?: () => void;
    onDeleteFailed?: () => void;
    onDeleted?: () => void;
}

export function DeleteRecipeButton({ id, title, onBeforeDelete, onDeleteFailed, onDeleted }: DeleteRecipeButtonProps) {
    const t = useTranslations();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const { toast } = useToast();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
        // Show info toast that deletion is in progress
        toast({ title: t('Admin.deleting') || 'Deleting...', variant: 'default' });

        setIsDeleting(true);
        // Allow parent to optimistically remove the item from UI
        onBeforeDelete?.();
        const success = await deleteRecipe(id);

        if (success) {
            toast({ title: t('Admin.deleted') || 'Deleted', variant: 'success' });
            setShowConfirm(false);
            if (onDeleted) {
                onDeleted?.();
            } else {
                router.refresh();
            }
        } else {
            toast({ title: t('Admin.error') || 'Error deleting', variant: 'destructive' });
            setIsDeleting(false);
            onDeleteFailed?.();
        }
    };

    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConfirm(true)}
                disabled={isDeleting}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
                <Trash2 className="w-4 h-4" />
            </Button>

            <ConfirmModal
                open={showConfirm}
                title={t('Admin.confirmDeleteTitle') || 'Confirm Delete'}
                message={t('Admin.confirmDelete') ? `${t('Admin.confirmDelete')} "${title}"?` : `Delete "${title}"?`}
                confirmLabel={t('Admin.yes') || 'Yes'}
                cancelLabel={t('Admin.cancel') || 'Cancel'}
                isLoading={isDeleting}
                onConfirm={handleDelete}
                onCancel={() => setShowConfirm(false)}
            />
        </>
    );
}
