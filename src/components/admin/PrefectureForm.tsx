"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPrefecture, updatePrefecture, getRegions } from "@/lib/api";
import { Prefecture, Region, Attraction, LocalProduct } from "@/lib/types";
import type { Event } from "@/lib/types";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Save, MapPin, Sparkles } from "lucide-react";
import PhotoGalleryManager from "./PhotoGalleryManager";
import AttractionsManager from "./AttractionsManager";
import EventsManager from "./EventsManager";
import LocalProductsManager from "./LocalProductsManager";

interface PrefectureFormProps {
    prefecture?: Prefecture;
}

export function PrefectureForm({ prefecture }: PrefectureFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFetchingCoords, setIsFetchingCoords] = useState(false);
    const [isGeneratingTouristData, setIsGeneratingTouristData] = useState(false);
    const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
    const [regions, setRegions] = useState<Region[]>([]);

    const [formData, setFormData] = useState({
        name: prefecture?.name || "",
        slug: prefecture?.slug || "",
        region_id: prefecture?.region_id || "",
        description: prefecture?.description || "",
        image_url: prefecture?.image_url || "",
        latitude: prefecture?.latitude?.toString() || "",
        longitude: prefecture?.longitude?.toString() || "",
    });

    // Tourist data states
    const [photoGallery, setPhotoGallery] = useState<string[]>(prefecture?.photo_gallery || []);
    const [attractions, setAttractions] = useState<Attraction[]>(prefecture?.attractions || []);
    const [howToGetThere, setHowToGetThere] = useState(prefecture?.how_to_get_there || "");
    const [touristInfo, setTouristInfo] = useState(prefecture?.tourist_info || "");
    const [events, setEvents] = useState<Event[]>(prefecture?.events_festivals || []);
    const [localProducts, setLocalProducts] = useState<LocalProduct[]>(prefecture?.local_products || []);

    useEffect(() => {
        async function loadRegions() {
            const data = await getRegions();
            setRegions(data);
        }
        loadRegions();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const data = {
                ...formData,
                latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
                longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
                photo_gallery: photoGallery,
                attractions,
                how_to_get_there: howToGetThere,
                tourist_info: touristInfo,
                events_festivals: events,
                local_products: localProducts,
            };

            if (prefecture?.id) {
                await updatePrefecture(prefecture.id, data);
            } else {
                await createPrefecture(data);
            }
            router.push("/admin/prefectures");
            router.refresh();
        } catch (error) {
            alert("Failed to save prefecture");
            setIsSubmitting(false);
        }
    };

    const handleGetCoordinates = async () => {
        if (!formData.name) {
            alert("Please enter a prefecture name first");
            return;
        }

        setIsFetchingCoords(true);
        try {
            // Find selected region to provide context
            const selectedRegion = regions.find(r => r.id === formData.region_id);
            const parentName = selectedRegion?.name;

            const response = await fetch("/api/get-coordinates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    regionName: formData.name,
                    parentName: parentName // Send region name for context
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch coordinates");
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.details || data.error);
            }

            setFormData({
                ...formData,
                latitude: data.latitude.toString(),
                longitude: data.longitude.toString(),
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error";
            alert(`Failed to get coordinates: ${message}`);
            console.error("Coordinates error:", error);
        } finally {
            setIsFetchingCoords(false);
        }
    };

    const handleGenerateDescription = async () => {
        if (!formData.name) {
            alert("Παρακαλώ εισάγετε πρώτα το όνομα του νομού");
            return;
        }

        setIsGeneratingDescription(true);
        try {
            const response = await fetch("/api/generate-location-description", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    locationName: formData.name,
                    locationType: "prefecture"
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();

                if (response.status === 429) {
                    throw new Error("Πάρα πολλές αιτήσεις. Παρακαλώ περιμένετε 1 λεπτό.");
                }

                throw new Error(errorData.details || errorData.error || errorData.message);
            }

            const data = await response.json();

            if (data.description) {
                setFormData({ ...formData, description: data.description });
            }

            // Track usage
            if (data._usage) {
                try {
                    const STORAGE_KEY = "openai_usage_tracker";
                    const stored = localStorage.getItem(STORAGE_KEY);
                    const today = new Date().toISOString().split("T")[0];

                    let stats = stored ? JSON.parse(stored) : { tokensToday: 0, requestsToday: 0, lastReset: today };

                    if (stats.lastReset !== today) {
                        stats = { tokensToday: 0, requestsToday: 0, lastReset: today };
                    }

                    stats.tokensToday += data._usage.tokens;
                    stats.requestsToday += 1;

                    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
                    window.dispatchEvent(new Event("usage-updated"));

                    console.log(`✅ Description generated: +${data._usage.tokens} tokens`);
                } catch (err) {
                    console.error("Failed to track usage:", err);
                }
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error";
            alert(`Αποτυχία δημιουργίας περιγραφής: ${message}`);
            console.error("Description generation error:", error);
        } finally {
            setIsGeneratingDescription(false);
        }
    };

    const handleGenerateTouristData = async () => {
        if (!formData.name) {
            alert("Παρακαλώ εισάγετε πρώτα το όνομα του νομού");
            return;
        }

        setIsGeneratingTouristData(true);
        try {
            const response = await fetch("/api/generate-tourist-data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    locationName: formData.name,
                    locationType: "prefecture"
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || errorData.error);
            }

            const data = await response.json();

            // Track usage in localStorage
            if (data._usage) {
                try {
                    const STORAGE_KEY = "openai_usage_tracker";
                    const stored = localStorage.getItem(STORAGE_KEY);
                    const today = new Date().toISOString().split("T")[0];

                    let stats = stored ? JSON.parse(stored) : { tokensToday: 0, requestsToday: 0, lastReset: today };

                    if (stats.lastReset !== today) {
                        stats = { tokensToday: 0, requestsToday: 0, lastReset: today };
                    }

                    stats.tokensToday += data._usage.tokens;
                    stats.requestsToday += 1;

                    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
                    window.dispatchEvent(new Event("usage-updated"));

                    console.log(`✅ Usage tracked: +${data._usage.tokens} tokens (Total today: ${stats.tokensToday})`);
                } catch (err) {
                    console.error("Failed to track usage:", err);
                }
            }

            if (data.photo_gallery && Array.isArray(data.photo_gallery)) {
                setPhotoGallery(data.photo_gallery);
            }
            if (data.attractions && Array.isArray(data.attractions)) {
                setAttractions(data.attractions);
            }
            if (data.how_to_get_there) {
                setHowToGetThere(data.how_to_get_there);
            }
            if (data.tourist_info) {
                setTouristInfo(data.tourist_info);
            }
            if (data.events_festivals && Array.isArray(data.events_festivals)) {
                setEvents(data.events_festivals);
            }
            if (data.local_products && Array.isArray(data.local_products)) {
                setLocalProducts(data.local_products);
            }

            alert("Τα τουριστικά δεδομένα δημιουργήθηκαν επιτυχώς με AI!");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error";
            alert(`Αποτυχία δημιουργίας τουριστικών δεδομένων: ${message}`);
            console.error("Tourist data generation error:", error);
        } finally {
            setIsGeneratingTouristData(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <GlassPanel className="p-8 space-y-6 max-w-2xl">
                <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="region">Region *</Label>
                    <select
                        id="region"
                        value={formData.region_id}
                        onChange={(e) => setFormData({ ...formData, region_id: e.target.value })}
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="">Select a region</option>
                        {regions.map((region) => (
                            <option key={region.id} value={region.id}>
                                {region.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="description">Description</Label>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleGenerateDescription}
                            disabled={isGeneratingDescription || !formData.name}
                            className="text-purple-600 border-purple-300 hover:bg-purple-50"
                        >
                            <Sparkles className="w-3 h-3 mr-1" />
                            {isGeneratingDescription ? 'Δημιουργία...' : 'AI Περιγραφή'}
                        </Button>
                    </div>
                    <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                    />
                </div>

                <div>
                    <Label htmlFor="image">Prefecture Image</Label>
                    <ImageUpload
                        bucket="prefecture-images"
                        currentImage={formData.image_url}
                        onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label>Map Coordinates</Label>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleGetCoordinates}
                            disabled={isFetchingCoords || !formData.name}
                        >
                            <MapPin className="w-4 h-4 mr-2" />
                            {isFetchingCoords ? "Getting coordinates..." : "Get with AI"}
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="latitude">Latitude</Label>
                            <Input
                                id="latitude"
                                type="number"
                                step="0.000001"
                                placeholder="e.g., 38.5"
                                value={formData.latitude}
                                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                            />
                            <p className="text-xs text-muted-foreground mt-1">For map pin placement</p>
                        </div>
                        <div>
                            <Label htmlFor="longitude">Longitude</Label>
                            <Input
                                id="longitude"
                                type="number"
                                step="0.000001"
                                placeholder="e.g., 23.5"
                                value={formData.longitude}
                                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                            />
                            <p className="text-xs text-muted-foreground mt-1">For map pin placement</p>
                        </div>
                    </div>
                </div>

                {/* Tourist Data Section */}
                <div className="border-t pt-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold">Τουριστικά Δεδομένα</h3>
                        <Button
                            type="button"
                            variant="default"
                            size="sm"
                            onClick={handleGenerateTouristData}
                            disabled={isGeneratingTouristData || !formData.name}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            {isGeneratingTouristData ? "Δημιουργία με AI..." : "Δημιουργία με AI"}
                        </Button>
                    </div>

                    <PhotoGalleryManager
                        photos={photoGallery}
                        onChange={setPhotoGallery}
                    />

                    <AttractionsManager
                        attractions={attractions}
                        onChange={setAttractions}
                    />

                    <div>
                        <Label htmlFor="how-to-get">Πώς να φτάσετε</Label>
                        <Textarea
                            id="how-to-get"
                            value={howToGetThere}
                            onChange={(e) => setHowToGetThere(e.target.value)}
                            rows={4}
                            placeholder="Περιγράψτε πώς μπορεί κάποιος να φτάσει στον νομό..."
                        />
                    </div>

                    <div>
                        <Label htmlFor="tourist-info">Γενικές Τουριστικές Πληροφορίες</Label>
                        <Textarea
                            id="tourist-info"
                            value={touristInfo}
                            onChange={(e) => setTouristInfo(e.target.value)}
                            rows={4}
                            placeholder="Γενικές πληροφορίες και συμβουλές για επισκέπτες..."
                        />
                    </div>

                    <EventsManager
                        events={events}
                        onChange={setEvents}
                    />

                    <LocalProductsManager
                        products={localProducts}
                        onChange={setLocalProducts}
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <Button type="submit" size="lg" disabled={isSubmitting}>
                        <Save className="w-5 h-5 mr-2" />
                        {isSubmitting ? "Saving..." : prefecture ? "Update Prefecture" : "Create Prefecture"}
                    </Button>
                    <Button
                        type="button"
                        size="lg"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                </div>
            </GlassPanel>
        </form>
    );
}
