"use client";

import dynamic from "next/dynamic";

const MapExplorerInner = dynamic(
    () => import("./MapExplorer").then((mod) => mod.MapExplorer),
    { ssr: false }
);

export function MapExplorerClient() {
    return <MapExplorerInner />;
}
