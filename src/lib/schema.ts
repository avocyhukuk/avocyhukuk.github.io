/**
 * JSON-LD yapılandırılmış veri — CLAUDE.md Faz B.
 *
 * Tüm değerler site.ts'ten okunur. Şemadaki telefon/adres ile sayfadaki
 * telefon/adresin birebir aynı olması yerel SEO'da belirleyicidir; bu yüzden
 * hiçbir alan burada elle yazılmaz.
 */

import { ATTORNEY, CONTACT, LANGUAGES, OFFICE_HOURS, SITE } from './site';

/** Kurum düğümünün sabit kimliği — diğer şemalar buna referans verir. */
const ORGANIZATION_ID = `${SITE.url}/#kurum`;

/**
 * Attorney şeması (schema.org/Attorney — LegalService ve LocalBusiness'ın alt türü).
 *
 * Yalnızca ana sayfaya bir kez gömülür. Diğer sayfalar aynı düğümü tekrar
 * yayımlamak yerine `@id` üzerinden ona atıf yapar; aynı kurumun her sayfada
 * yeniden tanımlanması arama motorlarında tekrar eden varlık olarak okunur.
 */
export function attorneySchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Attorney',
    '@id': ORGANIZATION_ID,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    description: SITE.description,
    image: `${SITE.url}/og-image.png`,
    logo: `${SITE.url}/logo-mark.svg`,
    telephone: CONTACT.phone.e164,
    email: CONTACT.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT.address.street,
      addressLocality: CONTACT.address.district,
      addressRegion: CONTACT.address.city,
      addressCountry: CONTACT.address.country,
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: CONTACT.address.city,
    },
    // Google işletme kartındaki "Açık / Kapalı" bilgisi buradan okunur.
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: OFFICE_HOURS.schemaDays,
        opens: OFFICE_HOURS.opens,
        closes: OFFICE_HOURS.closes,
      },
    ],
    knowsLanguage: LANGUAGES.map((language) => language.code),
    founder: attorneyPerson(),
    employee: attorneyPerson(),
  };
}

/**
 * Avukatın kendi düğümü. Baro sicil numarası için schema.org'da özel bir
 * alan bulunmadığından PropertyValue ile `identifier` altında veriliyor —
 * bu, kurumsal kimlik numaraları için önerilen kalıptır.
 */
function attorneyPerson() {
  return {
    '@type': 'Person',
    name: ATTORNEY.name,
    jobTitle: ATTORNEY.title,
    memberOf: {
      '@type': 'Organization',
      name: ATTORNEY.bar,
    },
    identifier: {
      '@type': 'PropertyValue',
      name: `${ATTORNEY.bar} Sicil No`,
      value: ATTORNEY.barRegistrationNumber,
    },
  };
}

/** Ana sayfa dışındaki sayfaların kuruma atıf yapması için hafif referans. */
export function organizationReference() {
  return { '@id': ORGANIZATION_ID };
}

/**
 * Belirli bir hizmet (çalışma alanı) sayfası için Service şeması.
 * Hizmeti sunan kurum, yeniden tanımlanmadan `@id` ile bağlanır.
 */
export function serviceSchema(input: { name: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    description: input.description,
    url: input.url,
    serviceType: input.name,
    provider: organizationReference(),
    areaServed: {
      '@type': 'AdministrativeArea',
      name: CONTACT.address.city,
    },
  };
}

export interface BreadcrumbItem {
  name: string;
  /** Kök dizine göre yol (ör. "/calisma-alanlari"). */
  path: string;
}

/**
 * BreadcrumbList şeması — arama sonuçlarında yol gösterimi sağlar.
 * `position` 1'den başlar; sıçrama olursa Google listeyi yok sayar.
 */
export function breadcrumbSchema(items: readonly BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: new URL(item.path, SITE.url).href,
    })),
  };
}

/**
 * JSON-LD'yi <script> içine gömülmeye hazır metne çevirir.
 *
 * `<` karakteri kaçırılıyor: veri içinde "</script>" geçerse tarayıcı betiği
 * erken kapatır. Veriler şu an sabit ve güvenilir olsa da, ileride içerikten
 * beslenen bir şema eklendiğinde bu koruma yerinde olsun diye baştan yazıldı.
 */
export function serializeSchema(schema: object): string {
  return JSON.stringify(schema).replace(/</g, '\\u003c');
}
