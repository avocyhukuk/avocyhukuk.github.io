import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// `astro:content`in yeniden dışa aktardığı `z` kullanımdan kaldırıldı.
// `astro/zod`, Astro'nun paketlediği zod sürümünü verir — ayrı bir zod
// bağımlılığı eklenmediği için sürüm uyuşmazlığı riski de doğmaz.
import { z } from 'astro/zod';

/**
 * İçerik koleksiyonları — CLAUDE.md Bölüm 2.
 *
 * Çalışma alanları neden Markdown koleksiyonu: yedi alanın da sayfa yapısı
 * aynı (giriş, ele alınan işler, dayanak mevzuat). Yapıyı şemaya bağlayınca
 * yeni bir alan eklemek tek dosya yazmaya iniyor ve eksik alan derleme
 * sırasında hata veriyor — sessizce boş bölüm yayınlanmıyor.
 */

const practiceAreas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/practice-areas' }),
  // Şema fonksiyon biçiminde: `image()` yardımcısına ancak böyle erişilir.
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Menülerde ve listelerde görünme sırası — CLAUDE.md Bölüm 5'teki sıra. */
      order: z.number().int().positive(),
      /** Kartlarda görünen tek cümlelik özet. */
      summary: z.string(),
      /** Meta description. Arama sonucunda kırpılmaması için 160 karakter sınırı. */
      description: z.string().max(160),
      /** Bu alanda ele alınan başlıca işler. */
      matters: z.array(z.string()).min(1),
      /**
       * Dayanak mevzuat. CLAUDE.md Bölüm 4/3: her hukuki iddia bir kanun
       * maddesine dayandırılmalı — bu yüzden zorunlu alan.
       */
      laws: z
        .array(
          z.object({
            code: z.string(),
            name: z.string(),
          })
        )
        .min(1),

      /*
       * Kart görseli (isteğe bağlı). Konu başlığına ilişkin stok görsel.
       * `image()` yardımcısı yolu derleme sırasında çözer ve Astro görseli
       * yeniden boyutlandırıp modern biçime çevirir — Lighthouse hedefi 90+
       * olduğu için ham JPEG yayınlamıyoruz.
       *
       * Görsel `src/content/practice-areas/` altına konur ve frontmatter'da
       * göreli yolla verilir (ör. `image: ./gorseller/ceza.jpg`).
       */
      image: image().optional(),

      /*
       * Alt metin. Konuyu resmeden dekoratif bir stok görselde BOŞ olmalıdır:
       * kartın başlığı zaten aynı bilgiyi veriyor, tekrar etmek ekran okuyucu
       * kullanıcısına gürültü olur. Yalnızca görsel başlıkta olmayan bir bilgi
       * taşıyorsa doldurulur.
       */
      imageAlt: z.string().default(''),
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    /** Yazının bağlı olduğu çalışma alanı slug'ı. */
    area: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { practiceAreas, blog };
