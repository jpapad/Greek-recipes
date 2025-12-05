"use client";

import { useState } from "react";
import { deleteRecipe } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/components/ui/toast";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface DeleteRecipeButtonProps {
    id: string;
    title: string;
}

export function DeleteRecipeButton({ id, title }: DeleteRecipeButtonProps) {
    const { t } = useTranslations();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const { showToast } = useToast();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
        // Show info toast that deletion is in progress
        showToast(t('Admin.deleting') || 'Deleting...', 'info');

        setIsDeleting(true);
        const success = await deleteRecipe(id);

        if (success) {
            showToast(t('Admin.deleted') || 'Deleted', 'success');
            setShowConfirm(false);
            router.refresh();
        } else {
            showToast(t('Admin.error') || 'Error deleting', 'error');
            setIsDeleting(false);
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
