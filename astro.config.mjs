// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://ocyhukuk.com',
  output: 'static',

  // Cloudflare Pages varsayılan olarak /yol/ biçimini temiz servis eder.
  build: {
    format: 'directory',
  },

  // CLAUDE.md Bölüm 4/5: gereksiz JS yok, Astro'nun "sıfır JS varsayılanı" korunur.
  // Hesaplama araçları geldiğinde yalnız o adalar (island) hydrate edilecek.
  //
  // NOT: Astro'nun `prefetch` özelliği bilinçli olarak KAPALI. Açıldığında her
  // sayfaya ~4 KB'lık bir çalışma zamanı betiği ekliyor; statik ve küçük bir
  // sitede Cloudflare CDN'den gelen sayfa zaten bu kazancı karşılıyor.
  // Sayfa sayısı büyür ve gezinme yavaş hissettirirse tekrar değerlendirilebilir.
});
