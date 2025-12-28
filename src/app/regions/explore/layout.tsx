import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Εξερεύνηση Ελλάδας | Greek Recipes',
  description: 'Διαδραστικός χάρτης με περιφέρειες, νομούς, δήμους και οικισμούς της Ελλάδας',
  keywords: ['χάρτης', 'περιφέρειες', 'νομοί', 'δήμοι', 'οικισμοί', 'Ελλάδα', 'εξερεύνηση'],
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
