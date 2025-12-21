import { requireAdminServer } from "@/lib/adminServerGuard";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, ShieldOff } from "lucide-react";
import { ToggleAdminButton } from "@/components/admin/ToggleAdminButton";

interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    is_admin: boolean;
    created_at: string;
}

async function getUsers(): Promise<Profile[]> {
    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching users:", error);
        return [];
    }

    return data || [];
}

export default async function UsersPage() {
    const { user: currentUser } = await requireAdminServer();
    const users = await getUsers();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                <p className="text-muted-foreground mt-1">
                    Manage user roles and permissions
                </p>
            </div>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Users ({users.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => {
                                    const isSelf = user.id === currentUser.id;

                                    return (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">
                                                {user.email}
                                                {isSelf && (
                                                    <Badge
                                                        variant="outline"
                                                        className="ml-2"
                                                    >
                                                        You
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {user.full_name || "-"}
                                            </TableCell>
                                            <TableCell>
                                                {user.is_admin ? (
                                                    <Badge className="gap-1">
                                                        <Shield className="h-3 w-3" />
                                                        Admin
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">User</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    user.created_at
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <ToggleAdminButton
                                                    userId={user.id}
                                                    currentlyAdmin={user.is_admin}
                                                    isSelf={isSelf}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Warning */}
            <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                    <div className="flex gap-3">
                        <ShieldOff className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-yellow-900">
                                Admin Access Warning
                            </p>
                            <p className="text-sm text-yellow-800">
                                Be careful when granting admin access. Admins can modify
                                all content and manage other users. You cannot remove
                                admin access from yourself to prevent accidental lockout.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
