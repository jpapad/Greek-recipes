"use client";

import { useState, useRef } from "react";
import { Camera, Upload, X, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { getUser } from "@/lib/auth";
import { GlassPanel } from "@/components/ui/GlassPanel";
import Image from "next/image";

interface PhotoUploadButtonProps {
    recipeId: string;
    recipeTitle: string;
}

export function PhotoUploadButton({ recipeId, recipeTitle }: PhotoUploadButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be less than 5MB');
            return;
        }

        setError(null);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        if (!preview || !fileInputRef.current?.files?.[0]) return;

        setUploading(true);
        setError(null);

        try {
            const user = await getUser();
            if (!user) {
                setError('You must be logged in to upload photos');
                setUploading(false);
                return;
            }

            const file = fileInputRef.current.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${recipeId}-${Date.now()}.${fileExt}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('user-recipe-photos')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('user-recipe-photos')
                .getPublicUrl(fileName);

            // Save to database
            const { error: dbError } = await supabase
                .from('user_recipe_photos')
                .insert({
                    recipe_id: recipeId,
                    user_id: user.id,
                    photo_url: publicUrl
                });

            if (dbError) throw dbError;

            setUploaded(true);
            setTimeout(() => {
                setIsOpen(false);
                setPreview(null);
                setUploaded(false);
            }, 2000);

        } catch (err) {
            console.error('Upload error:', err);
            setError('Failed to upload photo. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleCancel = () => {
        setPreview(null);
        setError(null);
        setUploaded(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
            >
                <Camera className="w-4 h-4" />
                <span>I Cooked This!</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <GlassPanel className="max-w-md w-full space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold">Share Your Creation</h3>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    handleCancel();
                                }}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            Show off your version of <strong>{recipeTitle}</strong>!
                        </p>

                        {!preview ? (
                            <div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    id="photo-upload"
                                />
                                <label
                                    htmlFor="photo-upload"
                                    className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary transition-colors"
                                >
                                    <Upload className="w-12 h-12 text-muted-foreground" />
                                    <div className="text-center">
                                        <p className="font-medium">Choose a photo</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            PNG, JPG up to 5MB
                                        </p>
                                    </div>
                                </label>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="relative aspect-video rounded-xl overflow-hidden">
                                    <Image
                                        src={preview}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {uploaded ? (
                                    <div className="flex items-center justify-center gap-2 text-green-500 py-3">
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="font-medium">Photo uploaded successfully!</span>
                                    </div>
                                ) : (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleCancel}
                                            disabled={uploading}
                                            className="flex-1 px-4 py-2 border border-border rounded-full hover:bg-muted transition-colors disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleUpload}
                                            disabled={uploading}
                                            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
                                        >
                                            {uploading ? 'Uploading...' : 'Upload Photo'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {error && (
                            <p className="text-sm text-red-500 text-center">{error}</p>
                        )}
                    </GlassPanel>
                </div>
            )}
        </>
    );
}
