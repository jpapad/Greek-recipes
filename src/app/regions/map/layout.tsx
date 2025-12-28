import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Χάρτης Περιφερειών | Greek Recipes',
  description: 'Διαδραστικός χάρτης των περιφερειών, νομών, δήμων και οικισμών της Ελλάδας',
  keywords: ['χάρτης', 'περιφέρειες', 'νομοί', 'δήμοι', 'οικισμοί', 'Ελλάδα'],
};

export default function RegionsMapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
