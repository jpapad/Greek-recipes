"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, UserMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth";
import { supabase } from "@/lib/supabaseClient";

interface FollowButtonProps {
    targetUserId: string;
}

export function FollowButton({ targetUserId }: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        checkFollowStatus();
    }, [targetUserId]);

    const checkFollowStatus = async () => {
        const user = await getUser();
        setCurrentUser(user);
        
        if (!user) return;

        const { data } = await supabase
            .from('user_follows')
            .select('id')
            .eq('follower_id', user.id)
            .eq('following_id', targetUserId)
            .single();

        setIsFollowing(!!data);
    };

    const handleFollow = async () => {
        if (!currentUser) {
            router.push('/login');
            return;
        }

        setLoading(true);
        try {
            if (isFollowing) {
                await supabase
                    .from('user_follows')
                    .delete()
                    .eq('follower_id', currentUser.id)
                    .eq('following_id', targetUserId);
                setIsFollowing(false);
            } else {
                await supabase
                    .from('user_follows')
                    .insert({
                        follower_id: currentUser.id,
                        following_id: targetUserId,
                    });
                setIsFollowing(true);
            }
        } catch (error) {
            console.error('Follow error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser || currentUser.id === targetUserId) {
        return null;
    }

    return (
        <Button
            onClick={handleFollow}
            disabled={loading}
            variant={isFollowing ? "outline" : "default"}
            size="sm"
        >
            {isFollowing ? (
                <>
                    <UserMinus className="w-4 h-4 mr-2" />
                    Unfollow
                </>
            ) : (
                <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Follow
                </>
            )}
        </Button>
    );
}
