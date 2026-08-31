/**
 * Hesaplama araçlarının arayüzünde paylaşılan tipler.
 *
 * Burada YALNIZCA sunum tipleri var — hiçbir hukuki formül, oran veya süre
 * yok. Hesabın kendisi her aracın kendi saf fonksiyonunda yaşar (CLAUDE.md
 * Bölüm 2: `src/lib/` altında UI'dan bağımsız, Vitest ile test edilen kısım).
 * Bu ayrım sayesinde arayüz iskeleti, formüller onaylanmadan da yazılabilir.
 */

/**
 * Bir hesap adımının dayandığı mevzuat.
 *
 * CLAUDE.md Bölüm 4/3 gereği sonuç ekranında dayanılan kanun maddesi açıkça
 * gösterilmek zorunda. Bu yüzden dayanak, sonuç satırının isteğe bağlı bir
 * süsü değil, satırın yanında duran bir alanı.
 */
export interface LegalReference {
  /** Cetvel satırının kenarında görünen kısa gösterim. Ör. `5275 m.107/2`. */
  short: string;
  /** Dayanak listesinde görünen tam ad. Ör. `5275 sayılı Kanun m. 107/2 — Koşullu salıverilme`. */
  full: string;
}

/**
 * Hesap cetvelinin tek bir satırı.
 *
 * Cetvel bilinçli olarak "tek büyük sonuç" değil, adım adım bir hesap
 * dökümüdür. İki nedeni var: (1) reklam yasağı çerçevesinde sonucu değil
 * gerekçeyi öne çıkarmak gerekiyor, (2) kullanıcı yanlış girdi verdiğinde
 * hatanın hangi adımda oluştuğu görünür oluyor.
 */
export interface SheetRow {
  /** Adımın adı. Ör. `Mahsup edilen süre`. */
  label: string;
  /** Biçimlendirilmiş değer. Ör. `−90 gün`, `1/2`, `12.04.2027`. */
  value: string;
  /** Değerin nasıl bulunduğuna dair kısa açıklama. */
  detail?: string;
  /** Bu adımın dayanağı. */
  basis?: LegalReference;
  /**
   * Cetvelin kapanış satırı. Muhasebe cetvellerindeki gibi çift çizgiyle
   * ayrılır ve vurgulanır. Birden fazla olabilir (ör. koşullu salıverilme
   * tarihi ve bihakkın tahliye tarihi ayrı ayrı sonuçtur).
   */
  total?: boolean;
}

/** Aynı dayanağın listede iki kez görünmemesi için tekilleştirir. */
export function uniqueReferences(rows: readonly SheetRow[]): LegalReference[] {
  const seen = new Map<string, LegalReference>();
  for (const row of rows) {
    if (row.basis && !seen.has(row.basis.short)) {
      seen.set(row.basis.short, row.basis);
    }
  }
  return [...seen.values()];
}
