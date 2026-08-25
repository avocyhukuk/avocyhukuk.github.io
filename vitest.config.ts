/// <reference types="vitest/config" />
// ^ getViteConfig'in döndürdüğü tip Vite'ın UserConfig'i; `test` alanının
//   tanınması için Vitest'in tip genişletmesi bu satırla yüklenir.
import { getViteConfig } from 'astro/config';

// CLAUDE.md Bölüm 2: hesaplama araçlarının SAF fonksiyonları src/lib/ altında
// yaşar ve testler tam olarak orayı hedefler. UI bileşenleri test kapsamı dışıdır.
export default getViteConfig({
  test: {
    include: ['src/lib/**/*.test.ts'],
    environment: 'node',
    coverage: {
      include: ['src/lib/**/*.ts'],
      exclude: ['src/lib/**/*.test.ts'],
      reporter: ['text', 'html'],
    },
  },
});
