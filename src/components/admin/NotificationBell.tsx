"use client";

import { Bell } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { el } from "date-fns/locale";

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string | null;
    link: string | null;
    icon: string;
    is_read: boolean;
    priority: string;
    created_at: string;
}

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        loadNotifications();
        
        // Real-time subscription
        const channel = supabase
            .channel('notifications')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'notifications',
            }, () => {
                loadNotifications();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    async function loadNotifications() {
        const { data } = await supabase
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

        if (data) {
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.is_read).length);
        }
    }

    async function markAsRead(id: string) {
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id);
        
        loadNotifications();
    }

    async function markAllAsRead() {
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('is_read', false);
        
        loadNotifications();
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex justify-between items-center">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                            className="h-6 text-xs"
                        >
                            Mark all read
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="text-center py-8 text-sm text-muted-foreground">
                            No notifications
                        </div>
                    ) : (
                        notifications.map((notif) => (
                            <DropdownMenuItem
                                key={notif.id}
                                className={`flex-col items-start p-3 cursor-pointer ${
                                    !notif.is_read ? 'bg-primary/5' : ''
                                }`}
                                onClick={() => markAsRead(notif.id)}
                                asChild
                            >
                                {notif.link ? (
                                    <Link href={notif.link}>
                                        <div className="flex items-start gap-2 w-full">
                                            <span className="text-lg">{notif.icon}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm">
                                                    {notif.title}
                                                </p>
                                                {notif.message && (
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {notif.message}
                                                    </p>
                                                )}
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {formatDistanceToNow(new Date(notif.created_at), {
                                                        addSuffix: true,
                                                        locale: el
                                                    })}
                                                </p>
                                            </div>
                                            {!notif.is_read && (
                                                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1"></div>
                                            )}
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="flex items-start gap-2 w-full">
                                        <span className="text-lg">{notif.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm">
                                                {notif.title}
                                            </p>
                                            {notif.message && (
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {notif.message}
                                                </p>
                                            )}
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {formatDistanceToNow(new Date(notif.created_at), {
                                                    addSuffix: true,
                                                    locale: el
                                                })}
                                            </p>
                                        </div>
                                        {!notif.is_read && (
                                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1"></div>
                                        )}
                                    </div>
                                )}
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/admin/notifications" className="text-center text-sm text-primary cursor-pointer">
                        View all notifications
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
