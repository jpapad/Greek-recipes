"use client";

import { useState } from "react";
import { deleteRegion } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/hooks/useTranslations";

interface DeleteRegionButtonProps {
    id: string;
    name: string;
    onBeforeDelete?: () => void;
    onDeleteFailed?: () => void;
    onDeleted?: () => void;
}

export function DeleteRegionButton({ id, name, onBeforeDelete, onDeleteFailed, onDeleted }: DeleteRegionButtonProps) {
    const { t } = useTranslations();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const { showToast } = useToast();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
        showToast(t('Admin.deleting') || 'Deleting...', 'info');

        setIsDeleting(true);
        onBeforeDelete?.();
        const success = await deleteRegion(id);

        if (success) {
            showToast(t('Admin.deleted') || 'Deleted', 'success');
            setShowConfirm(false);
            if (onDeleted) {
                onDeleted?.();
            } else {
                router.refresh();
            }
        } else {
            showToast(t('Admin.error') || 'Error deleting', 'error');
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
                message={t('Admin.confirmDelete') ? `${t('Admin.confirmDelete')} "${name}"?` : `Delete "${name}"?`}
                confirmLabel={t('Admin.yes') || 'Yes'}
                cancelLabel={t('Admin.cancel') || 'Cancel'}
                isLoading={isDeleting}
                onConfirm={handleDelete}
                onCancel={() => setShowConfirm(false)}
            />
        </>
    );
}
