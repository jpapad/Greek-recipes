"use client";

import { Button } from "@/components/ui/button";
import { Shield, ShieldOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface ToggleAdminButtonProps {
    userId: string;
    currentlyAdmin: boolean;
    isSelf: boolean;
}

export function ToggleAdminButton({
    userId,
    currentlyAdmin,
    isSelf,
}: ToggleAdminButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleToggle = async () => {
        if (isSelf && currentlyAdmin) {
            toast({
                title: "Cannot remove own admin access",
                description:
                    "You cannot remove admin access from yourself to prevent accidental lockout.",
                variant: "destructive",
            });
            return;
        }

        const action = currentlyAdmin ? "remove" : "grant";
        const confirmed = confirm(
            `Are you sure you want to ${action} admin access for this user?`
        );

        if (!confirmed) return;

        setLoading(true);

        try {
            const response = await fetch("/api/admin/users/toggle-admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    isAdmin: !currentlyAdmin,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update user");
            }

            toast({
                title: "Success",
                description: `Admin access ${currentlyAdmin ? "removed" : "granted"} successfully`,
                variant: "success",
            });

            router.refresh();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update user role",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant={currentlyAdmin ? "outline" : "default"}
            size="sm"
            onClick={handleToggle}
            disabled={loading || (isSelf && currentlyAdmin)}
        >
            {currentlyAdmin ? (
                <>
                    <ShieldOff className="mr-2 h-4 w-4" />
                    Remove Admin
                </>
            ) : (
                <>
                    <Shield className="mr-2 h-4 w-4" />
                    Make Admin
                </>
            )}
        </Button>
    );
}
