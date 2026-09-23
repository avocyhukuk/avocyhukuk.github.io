/**
 * İnfaz / yatar hesaplama — saf fonksiyonlar.
 *
 * Formül, kaynaklar ve karar geçmişi: docs/hesaplama-formulleri.md § 1.
 * Bu dosya, § 1.13'teki resmî metin doğrulaması ve § 1.15'teki üç karar
 * sonrasında yazıldı.
 *
 * ─── SEKİZ ARAÇ İÇİNDE EN RİSKLİSİ ────────────────────────────────────
 * § 1.1'deki gerekçeler kısaca: mevzuat altı yılda ALTI kez değişti
 * (sonuncusu 7593, 08.08.2026 — biz haberdar değildik), sonuç oranla
 * değil suç TARİHİYLE belirleniyor, iyi hâl takdiri hiçbir formülle
 * hesaplanamaz ve muhatap kitlesi hükümlü yakınları.
 *
 * Bu yüzden araç bir "tahliye tarihi" vaat etmiyor; **mevcut mevzuata
 * göre en erken olası tarihi** veriyor.
 *
 * ─── DÖRT FONKSİYON, BİRLEŞTİRİLMEYECEK ───────────────────────────────
 * `ksEsigi` · `bihakkinTahliye` · `denetimliSerbestlik` · `acigaAyrilma`
 *
 * Son ikisi ÖZELLİKLE ayrı (§ 1.5, § 1.13/1): Geçici m.10/6'nın iki
 * cümlesi farklı kurulmuş. Açığa ayrılma bir EŞİK kuralı ("üç yıl veya
 * daha az kalanlar"), denetimli serbestlik ise SABİT bir kaydırma ("üç
 * yıl erken yararlandırılır"). Tek fonksiyona sıkıştırılırsa birinin
 * düzeltilmesi diğerini bozar.
 *
 * ─── İKİ AYRI ASGARİ SÜRE ŞARTI ───────────────────────────────────────
 * § 1.15'te ayrıntısı var; kısaca biri KAPI diğeri TABAN:
 *
 *   · **Geçici m.10/6 — 3 ay açık kurum:** KAPI. Sağlanmazsa 3 yıllık
 *     erken kaydırma hiç uygulanmaz. Vakıa olduğu için kullanıcıya
 *     sorulur, hesaplanmaz.
 *   · **m.105/A — 1/10 ve en az 5 gün:** TABAN. Tarihi ileri iter.
 *     Hesaplanır; Geçici m.11 gereği 04.06.2025 öncesi suçlara
 *     uygulanmaz.
 *
 * Aynı fonksiyonda ama ayrı ayrı kontrol ediliyorlar ve sonuçta ayrı
 * alanlar olarak dönüyorlar.
 */
import type { LegalReference } from './calculator-ui';
import { birime, gunEkle, guneYuvarla, oranla, sureye, takvimGunu, type Sure } from './infaz-sure';
import {
  D,
  mukerrirOrani,
  temelOran,
  yuksekOran,
  type Oran,
  type SucKategorisi,
  type Tekerrur,
  type UyusturucuOrani,
} from './infaz-oranlari';

/** Geçici m.6 — infaz oranı ve DS süresi rejimi eşiği. */
export const ESIK_GECICI_6 = Date.UTC(2020, 2, 30);
/** Geçici m.10/6 — açık kuruma ve DS'ye erken ayrılma eşiği. */
export const ESIK_GECICI_10 = Date.UTC(2023, 6, 31);
/** 7550 s.K. — m.105/A'daki 1/10 + 5 gün şartı. Geçici m.11 öncesine uygulanmaz. */
export const ESIK_BIR_ONDA = Date.UTC(2025, 5, 4);

/** m.105/A — DS'den yararlanmak için kurumda geçmesi gereken asgari gün. */
export const BIR_ONDA_ASGARI_GUN = 5;

export type DsOzelDurum = 'yok' | 'cocuklu-kadin' | 'yetmis-yas';

