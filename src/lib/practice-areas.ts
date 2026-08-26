/**
 * Çalışma alanlarına erişim yardımcıları.
 *
 * Alanların tek doğruluk kaynağı src/content/practice-areas/ altındaki
 * Markdown dosyalarıdır. site.ts'te ayrıca bir liste TUTULMUYOR: iki liste
 * olsaydı biri güncellenip diğeri unutulduğunda menüyle sayfalar birbirini
 * tutmazdı.
 */

import { getCollection, type CollectionEntry } from 'astro:content';

export type PracticeArea = CollectionEntry<'practiceAreas'>;

/** Tüm çalışma alanlarını CLAUDE.md Bölüm 5'teki sırayla döndürür. */
export async function getPracticeAreas(): Promise<PracticeArea[]> {
  const areas = await getCollection('practiceAreas');
  return areas.sort((a, b) => a.data.order - b.data.order);
}

/** Bir alanın site içi yolu. Tek yerde durur ki route değişirse hepsi değişsin. */
export function practiceAreaPath(id: string): string {
  return `/calisma-alanlari/${id}`;
}
