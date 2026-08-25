import { describe, expect, it } from 'vitest';
import { mailtoHref, telHref, whatsappUrl } from './contact';
import { CONTACT } from './site';

describe('whatsappUrl', () => {
  it('mesajsız çağrıldığında sade sohbet bağlantısı üretir', () => {
    expect(whatsappUrl()).toBe('https://wa.me/905377284313');
  });

  it('numarayı yalnızca rakamlardan oluşturur', () => {
    // wa.me baştaki "+" işaretini kabul etmez — bağlantı sessizce bozulur.
    expect(whatsappUrl()).not.toContain('+');
    expect(whatsappUrl()).not.toContain(' ');
  });

  it('mesajı URL için kodlar', () => {
    const url = whatsappUrl('Merhaba, danışmanlık almak istiyorum.');
    expect(url).toBe(
      'https://wa.me/905377284313?text=Merhaba%2C%20dan%C4%B1%C5%9Fmanl%C4%B1k%20almak%20istiyorum.'
    );
  });

  it('Türkçe karakterleri güvenli biçimde kodlar', () => {
    // ş/ı/ğ ham hâlde bırakılırsa bazı istemcilerde mesaj bozuk açılır.
    expect(whatsappUrl('şığ')).toBe('https://wa.me/905377284313?text=%C5%9F%C4%B1%C4%9F');
  });

  it('boş mesajı yok sayar', () => {
    expect(whatsappUrl('')).toBe('https://wa.me/905377284313');
  });
});

describe('telHref', () => {
  it('E.164 biçimini kullanır', () => {
    // Yurt dışından arandığında çalışması için ülke kodu şart.
    expect(telHref()).toBe('tel:+905377284313');
  });
});

describe('mailtoHref', () => {
  it('konu satırı olmadan sade adres üretir', () => {
    expect(mailtoHref()).toBe('mailto:av.ocyhukuk@gmail.com');
  });

  it('konu satırını kodlar', () => {
    expect(mailtoHref('Randevu talebi')).toBe(
      'mailto:av.ocyhukuk@gmail.com?subject=Randevu%20talebi'
    );
  });
});

describe('NAP tutarlılığı', () => {
  it('telefonun üç biçimi de aynı numarayı gösterir', () => {
    // CLAUDE.md Bölüm 1: NAP tutarsızlığı yerel SEO'da doğrudan sıralama kaybettirir.
    const digitsOnly = CONTACT.phone.display.replace(/\D/g, ''); // 05377284313
    expect(CONTACT.phone.e164).toBe(`+90${digitsOnly.slice(1)}`);
    expect(CONTACT.phone.wa).toBe(`90${digitsOnly.slice(1)}`);
  });
});
