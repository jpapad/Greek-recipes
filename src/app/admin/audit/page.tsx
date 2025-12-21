import { requireAdminServer } from "@/lib/adminServerGuard";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export const metadata = {
    title: "Audit Log | Admin Dashboard",
    description: "View system audit log and user activity",
};

export default async function AdminAuditPage() {
    const { user } = await requireAdminServer();
    const supabase = await getSupabaseServerClient();

    // Try to fetch audit logs
    const { data: auditLogs, error } = await supabase
        .from('admin_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Audit Log
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Track all administrative actions and system events
                </p>
            </div>

            <GlassPanel>
                {error ? (
                    <div className="text-center py-12">
                        <p className="text-amber-600 dark:text-amber-400 mb-4">
                            Audit log table not configured yet
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Run the SQL migration to create the <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">admin_audit_log</code> table
                        </p>
                        <div className="mt-6 text-left bg-gray-50 dark:bg-gray-800 p-4 rounded-lg max-w-2xl mx-auto">
                            <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-x-auto">
{`-- Run in Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id TEXT,
    details JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON admin_audit_log(user_id);
CREATE INDEX idx_audit_created ON admin_audit_log(created_at DESC);
CREATE INDEX idx_audit_resource ON admin_audit_log(resource_type, resource_id);

-- RLS Policies
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit log"
ON admin_audit_log FOR SELECT
USING (public.is_admin());`}
                            </pre>
                        </div>
                    </div>
                ) : !auditLogs || auditLogs.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 dark:text-gray-400">
                            No audit entries yet
                        </p>
                        <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                            Administrative actions will be logged here
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                                        Timestamp
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                                        User
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                                        Action
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                                        Resource
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                                        Details
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {auditLogs.map((log: any) => (
                                    <tr
                                        key={log.id}
                                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                    >
                                        <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                                            {new Date(log.created_at).toLocaleString()}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                                            {log.user_id}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                                            {log.resource_type && (
                                                <div>
                                                    <div className="font-medium">{log.resource_type}</div>
                                                    {log.resource_id && (
                                                        <div className="text-xs text-gray-500 dark:text-gray-500">
                                                            {log.resource_id}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                            {log.details && (
                                                <details className="cursor-pointer">
                                                    <summary className="text-blue-600 dark:text-blue-400 hover:underline">
                                                        View
                                                    </summary>
                                                    <pre className="text-xs mt-2 bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                                                        {JSON.stringify(log.details, null, 2)}
                                                    </pre>
                                                </details>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </GlassPanel>

            {auditLogs && auditLogs.length > 0 && (
                <div className="text-center text-sm text-gray-500 dark:text-gray-500">
                    Showing last 100 entries
                </div>
            )}
        </div>
    );
}