export interface InfazGirdi {
  infazaBaslama: Date;
  sucTarihi: Date;
  ceza: Sure;
  kategori: SucKategorisi;
  /** Yalnızca `kategori === 'uyusturucu'` iken. Verilmezse hesap yapılmaz. */
  uyusturucuOrani?: UyusturucuOrani;
  /** TCK m.63 — gözaltı/tutuklulukta geçen gün. */
  mahsupGun: number;
  tekerrur: Tekerrur;
  /** m.108/2 tavanı için tekerrüre esas önceki ilam. */
  oncekiIlam?: Sure;
  dsOzelDurum?: DsOzelDurum;
  /**
   * Geçici m.10/6 KAPISI — "en az üç ay açık ceza infaz kurumunda kalmış
   * olmak". Vakıa; araç hesaplayamaz, kullanıcıya sorulur. İşaretli
   * değilse hâl B/C uygulanmaz (§ 1.5).
   */
  acikKurumUcAy?: boolean;
  /**
   * Suç, Geçici m.6'nın kapsam dışı bıraktığı suçlardan mı. Hâl A ile
   * hâl B'yi ayıran tek şey bu.
   */
  geciciAltiIstisnasi?: boolean;
}

/** `ksEsigi`nin ara adımları — sonuç ekranı bunları satır satır gösteriyor. */
export interface KsEsigi {
  hukmolunanCeza: Sure;
  mahsupGun: number;
  kalanCeza: Sure;
  oran: Oran;
  /** Mükerrir değilse yok. */
  mukerrirTaban?: Sure;
  tekerrurEklemesi?: Sure;
  m108Tavani?: Sure;
  uygulananEkleme?: Sure;
  tavanDevredeMi?: boolean;
  infazSuresi: Sure;
  /** Takvime eklenecek gün sayısı. */
  infazSuresiGun: number;
}

export type DsHali = 'standart' | 'ozel-durum' | 'hal-a' | 'hal-b' | 'hal-c';

export interface DsSonucu {
  hal: DsHali;
  /** KS tarihinden geriye alınan süre. */
  geriAlinanSure: Sure;
  /** Taban ve kapı uygulanmadan önceki ham tarih. */
  hamTarih: Date;
  /** m.105/A 1/10 + 5 gün TABANI — uygulandıysa dolu. */
  birOndaTabani?: { gerekenGun: number; uygulandi: boolean };
  /** İnfaza başlamadan önceye düşemez kuralı devreye girdi mi. */
  altSinirUygulandi: boolean;
  tarih: Date;
  dayanak: LegalReference;
}

export type AcigaAyrilmaSonucu =
  | { durum: 'kapsam-disi'; sebep: string }
  | { durum: 'esige-girmiyor'; normalTarih: Date }
  | { durum: 'erken'; tarih: Date; normalTarih: Date };

export type InfazSonucu =
  | { durum: 'gecersiz-tarih' }
  | { durum: 'gecersiz-ceza' }
  /** TCK 188 seçildi ama oran seçilmedi — araç oranı kendi atamıyor. */
  | { durum: 'uyusturucu-orani-gerekli' }
  | {
      durum: 'hesaplandi';
      ks: KsEsigi;
      ksTarihi: Date;
      ds: DsSonucu;
      bihakkin: Date;
    };

// ─────────────────────────────────────────────────────────────────────
// 1. Koşullu salıverilme eşiği
// ─────────────────────────────────────────────────────────────────────

/**
 * Kurumda geçirilecek süre — ara adımlarıyla birlikte.
 *
 * **Mahsup sırası: A okuması.** TCK m. 63 "hükmolunan hapis cezasından
 * indirilir" dediği için mahsup, oran uygulanmadan ÖNCE hükmolunan
 * cezadan düşülüyor; oran kalan cezaya uygulanıyor.
 *
 * 🚫 **YAYIN ENGELİ 1/2 — docs § 1 başı, § 1.15/Karar 1.**
 * Mahsubun oran ÖNCESİNDE mi SONRASINDA mı düşüleceği kesinleşmedi. Bir
 * pratisyen kaynağı ters sırayla hesaplıyor ve çelişki web
 * araştırmasıyla çözülemedi; Av. Onur Can Yılmaz kendi dosya
 * tecrübesiyle teyit edecek.
 *
 * Yanlışsa **mahsuplu her dosyada** tarih kayar — 18 yıllık bir cezada
 * 80 güne kadar. Araç bu madde kapanmadan canlıya alınmamalı.
 *
 * Sonuç ekranının ara adımları göstermesinin sebebi tam olarak bu:
 * sıra yanlışsa ekrandan okunabilsin, sessiz kalmasın.
 */
