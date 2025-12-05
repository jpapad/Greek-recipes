"use client";

import React from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";

interface ConfirmModalProps {
    open: boolean;
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isLoading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmModal({
    open,
    title = "Confirm",
    message = "Are you sure?",
    confirmLabel = "Yes",
    cancelLabel = "Cancel",
    isLoading = false,
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <GlassPanel className="w-full max-w-md">
                <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{message}</p>

                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
                            {cancelLabel}
                        </Button>
                        <Button onClick={onConfirm} disabled={isLoading} className="bg-destructive text-white">
                            {isLoading ? "Processing..." : confirmLabel}
                        </Button>
                    </div>
                </div>
            </GlassPanel>
        </div>
    );
}

export default ConfirmModal;
