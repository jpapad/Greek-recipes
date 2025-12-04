'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { getUser } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';
import { Save } from 'lucide-react';

export default function EditProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        display_name: '',
        bio: '',
        avatar_url: '',
        location: '',
        website: '',
        twitter_handle: '',
        instagram_handle: ''
    });

    useEffect(() => {
        async function loadProfile() {
            const currentUser = await getUser();
            if (!currentUser) {
                router.push('/login');
                return;
            }

            setUser(currentUser);

            const { data } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', currentUser.id)
                .single();

            if (data) {
                setFormData({
                    display_name: data.display_name || '',
                    bio: data.bio || '',
                    avatar_url: data.avatar_url || '',
                    location: data.location || '',
                    website: data.website || '',
                    twitter_handle: data.twitter_handle || '',
                    instagram_handle: data.instagram_handle || ''
                });
            }

            setLoading(false);
        }

        loadProfile();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const { error } = await supabase
                .from('user_profiles')
                .upsert({
                    user_id: user.id,
                    ...formData,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;

            router.push(`/profile/${user.id}`);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <GlassPanel className="h-96 animate-pulse" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <GlassPanel className="p-8">
                <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label>Profile Picture</Label>
                        <ImageUpload
                            bucket="user-avatars"
                            currentImage={formData.avatar_url}
                            onImageUploaded={(url) => setFormData({ ...formData, avatar_url: url })}
                        />
                    </div>

                    <div>
                        <Label htmlFor="display_name">Display Name</Label>
                        <Input
                            id="display_name"
                            value={formData.display_name}
                            onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                            placeholder="Your name"
                        />
                    </div>

                    <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Tell us about yourself..."
                            rows={4}
                        />
                    </div>

                    <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="e.g., Athens, Greece"
                        />
                    </div>

                    <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                            id="website"
                            type="url"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            placeholder="https://yourwebsite.com"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="twitter">Twitter Handle</Label>
                            <Input
                                id="twitter"
                                value={formData.twitter_handle}
                                onChange={(e) => setFormData({ ...formData, twitter_handle: e.target.value })}
                                placeholder="username"
                            />
                        </div>
                        <div>
                            <Label htmlFor="instagram">Instagram Handle</Label>
                            <Input
                                id="instagram"
                                value={formData.instagram_handle}
                                onChange={(e) => setFormData({ ...formData, instagram_handle: e.target.value })}
                                placeholder="username"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button type="submit" disabled={saving} className="gap-2">
                            <Save className="w-4 h-4" />
                            {saving ? 'Saving...' : 'Save Profile'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </GlassPanel>
        </div>
    );
}