export function ksEsigi(girdi: InfazGirdi, oran: Oran): KsEsigi {
  const hukmolunan = birime(girdi.ceza);
  const kalan = Math.max(0, hukmolunan - girdi.mahsupGun);

  const temel = oranla(kalan, oran.pay, oran.payda);

  const mukerrir = mukerrirOrani(girdi.tekerrur);
  const uygulanan = yuksekOran(oran, mukerrir);

  // Mükerrir değilse ara adımlar boş kalır.
  if (!mukerrir) {
    return {
      hukmolunanCeza: girdi.ceza,
      mahsupGun: girdi.mahsupGun,
      kalanCeza: sureye(kalan),
      oran,
      infazSuresi: sureye(temel),
      infazSuresiGun: takvimGunu(temel),
    };
  }

  const mukerrirSure = oranla(kalan, uygulanan.pay, uygulanan.payda);
  const ekleme = Math.max(0, mukerrirSure - temel);

  // m.108/2 tavanı: ekleme, tekerrüre esas cezanın en ağırından fazla
  // olamaz. İKİNCİ tekerrürde uygulanmaz (§ 1.4).
  const tavanVar = girdi.tekerrur === 'birinci' && girdi.oncekiIlam !== undefined;
  const tavan = tavanVar ? birime(girdi.oncekiIlam!) : Number.POSITIVE_INFINITY;
  const uygulananEkleme = Math.min(ekleme, tavan);

  return {
    hukmolunanCeza: girdi.ceza,
    mahsupGun: girdi.mahsupGun,
    kalanCeza: sureye(kalan),
    oran: uygulanan,
    mukerrirTaban: sureye(temel),
    tekerrurEklemesi: sureye(ekleme),
    m108Tavani: tavanVar ? girdi.oncekiIlam : undefined,
    uygulananEkleme: sureye(uygulananEkleme),
    tavanDevredeMi: tavanVar && uygulananEkleme < ekleme,
    infazSuresi: sureye(temel + uygulananEkleme),
    infazSuresiGun: takvimGunu(temel + uygulananEkleme),
  };
}

// ─────────────────────────────────────────────────────────────────────
// 2. Bihakkın tahliye
// ─────────────────────────────────────────────────────────────────────

/**
 * Cezanın tamamının çekildiği tarih.
 *
 * Tekerrürden ETKİLENMEZ: tekerrür koşullu salıverilmeyi geciktiriyor,
 * cezanın kendisini uzatmıyor. Fikstürdeki 6 ve 6b senaryolarının
 * bihakkın tarihinin aynı çıkması bunun testi.
 */
export function bihakkinTahliye(girdi: InfazGirdi): Date {
  const kalan = Math.max(0, birime(girdi.ceza) - girdi.mahsupGun);
  return gunEkle(guneYuvarla(girdi.infazaBaslama), takvimGunu(kalan));
}

// ─────────────────────────────────────────────────────────────────────
// 3. Denetimli serbestlik — SABİT KAYDIRMA
// ─────────────────────────────────────────────────────────────────────

/** Bir hâlin DS için KS tarihinden geriye aldığı süre. */
function dsHalleri(girdi: InfazGirdi): { hal: DsHali; yil: number }[] {
  const suc = guneYuvarla(girdi.sucTarihi).getTime();
  const haller: { hal: DsHali; yil: number }[] = [{ hal: 'standart', yil: 1 }];

  if (girdi.dsOzelDurum === 'cocuklu-kadin' || girdi.dsOzelDurum === 'yetmis-yas') {
    haller.push({ hal: 'ozel-durum', yil: 4 });
  }

  if (suc < ESIK_GECICI_6) {
    // Hâl A: Geçici m.6 rejimi, 3 yıl. m.10/6'nın erkenliği AYRICA eklenmez.
    // Hâl B: m.6 istisnası ama m.10/6 kapsamında → 1 + 3 = 4 yıl.
    haller.push(
      girdi.geciciAltiIstisnasi === true
        ? { hal: 'hal-b', yil: girdi.acikKurumUcAy === true ? 4 : 1 }
        : { hal: 'hal-a', yil: 3 }
    );
  } else if (suc <= ESIK_GECICI_10) {
    // Hâl C — Geçici m.10/6. KAPI: açık kurumda 3 ay şartı sağlanmazsa
    // 3 yıllık kaydırma HİÇ uygulanmaz, standart 1 yıla düşer.
    if (girdi.acikKurumUcAy === true) haller.push({ hal: 'hal-c', yil: 4 });
  }

  return haller;
}

