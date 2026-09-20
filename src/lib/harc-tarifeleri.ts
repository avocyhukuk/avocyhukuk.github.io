/**
 * Yargı harçları ve masraf tarifeleri — yıl bazlı, elle tutulan tablo.
 *
 * ─── NEDEN YIL BAZLI ──────────────────────────────────────────────────
 * Bu araçtaki on beşe yakın rakamın hepsi her yıl 1 Ocak'ta yeniden
 * belirleniyor: Harçlar Kanunu genel tebliği, HMK Gider Avansı Tarifesi,
 * TBB pul bedelleri, PTT ücret tarifesi. Tek bir "güncel değer" tutmak
 * yerine yıl anahtarlı tablo tutuluyor ki:
 *   · araç hangi yılın tarifesini kullandığını gösterebilsin,
 *   · tarifesi girilmemiş bir yıl için hesap YAPILMASIN.
 *
 * Bayatlama koruması kira aracındakiyle aynı ilkeden: bilinmeyen yıl için
 * tahmin etmektense hesap yapmamak.
 *
 * ─── 2026 RAKAMLARININ KAYNAĞI ────────────────────────────────────────
 * Harçlar: 98 Seri No'lu Harçlar Kanunu Genel Tebliği — Resmî Gazete
 *   31.12.2025, Sayı 33124 (5. Mükerrer). Maktu harçlar %18,95 (2025
 *   yeniden değerleme oranı) artırıldı. Tebliğin kimliği gazetenin
 *   içindekiler sayfasından doğrulandı; rakamlar Av. Onur Can Yılmaz
 *   tarafından tebliğe dayanılarak verildi.
 * Tebligat: PTT Posta ve Telgraf Ücret Tarifesi, 04.02.2026 —
 *   tarife PDF'inden doğrudan okundu.
 * Gider avansı: HMK Gider Avansı Tarifesi (2026).
 * Pul ve suret harcı: TBB / tarife.
 *
 * Ayrıntılı gerekçe ve doğrulama durumu:
 * docs/hesaplama-formulleri.md § 6.
 */

export interface HarcTarifesi {
  /** Başvurma harcı — sulh mahkemeleri ve icra tetkik mercii. */
  basvurmaSulh: number;
  /** Başvurma harcı — asliye ve idare mahkemeleri. */
  basvurmaAsliye: number;
  /** İcra dairesinde takip açılışı başvuru harcı. */
  icraBasvuru: number;
  /** Nispi karar ve ilam harcı oranı, binde. */
  nispiBinde: number;
  /** Nispi karar ve ilam harcının inemeyeceği alt sınır. */
  nispiAsgari: number;
  /** Konusu para ile ölçülemeyen davalarda maktu karar ve ilam harcı. */
  maktuKararIlam: number;
  /** İcra peşin harcı oranı, binde (ilamsız ve kambiyo takipleri). */
  icraPesinBinde: number;
  /** PTT normal tebligat, 100 g'a kadar. */
  tebligat: number;
  /** HMK Gider Avansı Tarifesi — taraf başına tebligat katsayısı. */
  tebligatKatsayisi: number;
  /** HMK Gider Avansı Tarifesi — diğer iş ve işlemler, maktu. */
  giderAvansiMaktu: number;
  /** Baro pulu (vekâlet pulu). */
  baroPulu: number;
  /** Vekâlet suret harcı. */
  vekaletSuret: number;
}

export const HARC_TARIFELERI: Readonly<Record<number, HarcTarifesi>> = {
  2026: {
    basvurmaSulh: 335.2,
    basvurmaAsliye: 732,
    icraBasvuru: 732,
    nispiBinde: 68.31,
    nispiAsgari: 732,
    maktuKararIlam: 732,
    icraPesinBinde: 5,
    tebligat: 265,
    tebligatKatsayisi: 5,
    giderAvansiMaktu: 530,
    baroPulu: 164,
    vekaletSuret: 104,
  },
};

/** Tarifesi girilmiş yıllar, yeniden eskiye. Form seçeneklerini besler. */
export function tarifeliYillar(): number[] {
  return Object.keys(HARC_TARIFELERI)
    .map(Number)
    .sort((a, b) => b - a);
}

/** Yılın tarifesi; girilmemişse `undefined`. */
export function tarifeBul(yil: number): HarcTarifesi | undefined {
  return HARC_TARIFELERI[yil];
}
