/**
 * İletişim bağlantısı üreten saf fonksiyonlar.
 * UI'dan bağımsız tutulur ki test edilebilsin — CLAUDE.md Bölüm 2 kuralı.
 */

import { CONTACT } from './site';

/**
 * WhatsApp sohbet bağlantısı üretir.
 *
 * wa.me biçimi baştaki "+" işaretini KABUL ETMEZ; numara yalnızca rakam
 * olmalıdır (905377284313). Bu yüzden site.ts'te ayrı bir `wa` alanı tutuluyor.
 *
 * @param message Sohbet açılırken kutuya önceden yazılacak metin (isteğe bağlı).
 */
export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${CONTACT.phone.wa}`;
  if (!message) return base;

  // encodeURIComponent boşluğu %20 yapar; wa.me bunu doğru çözer.
  return `${base}?text=${encodeURIComponent(message)}`;
}

/** `tel:` bağlantısı — daima E.164 biçiminde olmalı ki yurt dışından da çalışsın. */
export function telHref(): string {
  return `tel:${CONTACT.phone.e164}`;
}

/**
 * `mailto:` bağlantısı.
 * @param subject Konu satırı (isteğe bağlı).
 */
export function mailtoHref(subject?: string): string {
  const base = `mailto:${CONTACT.email}`;
  if (!subject) return base;

  return `${base}?subject=${encodeURIComponent(subject)}`;
}
