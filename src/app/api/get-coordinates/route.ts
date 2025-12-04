import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { regionName } = await request.json();

        if (!regionName) {
            return NextResponse.json(
                { error: "Region name is required" },
                { status: 400 }
            );
        }

        // Use Nominatim (OpenStreetMap) geocoding API - free and reliable
        const searchQuery = `${regionName}, Greece`;
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Greek-Recipes-App/1.0'
            }
        });

        if (!response.ok) {
            throw new Error("Geocoding service unavailable");
        }

        const data = await response.json();

        if (!data || data.length === 0) {
            return NextResponse.json(
                { error: "Location not found" },
                { status: 404 }
            );
        }

        const latitude = parseFloat(data[0].lat);
        const longitude = parseFloat(data[0].lon);

        return NextResponse.json({
            latitude,
            longitude,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error("Error fetching coordinates:", errorMessage);
        console.error("Full error:", error);
        return NextResponse.json(
            { error: "Failed to fetch coordinates", details: errorMessage },
            { status: 500 }
        );
    }
}
