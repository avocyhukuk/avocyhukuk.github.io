/**
 * Görsel varlık üretici — `npm run assets`
 *
 * Kaynak: public/favicon.svg (sadeleştirilmiş amblem) ve public/logo-mark.svg
 * Üretilen (CLAUDE.md Bölüm 3'teki boyutlar):
 *   public/favicon.ico          16x16, 32x32, 48x48 (çok boyutlu)
 *   public/apple-touch-icon.png 180x180
 *   public/og-image.png         1200x630
 *
 * Bu dosyalar üretilip commit'lenir; derleme sırasında çalışmaz. Amblem
 * değişirse bu script yeniden çalıştırılmalı — elle düzenlenmemeli.
 */

import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');

// CLAUDE.md Bölüm 3 tablosundaki değerler — tokens.css ile aynı olmalı.
const NAVY = '#1B3350';
const CREAM = '#FAF6EC';
const CREAM_MUTED = '#C9C4B4';

/**
 * Fontsource paketleri yalnızca woff2 içeriyor. resvg woff2'yi okuyabiliyorsa
 * markanın gerçek fontları kullanılır; okuyamazsa sistem fontlarına düşer.
 * OG görseli yerelde bir kez üretilip commit'lendiği için bu güvenli.
 */
function fontDosyalari() {
  const paketler = [
    ['@fontsource-variable/lora', 'lora-latin-ext-wght-normal.woff2'],
    ['@fontsource-variable/ibm-plex-sans', 'ibm-plex-sans-latin-ext-wght-normal.woff2'],
  ];

  const yollar = [];
  for (const [paket, dosya] of paketler) {
    const dizin = join(root, 'node_modules', paket, 'files');
    try {
      if (readdirSync(dizin).includes(dosya)) yollar.push(join(dizin, dosya));
    } catch {
      // Paket yoksa sistem fontuna düşülür — üretim yine de tamamlanır.
    }
  }
  return yollar;
}

const FONT_AYARI = {
  fontFiles: fontDosyalari(),
  loadSystemFonts: true,
  defaultFontFamily: 'Lora',
};

/** SVG metnini verilen genişlikte PNG'ye çevirir. */
function pngUret(svg, genislik) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: genislik },
    font: FONT_AYARI,
    background: 'rgba(0,0,0,0)',
  });
  return resvg.render().asPng();
}

/**
 * Çok boyutlu ICO dosyası kurar.
 *
 * ICO yapısı: 6 baytlık başlık + her görsel için 16 baytlık dizin kaydı +
 * görsel verileri. Görseller PNG olarak gömülüyor (Vista sonrası tüm
 * tarayıcılar destekler); eski BMP biçimine gerek yok.
 */
function icoKur(pngler) {
  const basli = Buffer.alloc(6);
  basli.writeUInt16LE(0, 0); // ayrılmış
  basli.writeUInt16LE(1, 2); // tip: 1 = ikon
  basli.writeUInt16LE(pngler.length, 4);

  const kayitlar = [];
  // Veriler, başlık ve tüm dizin kayıtlarından sonra başlar.
  let ofset = 6 + pngler.length * 16;

  for (const { boyut, veri } of pngler) {
    const kayit = Buffer.alloc(16);
    // 256 piksel 0 olarak yazılır — tek baytlık alana sığmadığı için.
    kayit.writeUInt8(boyut >= 256 ? 0 : boyut, 0);
    kayit.writeUInt8(boyut >= 256 ? 0 : boyut, 1);
    kayit.writeUInt8(0, 2); // palet rengi yok
    kayit.writeUInt8(0, 3); // ayrılmış
    kayit.writeUInt16LE(1, 4); // renk düzlemi
    kayit.writeUInt16LE(32, 6); // piksel başına bit
    kayit.writeUInt32LE(veri.length, 8);
    kayit.writeUInt32LE(ofset, 12);
    kayitlar.push(kayit);
    ofset += veri.length;
  }

  return Buffer.concat([basli, ...kayitlar, ...pngler.map((p) => p.veri)]);
}

