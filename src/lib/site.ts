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

/**
 * Çalışma alanları — CLAUDE.md Bölüm 5.
 * Her biri ayrı route alacak (Faz B). `slug` URL'i belirler, sonradan
 * değiştirilirse SEO'da kırık link olur; bu yüzden baştan Türkçe ve kalıcı seçildi.
 */
export const PRACTICE_AREAS = [
  { slug: 'ceza-hukuku', title: 'Ceza Hukuku' },
  { slug: 'ticaret-sirketler-hukuku', title: 'Ticaret & Şirketler Hukuku' },
  { slug: 'gayrimenkul-hukuku', title: 'Gayrimenkul Hukuku' },
  { slug: 'icra-iflas-hukuku', title: 'İcra & İflas Hukuku' },
  { slug: 'sigorta-hukuku', title: 'Sigorta Hukuku' },
  { slug: 'startup-girisim-hukuku', title: 'Startup & Girişim Hukuku' },
  { slug: 'fikri-mulkiyet-hukuku', title: 'Fikri Mülkiyet Hukuku' },
] as const;

export type PracticeAreaSlug = (typeof PRACTICE_AREAS)[number]['slug'];

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
