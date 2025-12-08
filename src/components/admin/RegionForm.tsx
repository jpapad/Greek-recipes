"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRegion, updateRegion } from "@/lib/api";
import { Region, Attraction, LocalProduct } from "@/lib/types";
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
import { useTranslations } from "@/hooks/useTranslations";

interface RegionFormProps {
    region?: Region;
}

export function RegionForm({ region }: RegionFormProps) {
    const { t } = useTranslations();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFetchingCoords, setIsFetchingCoords] = useState(false);
    const [isGeneratingTouristData, setIsGeneratingTouristData] = useState(false);
    const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

    const [formData, setFormData] = useState({
        name: region?.name || "",
        slug: region?.slug || "",
        description: region?.description || "",
        image_url: region?.image_url || "",
        latitude: region?.latitude?.toString() || "",
        longitude: region?.longitude?.toString() || "",
    });

    // Tourist data states
    const [photoGallery, setPhotoGallery] = useState<string[]>(region?.photo_gallery || []);
    const [attractions, setAttractions] = useState<Attraction[]>(region?.attractions || []);
    const [howToGetThere, setHowToGetThere] = useState(region?.how_to_get_there || "");
    const [touristInfo, setTouristInfo] = useState(region?.tourist_info || "");
    const [events, setEvents] = useState<Event[]>(region?.events_festivals || []);
    const [localProducts, setLocalProducts] = useState<LocalProduct[]>(region?.local_products || []);

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

            let result = null;
            if (region?.id) {
                result = await updateRegion(region.id, data);
            } else {
                result = await createRegion(data);
            }

            if (!result) {
                // Update/create failed on the server — inform the user and do not navigate away.
                alert(t('Admin.saveFailed'));
                setIsSubmitting(false);
                return;
            }

            // Navigate to the regions list after successful save and then refresh server data.
            // Use a soft navigation first, then attempt a refresh. As a reliable fallback
            // (some client/server cache scenarios), force a full reload so the server
            // rendered page picks up the new DB row.
            await router.push("/admin/regions");
            try {
                router.refresh();
            } catch (err) {
                // ignore
            }

            // Ensure the page shows the latest server data by forcing a hard reload.
            if (typeof window !== 'undefined') {
                window.location.href = '/admin/regions';
            }
        } catch (error) {
            alert(t('Admin.error'));
            setIsSubmitting(false);
        }
    };

    const handleGetCoordinates = async () => {
        if (!formData.name) {
            alert(t('Admin.pleaseEnterName'));
            return;
        }

        setIsFetchingCoords(true);
        try {
            const response = await fetch("/api/get-coordinates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ regionName: formData.name }),
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
            alert(t('Admin.pleaseEnterName'));
            return;
        }

        setIsGeneratingDescription(true);
        try {
            const response = await fetch("/api/generate-location-description", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    locationName: formData.name,
                    locationType: "region"
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();

                if (response.status === 429) {
                    throw new Error(t('Admin.tooManyRequests'));
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
            alert(t('Admin.pleaseEnterName'));
            return;
        }

        setIsGeneratingTouristData(true);
        try {
            const response = await fetch("/api/generate-tourist-data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    locationName: formData.name,
                    locationType: "region"
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();

                // Special handling for rate limits
                if (response.status === 429) {
                    throw new Error(t('Admin.tooManyRequests'));
                }

                throw new Error(errorData.details || errorData.error || errorData.message);
            }

            const data = await response.json();

            // Track usage in localStorage
            if (data._usage) {
                try {
                    const STORAGE_KEY = "openai_usage_tracker";
                    const stored = localStorage.getItem(STORAGE_KEY);
                    const today = new Date().toISOString().split("T")[0];

                    let stats = stored ? JSON.parse(stored) : { tokensToday: 0, requestsToday: 0, lastReset: today };

                    // Reset if new day
                    if (stats.lastReset !== today) {
                        stats = { tokensToday: 0, requestsToday: 0, lastReset: today };
                    }

                    // Update stats
                    stats.tokensToday += data._usage.tokens;
                    stats.requestsToday += 1;

                    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));

                    // Trigger update event for tracker component
                    window.dispatchEvent(new Event("usage-updated"));

                    console.log(`✅ Usage tracked: +${data._usage.tokens} tokens (Total today: ${stats.tokensToday})`);
                } catch (err) {
                    console.error("Failed to track usage:", err);
                }
            }

            // Update all tourist data states
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
                    <Label htmlFor="name">{t('Admin.regionName')} *</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="slug">{t('Admin.regionSlug')} *</Label>
                    <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="description">{t('Admin.description')}</Label>
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
                    <Label htmlFor="image">{t('Admin.regionImage')}</Label>
                    <ImageUpload
                        bucket="region-images"
                        currentImage={formData.image_url}
                        onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
                    />
                </div>

                <div className="space-y-4">\n                    <div className="flex items-center justify-between">
                    <Label>{t('Admin.mapCoordinates')}</Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleGetCoordinates}
                        disabled={isFetchingCoords || !formData.name}
                    >
                        <MapPin className="w-4 h-4 mr-2" />
                        {isFetchingCoords ? t('Admin.gettingCoordinates') : t('Admin.getCoordinates')}
                    </Button>
                </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="latitude">{t('Admin.latitude')}</Label>
                            <Input
                                id="latitude"
                                type="number"
                                step="0.000001"
                                placeholder="e.g., 38.5"
                                value={formData.latitude}
                                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                            />
                            <p className="text-xs text-muted-foreground mt-1">{t('Admin.forMapPin')}</p>
                        </div>
                        <div>
                            <Label htmlFor="longitude">{t('Admin.longitude')}</Label>
                            <Input
                                id="longitude"
                                type="number"
                                step="0.000001"
                                placeholder="e.g., 23.5"
                                value={formData.longitude}
                                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                            />
                            <p className="text-xs text-muted-foreground mt-1">{t('Admin.forMapPin')}</p>
                        </div>
                    </div>
                </div>

                {/* Tourist Data Section */}
                <div className="border-t pt-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold">{t('Admin.touristData')}</h3>
                        <Button
                            type="button"
                            variant="default"
                            size="sm"
                            onClick={handleGenerateTouristData}
                            disabled={isGeneratingTouristData || !formData.name}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            {isGeneratingTouristData ? t('Admin.generatingWithAI') : t('Admin.generateWithAI')}
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
                        <Label htmlFor="how-to-get">{t('Admin.howToGet')}</Label>
                        <Textarea
                            id="how-to-get"
                            value={howToGetThere}
                            onChange={(e) => setHowToGetThere(e.target.value)}
                            rows={4}
                            placeholder={t('Admin.howToGetPlaceholder')}
                        />
                    </div>

                    <div>
                        <Label htmlFor="tourist-info">{t('Admin.touristInfo')}</Label>
                        <Textarea
                            id="tourist-info"
                            value={touristInfo}
                            onChange={(e) => setTouristInfo(e.target.value)}
                            rows={4}
                            placeholder={t('Admin.touristInfoPlaceholder')}
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
                        {isSubmitting ? t('Admin.saving') : region ? t('Admin.updateRegion') : t('Admin.createRegion')}
                    </Button>
                    <Button
                        type="button"
                        size="lg"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        {t('Admin.cancel')}
                    </Button>
                </div>
            </GlassPanel>
        </form>
    );
}
