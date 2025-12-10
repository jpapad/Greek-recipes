"use client";

import dynamic from "next/dynamic";

interface MapExplorerClientProps {
    initialRegionId?: string;
}

const MapExplorerInner = dynamic(
    () => import("./MapExplorer").then((m) => m.MapExplorer),
    {
        ssr: false,
    },
);

export function MapExplorerClient(props: MapExplorerClientProps) {
    return <MapExplorerInner {...props} />;
}