/**
 * Denetimli serbestlik başlangıcı.
 *
 * Geçici m.10/6'nın DS cümlesi SABİT kaydırma ("üç yıl erken
 * yararlandırılır"); açığa ayrılmadaki eşik mantığı buraya
 * UYGULANMAZ (§ 1.13/1).
 *
 * Süreler TOPLANMAZ: uygulanabilir her hâl ayrı hesaplanıp **en erken**
 * tarih seçilir (§ 1.5).
 */
export function denetimliSerbestlik(girdi: InfazGirdi, ks: KsEsigi, ksTarihi: Date): DsSonucu {
  const baslama = guneYuvarla(girdi.infazaBaslama);

  const haller = dsHalleri(girdi);
  const adaylar = haller.map((h) => ({
    ...h,
    tarih: gunEkle(ksTarihi, -h.yil * 365),
  }));

  // En erken tarihi veren hâl seçilir — "toplanmaz, lehe olan uygulanır".
  const secilen = adaylar.reduce((a, b) => (b.tarih.getTime() < a.tarih.getTime() ? b : a));

  const hamTarih = secilen.tarih;

  // ── ALT SINIR: hiçbir tarih infaza başlamadan önce olamaz (§ 1.7/9)
  let tarih = hamTarih;
  let altSinirUygulandi = false;
  if (tarih.getTime() < baslama.getTime()) {
    tarih = baslama;
    altSinirUygulandi = true;
  }

  // ── TABAN: m.105/A 1/10 + en az 5 gün. Geçici m.11 gereği
  // 04.06.2025 öncesi suçlara UYGULANMAZ. Geçici m.10/6'nın 3 aylık
  // açık kurum KAPISINDAN tamamen ayrı bir kural (§ 1.15).
  let birOndaTabani: DsSonucu['birOndaTabani'];
  if (guneYuvarla(girdi.sucTarihi).getTime() >= ESIK_BIR_ONDA) {
    const gerekenGun = Math.max(Math.round(ks.infazSuresiGun / 10), BIR_ONDA_ASGARI_GUN);
    const tabanTarihi = gunEkle(baslama, gerekenGun);
    const uygulandi = tarih.getTime() < tabanTarihi.getTime();
    if (uygulandi) tarih = tabanTarihi;
    birOndaTabani = { gerekenGun, uygulandi };
  }

  return {
    hal: secilen.hal,
    geriAlinanSure: { yil: secilen.yil, ay: 0, gun: 0 },
    hamTarih,
    birOndaTabani,
    altSinirUygulandi,
    tarih,
    dayanak: {
      short: '5275 m.105/A',
      full: '5275 sayılı Kanun m. 105/A — Denetimli serbestlik tedbiri uygulanarak cezanın infazı',
    },
  };
}

// ─────────────────────────────────────────────────────────────────────
// 4. Açık kuruma ayrılma — EŞİK KURALI
// ─────────────────────────────────────────────────────────────────────

/**
 * Geçici m.10/6'nın açık kuruma ayrılma cümlesi — **eşik kuralı**.
 *
 * > ...açık ceza infaz kurumlarına ayrılmasına **üç yıl veya daha az
 * > süre kalanlar**, bu şartların oluştuğu tarih itibarıyla açık ceza
 * > infaz kurumlarına ayrılabilir.
 *
 * Sabit bir indirim DEĞİL. Normal tarihine 3 yıldan fazla kalanlara
 * hiç dokunmuyor; eşiğe girenleri "şartların oluştuğu tarih"e alıyor.
 *
 * Şartlar iki tane ve ikisinin birlikte sağlandığı AN aranıyor:
 *   · kapalıda en az (ceza < 10 yıl ? 1 ay : 3 ay) geçirmiş olmak
 *   · normal tarihe 3 yıl veya daha az kalmış olmak
 *
 * ⚠️ Açık kuruma geçiş § 1.1b gereği **v1 arayüzünde YOK**. Fonksiyon
 * yazıldı ve test edildi; ekrana bağlanması ayrı bir karar.
 */
