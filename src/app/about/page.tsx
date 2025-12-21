import { GlassPanel } from "@/components/ui/GlassPanel";
import { getTranslations } from "next-intl/server";
import { Heart, Users, Book, Globe } from "lucide-react";

export const metadata = {
    title: "About Us | Greek Recipes",
    description: "Learn about Greek Recipes - preserving and sharing authentic Greek culinary traditions",
};

export default async function AboutPage() {
    const t = await getTranslations();

    return (
        <div className="container mx-auto py-8">
            <GlassPanel className="max-w-4xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                        About Greek Recipes
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                        Preserving and sharing the rich culinary heritage of Greece, one recipe at a time.
                    </p>
                </div>

                <section className="mb-10">
                    <h2 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-white">
                        Our Mission
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        Greek Recipes is dedicated to preserving and celebrating the authentic flavors, traditions, and stories behind Greek cuisine. We believe that food is more than sustenance—it's a connection to our heritage, a way to bring people together, and a means of passing down cultural wisdom through generations.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Our platform serves as a digital home for traditional Greek recipes, regional specialties, and the culinary wisdom passed down through families for centuries. We're committed to maintaining authenticity while making these treasured recipes accessible to food lovers worldwide.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">
                        What We Offer
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Book className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                                    Authentic Recipes
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Carefully curated collection of traditional Greek recipes from all regions, tested and verified for authenticity.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Globe className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                                    Regional Diversity
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Explore the unique culinary traditions of each Greek region, from the islands to the mountains.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Users className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                                    Community Driven
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Share your family recipes, connect with other food enthusiasts, and preserve culinary traditions together.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Heart className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                                    Made with Love
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Every feature is designed with care to honor Greek culinary traditions and make cooking accessible to all.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mb-10">
                    <h2 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-white">
                        Our Story
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        Greek Recipes was born from a simple realization: many traditional Greek recipes were at risk of being lost as younger generations moved away from their roots. Family recipe notebooks gathered dust, and the oral traditions of Greek cooking were fading.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        We created this platform to ensure that these culinary treasures are preserved and shared. What started as a personal project to digitize our own family recipes has grown into a comprehensive database of Greek cuisine, covering everything from everyday meals to festive dishes, from well-known classics to obscure regional specialties.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Today, Greek Recipes serves thousands of users worldwide—from Greeks living abroad seeking a taste of home, to food enthusiasts eager to explore authentic Mediterranean cuisine, to new generations learning to cook their cultural heritage.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-white">
                        Our Values
                    </h2>
                    <ul className="space-y-4">
                        <li className="flex gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                                <span className="text-primary font-bold text-sm">✓</span>
                            </div>
                            <div>
                                <strong className="text-gray-900 dark:text-white">Authenticity:</strong>
                                <span className="text-gray-700 dark:text-gray-300 ml-2">
                                    We prioritize traditional methods and ingredients, maintaining the integrity of Greek culinary heritage.
                                </span>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                                <span className="text-primary font-bold text-sm">✓</span>
                            </div>
                            <div>
                                <strong className="text-gray-900 dark:text-white">Community:</strong>
                                <span className="text-gray-700 dark:text-gray-300 ml-2">
                                    We foster a supportive community where knowledge is shared and traditions are celebrated.
                                </span>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                                <span className="text-primary font-bold text-sm">✓</span>
                            </div>
                            <div>
                                <strong className="text-gray-900 dark:text-white">Accessibility:</strong>
                                <span className="text-gray-700 dark:text-gray-300 ml-2">
                                    We make Greek cuisine approachable for cooks of all skill levels, from beginners to experts.
                                </span>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                                <span className="text-primary font-bold text-sm">✓</span>
                            </div>
                            <div>
                                <strong className="text-gray-900 dark:text-white">Preservation:</strong>
                                <span className="text-gray-700 dark:text-gray-300 ml-2">
                                    We're committed to documenting and safeguarding Greek culinary traditions for future generations.
                                </span>
                            </div>
                        </li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-white">
                        Join Our Community
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        Whether you're a seasoned cook or just starting your culinary journey, Greek Recipes welcomes you. Create an account to:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-6">
                        <li>Save your favorite recipes and create collections</li>
                        <li>Share your own family recipes and contribute to our growing database</li>
                        <li>Connect with other Greek food enthusiasts</li>
                        <li>Leave reviews and cooking tips for others</li>
                        <li>Plan meals and generate shopping lists</li>
                    </ul>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Together, we can ensure that the rich culinary heritage of Greece continues to thrive and inspire food lovers around the world.
                    </p>
                </section>

                <section className="bg-primary/5 dark:bg-primary/10 p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                        Get in Touch
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        We'd love to hear from you! Whether you have questions, suggestions, or want to contribute recipes, feel free to reach out:
                    </p>
                    <div className="space-y-2 text-gray-700 dark:text-gray-300">
                        <p><strong>Email:</strong> info@greekrecipes.com</p>
                        <p><strong>Community Forum:</strong> forum.greekrecipes.com</p>
                    </div>
                </section>
            </GlassPanel>
        </div>
    );
}