/** logo-mark.svg'nin iç içeriğini (kök <svg> etiketi olmadan) döndürür. */
function amblemIcerigi() {
  const kaynak = readFileSync(join(publicDir, 'logo-mark.svg'), 'utf8');
  return kaynak.slice(kaynak.indexOf('>') + 1, kaynak.lastIndexOf('</svg>'));
}

/**
 * OG paylaşım görseli (1200x630).
 *
 * Zemin lacivert: paylaşım kartı akışta öne çıksın ve kartvizitle aynı dili
 * konuşsun diye. (Sitenin kendisi krem kalır — CLAUDE.md Bölüm 3'teki
 * "site karanlık hissettirmemeli" kuralı sayfalar içindir, marka varlıkları için değil.)
 *
 * Metinler bilinçli olarak SALT TANITICI: üstünlük iddiası, başarı oranı veya
 * müvekkil referansı içermez — Avukatlık Kanunu m.55 / TBB Reklam Yasağı
 * Yönetmeliği (CLAUDE.md Bölüm 4/3).
 */
function ogGorseliSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="1200" height="630" fill="${NAVY}"/>

  <!-- Amblem, sol blok: 448x552'lik amblem 0.68 ölçekle 305x375'e iner -->
  <g color="${CREAM}" transform="translate(96, 145) scale(0.68)">
    ${amblemIcerigi()}
  </g>

  <!-- Sağ blok: dikey ayraç + metin -->
  <rect x="470" y="165" width="1.5" height="355" fill="${CREAM}" opacity="0.35"/>

  <!--
    Başlık iki satır. Tek satırda Lora 600 ile genişliği 50px'te 699px çıkıyor,
    oysa x=530'dan sonra 610px yer var — taşıyordu. Küçültmek yerine bölmek
    başlığı 66px'te tutuyor, böylece isim (28px) karşısındaki hiyerarşi korunuyor.
    Satır genişlikleri ölçülerek doğrulandı: 399px ve 506px.
  -->
  <text x="530" y="210" fill="${CREAM}" font-family="Lora Variable, Lora, Georgia, serif"
        font-size="66" font-weight="600">OCY Hukuk</text>
  <text x="530" y="284" fill="${CREAM}" font-family="Lora Variable, Lora, Georgia, serif"
        font-size="66" font-weight="600">&amp; Danışmanlık</text>

  <text x="530" y="344" fill="${CREAM}" font-family="IBM Plex Sans Variable, IBM Plex Sans, sans-serif"
        font-size="28">Av. Onur Can Yılmaz</text>

  <text x="530" y="383" fill="${CREAM_MUTED}" font-family="IBM Plex Sans Variable, IBM Plex Sans, sans-serif"
        font-size="24">Ankara Barosu · Sicil No: 49834</text>

  <text x="530" y="440" fill="${CREAM_MUTED}" font-family="IBM Plex Sans Variable, IBM Plex Sans, sans-serif"
        font-size="21">Ceza · Ticaret · Gayrimenkul · İcra &amp; İflas</text>
  <text x="530" y="470" fill="${CREAM_MUTED}" font-family="IBM Plex Sans Variable, IBM Plex Sans, sans-serif"
        font-size="21">Sigorta · Girişim · Fikri Mülkiyet</text>

  <text x="530" y="528" fill="${CREAM}" font-family="IBM Plex Sans Variable, IBM Plex Sans, sans-serif"
        font-size="24" letter-spacing="1.5">ocyhukuk.com</text>
</svg>`;
}

// ---------------------------------------------------------------------------

const faviconSvg = readFileSync(join(publicDir, 'favicon.svg'), 'utf8');

const icoBoyutlari = [16, 32, 48];
const icoPngleri = icoBoyutlari.map((boyut) => ({ boyut, veri: pngUret(faviconSvg, boyut) }));
writeFileSync(join(publicDir, 'favicon.ico'), icoKur(icoPngleri));
console.log(`favicon.ico        ${icoBoyutlari.join('/')} px`);

writeFileSync(join(publicDir, 'apple-touch-icon.png'), pngUret(faviconSvg, 180));
console.log('apple-touch-icon.png  180x180');

writeFileSync(join(publicDir, 'og-image.png'), pngUret(ogGorseliSvg(), 1200));
console.log('og-image.png       1200x630');
