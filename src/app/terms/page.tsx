import { GlassPanel } from "@/components/ui/GlassPanel";
import { getTranslations } from "next-intl/server";

export const metadata = {
    title: "Terms of Service | Greek Recipes",
    description: "Terms of service and usage guidelines for Greek Recipes platform",
};

export default async function TermsPage() {
    const t = await getTranslations();

    return (
        <div className="container mx-auto py-8">
            <GlassPanel className="max-w-4xl mx-auto">
                <div className="prose prose-lg max-w-none dark:prose-invert">
                    <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                        Terms of Service
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-8">
                        Last updated: December 21, 2025
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                            1. Acceptance of Terms
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300">
                            By accessing and using Greek Recipes ("the Platform"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use the Platform.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                            2. Use of Service
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Greek Recipes provides a platform for discovering, sharing, and preserving authentic Greek recipes and culinary traditions. You agree to use the Platform only for lawful purposes and in accordance with these Terms.
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                            <li>You must be at least 13 years old to use this Platform</li>
                            <li>You are responsible for maintaining the confidentiality of your account</li>
                            <li>You agree not to misuse or abuse the Platform's features</li>
                            <li>You will not post offensive, harmful, or inappropriate content</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                            3. User Content
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            When you submit recipes, reviews, or other content to the Platform:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                            <li>You retain ownership of your content</li>
                            <li>You grant Greek Recipes a non-exclusive license to use, display, and distribute your content</li>
                            <li>You represent that you have the right to share the content</li>
                            <li>You agree not to post copyrighted material without permission</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                            4. Recipe Information
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300">
                            While we strive to provide accurate and authentic recipes, Greek Recipes does not guarantee the accuracy, completeness, or reliability of any recipe content. Users follow recipes at their own risk and should exercise their own judgment regarding dietary restrictions, allergies, and food safety.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                            5. Intellectual Property
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300">
                            The Platform's design, logo, graphics, and original content are protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without express written permission.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                            6. Prohibited Activities
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            You agree not to:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                            <li>Use automated systems to access the Platform without permission</li>
                            <li>Attempt to interfere with the Platform's functionality</li>
                            <li>Impersonate other users or entities</li>
                            <li>Collect user information without consent</li>
                            <li>Post spam, malware, or malicious content</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                            7. Limitation of Liability
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300">
                            Greek Recipes is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the Platform, including but not limited to dietary issues, food allergies, or cooking accidents.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                            8. Termination
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300">
                            We reserve the right to terminate or suspend your account and access to the Platform at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to the Platform or other users.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                            9. Changes to Terms
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300">
                            We may modify these Terms at any time. Continued use of the Platform after changes constitutes acceptance of the modified Terms. We will notify users of significant changes via email or Platform notification.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                            10. Contact Information
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300">
                            For questions about these Terms, please contact us at:
                            <br />
                            <strong>Email:</strong> info@greekrecipes.com
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                            11. Governing Law
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300">
                            These Terms shall be governed by and construed in accordance with the laws of Greece, without regard to its conflict of law provisions.
                        </p>
                    </section>
                </div>
            </GlassPanel>
        </div>
    );
}
