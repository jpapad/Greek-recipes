"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

export default function PrefectureEditButtonClient({ prefecture }: { prefecture: any }) {
    // Defensive id extraction (same logic as server)
    const rawId = String(prefecture?.id ?? "");
    const uuidMatch = rawId.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/);
    const safeId = uuidMatch ? uuidMatch[0] : encodeURIComponent(rawId);
    const href = `/admin/prefectures/edit?id=${safeId}`;

    return (
        <Link href={href}>
            <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
            </Button>
        </Link>
    );
}
