"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Image as ImageIcon, Trash2, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

interface MediaFile {
    name: string;
    url: string;
    size: number;
    created_at: string;
}

export function MediaUploader({
    bucket = "media",
    onUploadComplete,
}: {
    bucket?: string;
    onUploadComplete?: () => void;
}) {
    const [uploading, setUploading] = useState(false);
    const { toast } = useToast();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);

        try {
            for (const file of Array.from(files)) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("bucket", bucket);

                const response = await fetch("/api/admin/media/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error("Upload failed");
                }
            }

            toast({
                title: "Success",
                description: `${files.length} file(s) uploaded successfully`,
                variant: "success",
            });

            onUploadComplete?.();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to upload files",
                variant: "destructive",
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Upload Media</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <div className="space-y-2">
                        <p className="text-sm font-medium">
                            Drop files here or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground">
                            PNG, JPG, GIF up to 10MB
                        </p>
                    </div>
                    <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading}
                        className="mt-4"
                    />
                    {uploading && (
                        <p className="text-sm text-muted-foreground mt-4">
                            Uploading...
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export function MediaGrid({ files }: { files: MediaFile[] }) {
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
    const { toast } = useToast();

    const copyUrl = (url: string) => {
        navigator.clipboard.writeText(url);
        setCopiedUrl(url);
        setTimeout(() => setCopiedUrl(null), 2000);

        toast({
            title: "Copied",
            description: "URL copied to clipboard",
        });
    };

    const deleteFile = async (name: string) => {
        if (!confirm("Are you sure you want to delete this file?")) return;

        try {
            const response = await fetch("/api/admin/media/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });

            if (!response.ok) throw new Error("Delete failed");

            toast({
                title: "Deleted",
                description: "File deleted successfully",
            });

            window.location.reload();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete file",
                variant: "destructive",
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Media Library ({files.length})</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {files.map((file) => (
                        <div
                            key={file.name}
                            className="group relative aspect-square rounded-lg border overflow-hidden"
                        >
                            <img
                                src={file.url}
                                alt={file.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => copyUrl(file.url)}
                                >
                                    {copiedUrl === file.url ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => deleteFile(file.name)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-2">
                                <p className="text-white text-xs truncate">
                                    {file.name}
                                </p>
                                <p className="text-white/60 text-xs">
                                    {(file.size / 1024).toFixed(1)} KB
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
