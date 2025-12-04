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
}

export function DeleteRegionButton({ id, name }: DeleteRegionButtonProps) {
    const { t } = useTranslations();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm(t('Admin.confirmDelete') + ` "${name}"?`)) {
            return;
        }

        setIsDeleting(true);
        const success = await deleteRegion(id);

        if (success) {
            router.refresh();
        } else {
            alert(t('Admin.error'));
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
