/**
 * Sitenin tek doğruluk kaynağı (single source of truth).
 *
 * CLAUDE.md Bölüm 1: NAP (Name-Address-Phone) bilgileri tüm sayfalarda VE
 * JSON-LD şemasında birebir tutarlı olmalı — yerel SEO'da tutarsız NAP
 * doğrudan sıralama kaybettirir. Bu yüzden telefon/adres/e-posta hiçbir
 * bileşene elle yazılmaz, hep buradan okunur.
 */

export const SITE = {
  name: 'OCY Hukuk & Danışmanlık',
  legalName: 'Av. Onur Can Yılmaz',
  url: 'https://ocyhukuk.com',
  locale: 'tr-TR',
  lang: 'tr',
  description:
    'Ankara Çankaya merkezli hukuk bürosu. Ceza, ticaret, gayrimenkul, icra-iflas, ' +
    'sigorta, girişim ve fikri mülkiyet hukuku alanlarında danışmanlık ve dava takibi.',
} as const;

export const ATTORNEY = {
  name: 'Onur Can Yılmaz',
  title: 'Avukat',
  bar: 'Ankara Barosu',
  barRegistrationNumber: '49834',
} as const;

/**
 * Telefon numarası üç ayrı biçimde gerekiyor:
 *  - display: insanın okuduğu hâli (0537 728 43 13)
 *  - e164:    tel: ve JSON-LD için uluslararası biçim (+905377284313)
 *  - wa:      WhatsApp wa.me linki için baştaki + olmadan (905377284313)
 */
export const CONTACT = {
  phone: {
    display: '0537 728 43 13',
    e164: '+905377284313',
    wa: '905377284313',
  },
  email: 'av.ocyhukuk@gmail.com',
  address: {
    street: 'Alacaatlı Mah. 5088. Cad. Relax Plus F No:74',
    district: 'Çankaya',
    city: 'Ankara',
    country: 'TR',
    /** Tek satırlık gösterim hâli */
    full: 'Alacaatlı Mah. 5088. Cad. Relax Plus F No:74, Çankaya/Ankara',
  },
} as const;

/*
 * Çalışma alanları burada TUTULMUYOR — CLAUDE.md Bölüm 5'teki yedi alanın
 * tek doğruluk kaynağı src/content/practice-areas/ koleksiyonudur.
 * Erişim için: src/lib/practice-areas.ts → getPracticeAreas()
 */

/** Ana navigasyon — Header ve Footer aynı listeden beslenir. */
export const NAV_LINKS = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/calisma-alanlari', label: 'Çalışma Alanları' },
  { href: '/hesaplama-araclari', label: 'Hesaplama Araçları' },
  { href: '/blog', label: 'Blog' },
  { href: '/hakkinda', label: 'Hakkında' },
  { href: '/iletisim', label: 'İletişim' },
] as const;

/**
 * CLAUDE.md Bölüm 4/3 — reklam yasağı uyumu.
 * Hesaplama araçlarının sonuç ekranında gösterilmesi ZORUNLU uyarı metni.
 * Tek yerde tutuluyor ki bir araçta yanlışlıkla atlanmasın veya farklı yazılmasın.
 */
export const CALCULATOR_DISCLAIMER =
  'Bu hesaplama tahminidir ve bilgilendirme amaçlıdır. Somut olayınız için hukuki ' +
  'değerlendirme gereklidir; bağlayıcı bir sonuç doğurmaz.';

/**
 * Büro çalışma saatleri.
 *
 * Hem İletişim sayfasında gösterilir hem de JSON-LD'de
 * openingHoursSpecification olarak yayımlanır — Google'ın işletme kartında
 * "Açık / Kapalı" bilgisi bu alandan okunur. İki yerde ayrı yazılırsa
 * biri güncellenip diğeri unutulur, o yüzden tek kaynak burasıdır.
 *
 * `schemaDays`: schema.org gün adları (İngilizce olmak ZORUNDA).
 */
export const OFFICE_HOURS = {
  opens: '09:00',
  closes: '18:00',
  /** İnsana gösterilen hâli */
  display: 'Hafta içi 09.00 – 18.00',
  daysDisplay: 'Pazartesi – Cuma',
  schemaDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as readonly string[],
} as const;

/**
 * Bilinen diller.
 *
 * `service: true` yalnızca hizmetin fiilen yürütüldüğü dil içindir. Site şu an
 * Türkçe; İngilizce ve Gürcüce bilinen diller olarak belirtilir ama hizmet dili
 * olarak DUYURULMAZ — CLAUDE.md Bölüm 1'de bu diller ayrı bir faz olarak
 * planlanmış durumda.
 */
export const LANGUAGES = [
  // `code`: JSON-LD knowsLanguage için ISO 639-1. Şemayı okuyan makineye
  // Türkçe ad değil, standart kod verilmeli.
  { code: 'tr', name: 'Türkçe', service: true },
  { code: 'en', name: 'İngilizce', service: false },
  { code: 'ka', name: 'Gürcüce', service: false },
] as const;