export function acigaAyrilma(girdi: {
  infazaBaslama: Date;
  normalAcigaAyrilma: Date;
  toplamCeza: Sure;
  /**
   * Eşiğin ÖLÇÜLDÜĞÜ tarih — genellikle bugün ya da maddenin yürürlük
   * tarihi.
   *
   * Zorunlu ve varsayılanı yok: bu parametre olmadan fonksiyon "şartlar
   * ileride ne zaman oluşur" sorusunu cevaplar ve **eşik kuralı sessizce
   * sabit 3 yıllık indirime dönüşür** (ilk sürümde tam olarak bu oldu,
   * test yakaladı). Madde, bir anda fotoğraf çekiyor: o an eşiğin
   * içindekileri alıyor, dışındakilere hiç dokunmuyor.
   */
  degerlendirmeTarihi: Date;
  kapsamDisiMi?: boolean;
}): AcigaAyrilmaSonucu {
  if (girdi.kapsamDisiMi === true) {
    return {
      durum: 'kapsam-disi',
      sebep:
        'Suç, Geçici m.10/6 kapsamı dışında (kasten öldürme, cinsel dokunulmazlığa karşı suçlar, TMK kapsamındaki suçlar, örgüt faaliyeti suçları ve TCK İkinci Kitap Dördüncü Kısım Dördüncü-Yedinci Bölümler).',
    };
  }

  const baslama = guneYuvarla(girdi.infazaBaslama);
  const normal = guneYuvarla(girdi.normalAcigaAyrilma);
  const referans = guneYuvarla(girdi.degerlendirmeTarihi);

  // ── EŞİK: değerlendirme anında normal tarihe üç yıl veya daha az
  // kalmış olmalı. Kalmadıysa madde HİÇ devreye girmez; hükümlü kendi
  // normal tarihini bekler. Buradaki "3 yıl" bir indirim değil, bir
  // pencere genişliği.
  const kalanGun = (normal.getTime() - referans.getTime()) / 86_400_000;
  if (kalanGun > 3 * 365) {
    return { durum: 'esige-girmiyor', normalTarih: normal };
  }

  // ── İKİNCİ ŞART: kapalıda geçirilmesi gereken asgari süre, cezaya bağlı.
  const onYil = 10 * 12 * 30;
  const kapaliSartGun = birime(girdi.toplamCeza) < onYil ? 30 : 90;
  const kapaliSartTarihi = gunEkle(baslama, kapaliSartGun);

  // "Bu şartların oluştuğu tarih itibarıyla" — ikisinin de sağlandığı an.
  const sartlarinOlustuguTarih = new Date(Math.max(kapaliSartTarihi.getTime(), referans.getTime()));

  if (sartlarinOlustuguTarih.getTime() >= normal.getTime()) {
    // Kapalıda kalma şartı normal tarihten sonra doluyor — kazanç yok.
    return { durum: 'esige-girmiyor', normalTarih: normal };
  }

  return { durum: 'erken', tarih: sartlarinOlustuguTarih, normalTarih: normal };
}

// ─────────────────────────────────────────────────────────────────────
// Orkestrasyon
// ─────────────────────────────────────────────────────────────────────

export function infazHesapla(girdi: InfazGirdi): InfazSonucu {
  if (Number.isNaN(girdi.infazaBaslama.getTime()) || Number.isNaN(girdi.sucTarihi.getTime())) {
    return { durum: 'gecersiz-tarih' };
  }

  if (birime(girdi.ceza) <= 0 || girdi.mahsupGun < 0) {
    return { durum: 'gecersiz-ceza' };
  }

  const oran = temelOran(girdi.kategori, girdi.uyusturucuOrani);
  if ('hata' in oran) {
    // TCK 188 — araç oranı kendi seçmiyor (§ 1.13/4).
    return { durum: 'uyusturucu-orani-gerekli' };
  }

  const ks = ksEsigi(girdi, oran);
  const ksTarihi = gunEkle(guneYuvarla(girdi.infazaBaslama), ks.infazSuresiGun);

  return {
    durum: 'hesaplandi',
    ks,
    ksTarihi,
    ds: denetimliSerbestlik(girdi, ks, ksTarihi),
    bihakkin: bihakkinTahliye(girdi),
  };
}

export { D as INFAZ_DAYANAKLARI };
