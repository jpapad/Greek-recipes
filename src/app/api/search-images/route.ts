import { NextRequest, NextResponse } from "next/server";

// Free APIs - no key required!
const UNSPLASH_API = "https://api.unsplash.com/search/photos";
const PEXELS_API = "https://api.pexels.com/v1/search";

export async function POST(request: NextRequest) {
  try {
    const { query, type = "food" } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    // Use OpenAI to enhance search query for better results
    const apiKey = process.env.OPENAI_API_KEY;
    let enhancedQuery = query;
    let alternativeQueries: string[] = [];

    if (apiKey) {
      try {
        const response = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: "gpt-4o-mini", // Faster, cheaper for this task
              messages: [
                {
                  role: "system",
                  content: `You are an expert at finding the perfect stock photos for Greek recipes and Mediterranean locations. Generate 3 search queries: 1) Main English term, 2) Alternative English term, 3) Generic food/place category. Return as JSON: {"main":"...","alt":"...","generic":"..."}`
                },
                {
                  role: "user",
                  content: `Recipe/Location: "${query}"\nType: ${type}\n\nExamples:\n- Input: "Μουσακάς"\n  Output: {"main":"moussaka greek traditional","alt":"eggplant casserole mediterranean","generic":"baked casserole layers"}\n\n- Input: "Ντολμάδες"\n  Output: {"main":"dolmades stuffed grape leaves","alt":"greek stuffed vine leaves","generic":"stuffed vegetables mediterranean"}\n\n- Input: "Σαντορίνη"\n  Output: {"main":"santorini greece blue dome","alt":"cyclades greek islands white","generic":"mediterranean island architecture"}`
                }
              ],
              temperature: 0.3,
              max_tokens: 100,
              response_format: { type: "json_object" }
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const queries = JSON.parse(data.choices?.[0]?.message?.content || "{}");
          enhancedQuery = queries.main || query;
          alternativeQueries = [queries.alt, queries.generic].filter(Boolean);
          console.log(`🔍 Search strategy: Main="${enhancedQuery}", Alt=[${alternativeQueries.join(', ')}]`);
        }
      } catch (err) {
        console.warn("Failed to enhance query, using original:", err);
      }
    }

    // Search Pexels with primary and fallback queries
    const searchPromises = [
      searchPexels(enhancedQuery),
      searchUnsplash(enhancedQuery)
    ];
    
    // Add alternative searches if available
    if (alternativeQueries.length > 0) {
      searchPromises.push(searchPexels(alternativeQueries[0]));
      if (alternativeQueries[1]) {
        searchPromises.push(searchPexels(alternativeQueries[1]));
      }
    }

    const results = await Promise.allSettled(searchPromises);
    
    // Collect all successful results
    let allPhotos: any[] = [];
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.length > 0) {
        allPhotos = [...allPhotos, ...result.value];
      }
    });

    // Remove duplicates by URL
    const uniquePhotos = Array.from(
      new Map(allPhotos.map(photo => [photo.url, photo])).values()
    );

    if (uniquePhotos.length === 0) {
      // Fallback: generate direct Unsplash URLs without API
      const fallbackPhotos = generateUnsplashFallback(enhancedQuery);
      return NextResponse.json({
        query: enhancedQuery,
        total: fallbackPhotos.length,
        photos: fallbackPhotos,
        source: "fallback"
      });
    }

    // Sort by source preference (Pexels first) and return top 30
    const sortedPhotos = uniquePhotos.sort((a, b) => {
      if (a.source === 'Pexels' && b.source !== 'Pexels') return -1;
      if (a.source !== 'Pexels' && b.source === 'Pexels') return 1;
      return 0;
    });

    return NextResponse.json({
      query: enhancedQuery,
      alternatives: alternativeQueries,
      total: sortedPhotos.length,
      photos: sortedPhotos.slice(0, 30), // Return top 30 results
    });

  } catch (error: unknown) {
    console.error("Error searching images:", error);
    return NextResponse.json(
      {
        error: "Failed to search images",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

async function searchUnsplash(query: string) {
  try {
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
    
    if (!unsplashKey) {
      console.warn("UNSPLASH_ACCESS_KEY not configured, skipping Unsplash search");
      return [];
    }

    const url = `${UNSPLASH_API}?query=${encodeURIComponent(query)}&per_page=10&orientation=landscape`;
    
    const response = await fetch(url, {
      headers: {
        "Authorization": `Client-ID ${unsplashKey}`,
        "Accept-Version": "v1",
      },
    });

    if (!response.ok) {
      console.warn("Unsplash search failed:", response.status);
      return [];
    }

    const data = await response.json();
    
    return (data.results || []).map((photo: any) => ({
      id: `unsplash-${photo.id}`,
      url: photo.urls.regular,
      thumb: photo.urls.thumb,
      width: photo.width,
      height: photo.height,
      alt: photo.alt_description || query,
      photographer: photo.user.name,
      source: "Unsplash",
      download_url: photo.links.download,
    }));
  } catch (error) {
    console.warn("Unsplash search error:", error);
    return [];
  }
}

// Fallback: Generate direct Unsplash URLs using their source.unsplash.com feature
function generateUnsplashFallback(query: string) {
  const keywords = query.split(' ').slice(0, 3).join(',');
  const randomIds = Array.from({ length: 12 }, () => Math.random().toString(36).substring(7));
  
  return randomIds.map((id, index) => ({
    id: `unsplash-fallback-${id}`,
    url: `https://source.unsplash.com/1200x800/?${encodeURIComponent(keywords)}&sig=${index}`,
    thumb: `https://source.unsplash.com/400x300/?${encodeURIComponent(keywords)}&sig=${index}`,
    width: 1200,
    height: 800,
    alt: query,
    photographer: "Unsplash",
    source: "Unsplash Random",
    download_url: `https://source.unsplash.com/1600x1200/?${encodeURIComponent(keywords)}&sig=${index}`,
  }));
}

async function searchPexels(query: string) {
  try {
    const pexelsKey = process.env.PEXELS_API_KEY;
    
    if (!pexelsKey) {
      console.warn("PEXELS_API_KEY not configured, skipping Pexels search");
      return [];
    }

    const url = `${PEXELS_API}?query=${encodeURIComponent(query)}&per_page=15&orientation=landscape`;
    
    const response = await fetch(url, {
      headers: {
        "Authorization": pexelsKey,
      },
    });

    if (!response.ok) {
      console.warn("Pexels search failed:", response.status);
      return [];
    }

    const data = await response.json();
    
    return (data.photos || [])
      .filter((photo: any) => photo.width >= 1000 && photo.height >= 600) // Only HD photos
      .map((photo: any) => ({
        id: `pexels-${photo.id}`,
        url: photo.src.large2x || photo.src.large, // Higher quality
        thumb: photo.src.medium,
        width: photo.width,
        height: photo.height,
        alt: photo.alt || query,
        photographer: photo.photographer,
        source: "Pexels",
        download_url: photo.src.original,
        quality: "HD" // Mark as HD
      }));
  } catch (error) {
    console.warn("Pexels search error:", error);
    return [];
  }
}
