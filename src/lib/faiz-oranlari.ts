/**
 * Kanuni faiz oranı dönemleri — elle tutulan tablo.
 *
 * Dayanak: 3095 sayılı Kanun m. 1.
 *
 * ─── ORAN ARTIK FORMÜLLE BELİRLENİYOR ─────────────────────────────────
 * 7589 sayılı Kanun (12. Yargı Paketi, 31.07.2026) m.1'i değiştirdi:
 * kanuni faiz artık Cumhurbaşkanı kararıyla belirlenen sabit bir oran
 * değil, **TCMB'nin kısa vadeli kredi işlemlerinde uyguladığı reeskont
 * oranının %80'i.** Bir önceki yılın 31 Aralık oranı esas alınıyor;
 * 30 Haziran oranı bundan 5 puan veya daha fazla farklıysa 1 Temmuz'da
 * yeni oran uygulanıyor.
 *
 * Pratik sonucu: oran yılda bir (bazen iki) kez KENDİLİĞİNDEN değişiyor.
 * Yeni dönem başladığında buraya bir satır eklenmesi gerekiyor.
 *
 * ─── DÖNEMLER SON GÜNLE TANIMLI ───────────────────────────────────────
 * Her kayıt dönemin SON gününü tutuyor (`son`), başlangıcını değil.
 * Bunun sebebi onaylanan sınır kuralı: sınır günü ESKİ döneme yazılır.
 * Hesap, imleci dönemin son gününe taşıyarak ilerliyor; böylece sınır
 * günü ne iki kez sayılıyor ne de düşüyor.
 *
 * `son: null` → açık uçlu, hâlen yürürlükte olan dönem.
 */

export interface KanuniFaizDonemi {
  /** Dönemin son günü (dahil), `YYYY-MM-DD`. Açık uçlu dönemde `null`. */
  son: string | null;
  /** Yıllık oran, yüzde. */
  oran: number;
  /** Oranın nereden geldiğine dair kısa not — denetlenebilirlik için. */
  not: string;
}

/** Tablonun kapsadığı en erken gün. Öncesi için hesap yapılmıyor. */
export const KANUNI_FAIZ_BASLANGIC = '2006-01-01';

/** Eskiden yeniye sıralı. */
export const KANUNI_FAIZ_DONEMLERI: readonly KanuniFaizDonemi[] = [
  { son: '2024-05-31', oran: 9, not: '3095 m.1, sabit oran dönemi' },
  { son: '2026-07-30', oran: 24, not: '3095 m.1, sabit oran dönemi' },
  {
    son: null,
    oran: 31,
    not: '7589 s.K. sonrası: 31.12.2025 reeskont oranı %38,75 × 0,80',
  },
] as const;

/**
 * Kapsam dışı bırakılanlar — bilinçli.
 *
 * · Ticari işlerde temerrüt faizi (3095 m.2, TCMB kısa vadeli avans) ve
 *   TTK m.1530 geç ödeme faizi: v1 kapsamı dışında. Geçmiş yıl oran
 *   tabloları derlenmedi; ayrıca bir işin "ticari iş" olup olmadığı
 *   nitelendirme gerektiriyor, araç bunu bilemez.
 * · Yabancı para borçları (3095 m.4/a): ayrı rejim.
 * · Kısmi ödemeler, takip sonrası harç ve masraflar: kapsam dışı.
 */
