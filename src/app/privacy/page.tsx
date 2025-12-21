import { GlassPanel } from "@/components/ui/GlassPanel";
import { getTranslations } from "next-intl/server";

export const metadata = {
    title: "Privacy Policy | Greek Recipes",
    description: "Privacy policy and data protection information for Greek Recipes platform",
};

export default async function PrivacyPage() {
    const t = await getTranslations();

    return (
        <div className="container mx-auto py-8">
            <GlassPanel className="max-w-4xl mx-auto">
                <div className="prose prose-lg max-w-none dark:prose-invert">
                    <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                        Privacy Policy
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-8">
                        Last updated: December 21, 2025
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                            1. Introduction
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300">
                            Welcome to Greek Recipes. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our Platform.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                            2. Information We Collect
                        </h2>
                        <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
                            2.1 Information You Provide
                        </h3>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                            <li><strong>Account Information:</strong> Email address, username, password (encrypted)</li>
                            <li><strong>Profile Information:</strong> Display name, profile photo, bio</li>
                            <li><strong>User Content:</strong> Recipes you submit, reviews, comments, favorites</li>
                            <li><strong>Communication:</strong> Messages you send to us or other users</li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
                            2.2 Information We Collect Automatically
                        </h3>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                            <li><strong>Usage Data:</strong> Pages visited, features used, time spent</li>
                            <li><strong>Device Information:</strong> Browser type, device type, operating system</li>
                            <li><strong>Cookies:</strong> Session cookies, preference cookies, analytics cookies</li>
                            <li><strong>IP Address:</strong> For security and analytics purposes</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                            3. How We Use Your Information
                        </h2>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                            <li><strong>Provide Services:</strong> Enable account access, save favorites, display personalized content</li>
                            <li><strong>Improve Platform:</strong> Analyze usage patterns, fix bugs, develop new features</li>
                            <li><strong>Communication:</strong> Send service updates, respond to inquiries, send newsletters (with consent)</li>
                            <li><strong>Security:</strong> Prevent fraud, ensure Platform security, enforce our terms</li>
                            <li><strong>Legal Compliance:</strong> Comply with legal obligations and protect our rights</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                            4. Data Sharing and Disclosure
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            We do not sell your personal data. We may share information in the following circumstances:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                            <li><strong>Public Content:</strong> Recipes, reviews, and profiles you make public are visible to all users</li>
                            <li><strong>Service Providers:</strong> Third-party services (hosting, analytics, email) that help operate the Platform</li>
                            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                            <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                            <li><strong>With Your Consent:</strong> When you explicitly agree to share information</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                            5. Third-Party Services
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            We use the following third-party services:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                            <li><strong>Supabase:</strong> Database and authentication (privacy policy: supabase.com/privacy)</li>
                            <li><strong>Vercel:</strong> Hosting and deployment (privacy policy: vercel.com/legal/privacy-policy)</li>
                            <li><strong>Unsplash:</strong> Recipe images (privacy policy: unsplash.com/privacy)</li>
                            <li><strong>Google Analytics:</strong> Usage analytics (optional, can be disabled)</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                            6. Cookies and Tracking
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            We use cookies to enhance your experience:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                            <li><strong>Essential Cookies:</strong> Required for authentication and basic functionality</li>
                            <li><strong>Preference Cookies:</strong> Remember your settings (theme, language)</li>
                            <li><strong>Analytics Cookies:</strong> Help us understand how you use the Platform</li>
                        </ul>
                        <p className="text-gray-700 dark:text-gray-300 mt-4">
                            You can control cookies through your browser settings, but disabling essential cookies may affect functionality.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                            7. Data Security
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300">
                            We implement appropriate security measures to protect your data, including:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mt-4">
                            <li>SSL/TLS encryption for data transmission</li>
                            <li>Encrypted password storage</li>
                            <li>Regular security audits and updates</li>
                            <li>Access controls and authentication</li>
                        </ul>
                        <p className="text-gray-700 dark:text-gray-300 mt-4">
                            However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                            8. Your Rights (GDPR Compliance)
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Under EU data protection laws, you have the following rights:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                            <li><strong>Access:</strong> Request a copy of your personal data</li>
                            <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                            <li><strong>Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
                            <li><strong>Restriction:</strong> Limit how we use your data</li>
                            <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
                            <li><strong>Object:</strong> Object to certain data processing activities</li>
                            <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing at any time</li>
                        </ul>
                        <p className="text-gray-700 dark:text-gray-300 mt-4">
                            To exercise these rights, contact us at <strong>privacy@greekrecipes.com</strong>
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                            9. Data Retention
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300">
                            We retain your personal data only as long as necessary for the purposes outlined in this policy or as required by law. When you delete your account, we will delete or anonymize your personal data within 30 days, except where we are required to retain it for legal purposes.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                            10. Children's Privacy
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300">
                            Greek Recipes is not intended for children under 13. We do not knowingly collect personal data from children. If you believe we have collected data from a child under 13, please contact us immediately.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                            11. Changes to Privacy Policy
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300">
                            We may update this privacy policy from time to time. We will notify you of significant changes by email or through a notice on the Platform. Your continued use after changes indicates acceptance of the updated policy.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                            12. Contact Us
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300">
                            For questions about this privacy policy or to exercise your data rights:
                            <br /><br />
                            <strong>Email:</strong> privacy@greekrecipes.com
                            <br />
                            <strong>Data Protection Officer:</strong> dpo@greekrecipes.com
                        </p>
                    </section>
                </div>
            </GlassPanel>
        </div>
    );
}
