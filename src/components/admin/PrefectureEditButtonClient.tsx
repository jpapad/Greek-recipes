"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

export default function PrefectureEditButtonClient({ prefecture }: { prefecture: any }) {
    // Defensive id extraction (same logic as server)
    const rawId = String(prefecture?.id ?? "");
    const uuidMatch = rawId.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/);
    const safeId = uuidMatch ? uuidMatch[0] : encodeURIComponent(rawId);
    const href = `/admin/prefectures/${safeId}/edit?id=${safeId}`;

    const handleClick = (e: React.MouseEvent) => {
        try {
            const rawIdStr = String(prefecture?.id ?? '');
            const logs = {
                href,
                rawId: rawIdStr,
                safeId,
                prefectureSlug: prefecture?.slug ?? null,
                prefectureName: prefecture?.name ?? null,
            };

            // Only expand details when something looks suspicious to reduce noise.
            const suspicious = rawIdStr === 'undefined' || rawIdStr === 'null' || rawIdStr === '' || (rawIdStr && rawIdStr.indexOf('/') >= 0);

            if (suspicious) {
                console.groupCollapsed('[ADMIN DEBUG] Edit navigation (suspicious)');
                console.table(logs);
                console.trace();
                console.groupEnd();
            } else if (process.env.NODE_ENV !== 'production') {
                // In dev show a compact debug line so you can verify hrefs quickly.
                console.log('[ADMIN DEBUG] edit href ->', href, '| id ->', rawIdStr);
            }
        } catch (err) {
            console.error('[DEBUG] Error logging prefecture:', err);
        }
    };

    return (
        <Link href={href} onClick={handleClick}>
            <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
            </Button>
        </Link>
    );
}
