"use client";

import { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, Link as LinkIcon } from "lucide-react";

interface ImageUploadProps {
    onUpload: (imageUrl: string) => void;
}

export function ImageUpload({ onUpload }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [useUrl, setUseUrl] = useState(false);
    const [url, setUrl] = useState('');

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            // TODO: Upload to Supabase Storage
            // const { data, error } = await supabase.storage
            //     .from('recipe-images')
            //     .upload(`${Date.now()}-${file.name}`, file);
            
            // if (error) throw error;
            // const url = supabase.storage.from('recipe-images').getPublicUrl(data.path).data.publicUrl;
            
            // For now, use a placeholder
            const mockUrl = URL.createObjectURL(file);
            onUpload(mockUrl);
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleUrlSubmit = () => {
        if (url.trim()) {
            onUpload(url.trim());
            setUrl('');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Button
                    type="button"
                    variant={!useUrl ? "default" : "outline"}
                    onClick={() => setUseUrl(false)}
                    size="sm"
                >
                    <Upload className="w-4 h-4 mr-2" />
                    Ανέβασμα
                </Button>
                <Button
                    type="button"
                    variant={useUrl ? "default" : "outline"}
                    onClick={() => setUseUrl(true)}
                    size="sm"
                >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    URL
                </Button>
            </div>

            {!useUrl ? (
                <div>
                    <Label htmlFor="image-upload">Επιλογή Εικόνας</Label>
                    <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                    />
                </div>
            ) : (
                <div className="flex gap-2">
                    <Input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        disabled={uploading}
                    />
                    <Button
                        type="button"
                        onClick={handleUrlSubmit}
                        disabled={!url.trim() || uploading}
                    >
                        Προσθήκη
                    </Button>
                </div>
            )}
        </div>
    );
}
