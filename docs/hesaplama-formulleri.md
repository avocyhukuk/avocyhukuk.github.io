# Hesaplama Araçları — Formül ve Kaynak Kayıt Defteri

Bu belge, `CLAUDE.md` Bölüm 6'daki her hesaplama aracının **kodlanmadan önce** doğrulanmış formülünü ve hukuki dayanağını kayıt altına almak için var. Kural: bir araç için bu belgedeki ilgili bölüm doldurulup "Onay Durumu: Onaylandı" olarak işaretlenmeden, `src/lib/` altında o aracın kodu yazılmaz.

Her bölümdeki "Kanuni Dayanak" ve "Kaynak" alanları şu an genel araştırmadan gelen başlangıç noktalarıdır — **kesinleşmiş formül değildir**. Av. Onur Can Yılmaz tarafından doğrulanıp somut katsayı/formülle güncellenmesi gerekir.

---

## 1. İnfaz / Yatar Hesaplama

> **Durum: TASLAK — kodlanmadı, kodlanmayacak.** Aşağıdakiler ikincil kaynaklardan (meslektaş yayınları, güncel makaleler) derlenmiş bir başlangıç çerçevesidir. Hiçbir satırı doğrulanmış kabul edilmemelidir. Av. Onur Can Yılmaz'ın onayı olmadan `src/lib/` altına tek satır yazılmayacaktır.

### 1.1. Neden bu araç sekiz araç içindeki en riskli olan

Bunu baştan yazıyorum çünkü tasarım kararlarını bu belirliyor:

1. **Mevzuat beş yılda üç kez değişti.** 7242 s.K. (15.04.2020), 7456 s.K. (15.07.2023), 7550 s.K. — "10. Yargı Paketi" (yürürlük **04.06.2025**). Bir sonraki paket bu aracı sessizce yanlış hale getirir.
2. **Sonuç, oranla değil suç tarihiyle belirleniyor.** Aynı ceza, suçun işlendiği tarihe göre farklı infaz rejimine tabi. Kullanıcı "suç tarihi" yerine "karar tarihi" girerse sonuç sessizce yanlış çıkar.
3. **İyi hâl hesaplanamaz.** Koşullu salıverilmenin maddi şartı, idare ve gözlem kurulunun iyi hâl değerlendirmesidir (5275 m.89). Bu bir takdir yetkisidir; hiçbir formül üretemez. Araç en iyi ihtimalle **en erken olası tarihi** verir, gerçekleşecek tarihi değil.
4. **Muhatap kitlesi hassas.** Hükümlü yakınları kullanacak. Yanlış bir tarih, somut bir beklenti yaratır.

**Tasarım sonucu:** Araç bir "tahliye tarihi" vaat etmemeli; "mevcut mevzuata göre en erken olası tarih" demeli. Sonuç ekranında hem `CALCULATOR_DISCLAIMER` hem de hesabın dayandığı mevzuat sürümü ve son güncelleme tarihi görünmeli.

### 1.1b. v1 kapsamı — KARARA BAĞLANDI

Av. Onur Can Yılmaz'ın kapsam kararı. Bu sınır, aracın ne zaman
"bitmiş" sayılacağını belirler; genişletme talebi v2'ye yazılır.

**v1'de VAR:**

- 18 yaş üstü (yetişkin) hükümlü
- **Tek** kesinleşmiş ilam
- Standart infaz rejimi
- Çıktı: **koşullu salıverilme (KS)** ve **denetimli serbestlik (DS)** tarihleri
- Tekerrür (m.108) — mükerrir oranları ve m.108/2 tavanı dahil
- Suç kategorisine göre oranlar, mahsup, geçici madde eşikleri

**v1'de YOK — v2'ye bırakıldı:**

| Kapsam dışı | Neden buradan çıktı |
|---|---|
| **SSÇ / çocuk hükümlü** | Katsayıların neye uygulandığı (KS oranı mı, TCK m.31 ceza indirimi mi) netleşmedi; yanlış kodlamak yerine kapsam dışı bırakıldı |
| **Açık ceza infaz kurumuna geçiş tarihi** | Dayanağı kanun değil yönetmelik; 10 yıl üstü eşiği kaynaklarda 7 yıl / 5 yıl olarak çelişiyor |
| **Birden fazla ilam / içtima** | m.107/3 tavanları (28 / 32 yıl) v1'de devrede değil |
| **Konutta infaz (m.110)**, ağır hastalık/engellilik | Somut olaya çok bağlı |

**Araçta gösterilecek kapsam notu** (sonuç ekranında, uyarının yanında —
metin birebir budur):

> Bu araç 18 yaş üstü, tek kesinleşmiş ilam ve standart infaz rejimi için
> tahmini hesaplama yapar; çocuk hükümlüler ve açık cezaevine geçiş
> hesaplaması bu sürümde kapsam dışıdır.

> ⚠️ **Yoruma açık bırakılan iki alan.** "0-6 yaş çocuklu kadın hükümlü"
> ve "70 yaş üstü" hâlleri v1'de TUTULDU: ikisi de yetişkin ve standart
> rejim içinde, yalnızca DS süresini 1 yıldan 4 yıla çıkarıyorlar.
> Çıkarılsalardı araç bu kişiler için sessizce yanlış tarih verirdi.
> Kapsam dışı sayılmalarını istersen tek satırlık değişiklik.

### 1.2. Kanuni dayanak

| Konu | Dayanak |
|---|---|
| Koşullu salıverilme (KS) oranları ve süreleri | 5275 s.K. **m.107** |
| Mükerrirlere özgü infaz rejimi | 5275 s.K. **m.108** |
| Denetimli serbestlik (DS) ile infaz | 5275 s.K. **m.105/A** |
| Açık kuruma ayrılma *(v2)* | Açık Ceza İnfaz Kurumlarına Ayrılma Yönetmeliği |
| İyi hâl / idare ve gözlem kurulu | 5275 s.K. **m.89** |
| Gözaltı ve tutuklulukta geçen sürenin mahsubu | **TCK m.63** |
| Yaş küçüklüğü (SSÇ) *(v2)* | **TCK m.31** |
| 30.03.2020'ye kadar işlenen suçlar (DS 3 yıl) | 5275 s.K. **geçici m.6** |
| 31.07.2023'e kadar işlenen suçlar | 5275 s.K. **geçici m.10** (7456 s.K.) |
| 04.06.2025 öncesi suçlarda 1/10 şartının uygulanmaması | 5275 s.K. **geçici m.11** (7550 s.K.) |
| 31.07.2023'e kadar işlenen suçlarda 3 yıl erken DS/açık kurum | 5275 s.K. **geçici m.10/6** (7571 s.K.) |
| Terör suçlarında KS oranı | **3713 s.K. m.17** |

#### Mevzuat değişiklik zinciri

Bu aracın en büyük riski burada görünüyor — altı yılda **beş** değişiklik:

| Kanun | Tarih | Bu araca etkisi |
|---|---|---|
| **7242** | 15.04.2020 | Genel KS oranı 2/3 → **1/2**; geçici m.6 ile DS 3 yıla çıktı |
| **7456** | 15.07.2023 | Geçici m.10 — 31.07.2023 eşiği |
| **7550** (10. paket) | 04.06.2025 | m.108: ikinci defa tekerrürde KS artık mümkün (3/4); m.105/A'ya **1/10 + asgari 5 gün** şartı; geçici m.11 ile geriye yürümüyor |
| **7571** (11. paket) | 25.12.2025 | **Geçici m.10/6**: 31.07.2023 ve öncesi suçlarda açık kuruma ve DS'ye **3 yıl erken** ayrılma; en az **3 ay** açık kurumda kalmış olma şartı. *(Yeni geçici madde mi, m.10'a fıkra mı — resmî metinde teyit edilecek.)* |
| **7589** (12. paket) | 31.07.2026 | **5275'in infaz rejimine dokunmuyor.** Genel af veya infaz indirimi yok. Kontrol edildi, bu araç açısından etkisiz. |

> ⚠️ **7571'in kapsam dışı bıraktığı suçlar** (ikincil kaynaklardan): terör,
> örgüt suçları, kadına/çocuğa/eşe/üstsoy-altsoya karşı kasten öldürme,
> cinsel saldırı, çocuğun cinsel istismarı. Liste resmî metinden
> doğrulanmalı.
>
> ⚠️ Kamuoyunda bir **13. Yargı Paketi** tartışılıyor. Araç yayına
> girmeden önce yürürlüğe girerse tablolar yeniden gözden geçirilmeli.

### 1.3. Girdi alanları

| Alan | Tip | Neden gerekli |
|---|---|---|
| **Suç tarihi** | tarih (zorunlu) | Uygulanacak infaz rejimini bu belirler — 30.03.2020 / 31.07.2023 / 04.06.2025 eşikleri. En kritik alan. |
| **Ceza türü** | seçim: süreli hapis / müebbet / ağırlaştırılmış müebbet | Müebbetlerde oran değil sabit yıl uygulanır. |
| **Ceza süresi** | yıl + ay + gün | Yalnızca süreli hapiste. |
| **Suç kategorisi** | seçim — **sade dille** (bkz. 1.4 sonu) | KS oranını belirler. |
| **Tekerrür durumu** | seçim: yok / birinci defa mükerrir / ikinci defa mükerrir | m.108 rejimi. |
| **Tekerrüre esas önceki ilam cezası** | yıl + ay + gün (**opsiyonel**) | m.108/2 tavanı: eklenecek miktar, tekerrüre esas cezanın en ağırından fazla olamaz. Boş bırakılırsa tavan uygulanmaz ve sonuç hükümlü aleyhine sapabilir — bu durumda uyarı gösterilmeli. |
| **İnfaza başlama tarihi** | tarih | Takvim hesabının başlangıcı. |
| **Mahsup edilecek süre** | gün | TCK m.63 — gözaltı + tutuklulukta geçen süre. |
| **0-6 yaş çocuklu kadın hükümlü** | evet/hayır | DS süresi 1 yıl yerine 4 yıl. |
| **70 yaş üstü** | evet/hayır | DS süresi 1 yıl yerine 4 yıl. |
| **Açık kurumda en az 3 ay kaldı** | evet/hayır (**koşullu**) | Hâl C'nin (1.5) şartı. Yalnızca suç tarihi hâl C aralığına düşerse gösterilir. İşaretlenmezse hâl C uygulanmaz. |

> **Kapsam notu (1.1b).** Yaş alanı yok: araç yalnızca 18 yaş üstü için
> hesap yapıyor, SSÇ v2'ye bırakıldı. "Birden fazla ceza" alanı da yok:
> v1 tek ilam varsayıyor, m.107/3 tavanları devrede değil. Formun başında
> bu iki varsayım kullanıcıya açıkça söylenmeli — sessiz varsayım, yanlış
> sonuçtan daha kötüdür.

### 1.4. Koşullu salıverilme oranları — ONAYLANDI

Av. Onur Can Yılmaz tarafından doğrulandı; 1.4'teki üç çelişki çözüldü.

**Süreli hapis:**

| Kategori | Oran |
|---|---|
| Genel kural (adi suçlar) | **1/2** |
| Kasten öldürme (TCK 81-83), neticesi sebebiyle ağırlaşmış yaralama (TCK 87/2-d), işkence-eziyet (TCK 94-96), temel cinsel suçlar (TCK 102/1, 104/1, 105), Devlet sırları-casusluk (TCK 326-339) | **2/3** |
| Örgüt kurmak/yönetmek veya örgüt faaliyeti çerçevesinde işlenen suçlar (m.107/4) | **2/3** |
| Nitelikli cinsel suçlar (TCK 102/2, 103, 104/2-3) | **3/4** |
| Uyuşturucu imal ve ticareti (TCK 188) — suç tarihi **30.03.2020 sonrası** | **3/4** |
| Uyuşturucu imal ve ticareti (TCK 188) — suç tarihi **30.03.2020 öncesi** | **2/3** |
| Terör suçları (3713 m.17 özel düzenlemesi) | **3/4** |
| Mükerrir — süreli hapis (m.108) | **2/3** |
| İkinci defa mükerrir ve bazı katalog suçlar (m.108, 7550 s.K. sonrası) | **3/4** |

**Müebbet ve ağırlaştırılmış müebbet — kurumda geçirilecek SABİT süre:**

Bu rakamlar ceza üst sınırı değildir; koşullu salıverilmeden yararlanabilmek
için kurumda kesintisiz geçirilmesi gereken sürelerdir.

| Kategori | Ağırlaştırılmış müebbet | Müebbet |
|---|---|---|
| Genel (m.107/2) | 30 yıl | 24 yıl |
| Örgüt suçları (m.107/4) | 36 yıl | 30 yıl |
| Mükerrir (m.108) | **39 yıl** | **33 yıl** |

**Birden fazla süreli hapis cezasında tavan:**

| Kategori | Tavan |
|---|---|
| Genel (m.107/3) | 28 yıl |
| Örgüt suçları (m.107/4) | 32 yıl |
| Mükerrir (m.108) | **Sabit tavan YOK** — aşağıdaki dinamik kural geçerli |

Tavanın anlamı: cezalar toplanıp oran uygulandığında çıkan süre ne kadar
yüksek olursa olsun, kurumda geçirilecek süre tavanı aşamaz.

> ✅ **DÜZELTME — mükerrirde 32 yıl tavanı YANLIŞTI.** Önceki sürümde
> mükerrir süreli hapis için 32 yıllık sabit bir tavan yazılmıştı; bu
> hatalı. Doğrusu **m.108/2'deki dinamik kural**:
>
> > Tekerrür nedeniyle koşullu salıverilme süresine eklenecek miktar,
> > tekerrüre esas alınan cezanın **en ağırından fazla olamaz.**
>
> Yani tavan sabit bir yıl sayısı değil, tekerrüre esas önceki ilamın
> kendisi. Bu yüzden 1.3'e "tekerrüre esas önceki ilam cezası" alanı
> eklendi.
>
> **m.108/2, ikinci defa tekerrürde uygulanmaz.**
>
> 33 yıl (müebbet) ve 39 yıl (ağırlaştırılmış müebbet) ise doğru ve
> yerinde duruyor — bunlar tavan değil, kurumda geçirilecek sabit süre.

> ✅ **TCK m.188 çelişkisi çözüldü — ve sanılandan farklı bir sebepten.**
> Ayrım fıkra bazlı DEĞİL, **suç tarihi bazlı.** 188/1, 188/3, 188/4 gibi
> fıkralar arasında KS oranı farkı yok; fark 30.03.2020 eşiğinden geliyor:
> bu tarihten sonra işlenen TCK 188 suçlarında 3/4, öncesinde 2/3.
> "Bir kaynak 2/3 diyor" durumunun sebebi bu — o kaynak 2020 öncesi
> uygulamayı anlatıyor. Fıkraları tek tek ayırmaya gerek kalmadı.
>
> Önceki turdaki "yetişkin 3/4, çocuk 2/3" kaydı v1'i ilgilendirmiyor:
> araç zaten yalnızca 18 yaş üstü için hesap yapıyor. Bu ayrım v2'de,
> SSÇ ele alınırken çözülecek.

> ✅ **Oran çakışması — ÇÖZÜLDÜ.** Katalog suç oranı ile mükerrirlik
> oranı çakıştığında **yüksek olan (hükümlü aleyhine olan) oran**
> uygulanır. Örnek: TCK m.188 (3/4) + birinci defa mükerrir (2/3) → **3/4**.
>
> Kodda sonucu tek satır: `oran = max(katalogOrani, mukerrirlikOrani)`.
> İkinci defa tekerrür zaten 3/4 olduğu için aynı kural onu da kapsıyor.

### 1.5. Denetimli serbestlik (m.105/A) — ONAYLANDI

**Temel süre:**

| Durum | DS süresi |
|---|---|
| Standart | KS tarihine **1 yıl** kala |
| **0-6 yaş çocuklu kadın hükümlü** | **4 yıl** |
| **70 yaş üstü hükümlü** | **4 yıl** |

**Ek şart (7550 s.K., yürürlük 04.06.2025):** Hükümlünün DS'den
yararlanabilmesi için, KS tarihine kadar kurumda geçirmesi gereken sürenin
**en az 1/10'unu** ve **her hâlde en az 5 günü** ceza infaz kurumunda
geçirmiş olması gerekir. **Geçici m.11:** bu şart 04.06.2025'ten önce
işlenen suçlara uygulanmaz.

#### Geçici maddelerin birleşimi — ÇÖZÜLDÜ

> **Süreler TOPLANMAZ.** Türk ceza adalet sisteminde infaz sürelerinde
> kümülatif indirim mantığı yoktur. Geçici maddeler üst üste bindiğinde,
> TCK m.7'deki **lehe kanun** ilkesi uyarınca hükümlüye en erken tahliyeyi
> veren kombinasyon uygulanır ("karma uyum").

Suç tarihine ve geçici m.6 istisnası olup olmadığına göre üç hâl:

| Hâl | Koşul | DS süresi |
|---|---|---|
| **A** | 30.03.2020 öncesi işlenmiş **ve** geçici m.6 istisnası **değil** | **3 yıl** — doğrudan geçici m.6 rejimi. m.10/6'nın 3 yıllık erkenliği AYRICA EKLENMEZ. |
| **B** | 30.03.2020 öncesi işlenmiş **ama** geçici m.6 istisnası, buna karşın geçici m.10/6 kapsamında | **1 + 3 = 4 yıl** |
| **C** | Yalnızca geçici m.10/6 kapsamında (30.03.2020 – 31.07.2023 arası işlenmiş) | **1 + 3 = 4 yıl**, açık kurumda en az **3 ay** kalmış olmak şartıyla |

Hâl A'da koşullu salıverilme oranı da (istisnalar hariç) 1/2'dir — bu
zaten 7242 sonrası genel kural, ayrı bir dal gerektirmiyor.

Uygulamada infaz hâkimlikleri her dosya için ayrı müddetname düzenleyip
en erken tahliye tarihini veren maddeyi uygular. Aracın yaptığı da bu:
uygulanabilir hâlleri hesaplayıp **en erken tarihi** seçmek.

> ✅ **İki uygulama kararı — ONAYLANDI.**
>
> **1. DS çakışmasında en erken tarih seçilir.** 0-6 yaş çocuklu kadın
> veya 70+ hükümlü zaten 4 yıl DS alıyor; aynı kişi hâl B/C kapsamına da
> giriyorsa süreler toplanmaz. Uygulanabilir her hâl ayrı ayrı hesaplanır
> ve **en erken DS tarihini veren** sonuç seçilir. "Toplanmaz, lehe olan
> uygulanır" ilkesinin kodda karşılığı budur.
>
> Kodda: `dsTarihi = min(...uygulanabilirHallerinTarihleri)`
>
> **2. "Açık kurumda en az 3 ay" formda sorulur.** Bu bir vakıa; araç
> hesaplayamaz. Hâl C'de forma bir onay kutusu konur:
> *"Açık ceza infaz kurumunda en az 3 ay kaldı"*. İşaretlenmezse hâl C
> uygulanmaz ve sonuç standart rejime göre verilir. Sessiz varsayım
> yapılmaz — hâl C'yi varsaymak tarihi 3 yıl erkene kaydırırdı.
>
> Onay kutusu yalnızca hâl C'nin devreye girebileceği suç tarihi
> aralığında gösterilir; diğer hâllerde formda yer kaplamaz.

### 1.6. Sonuç ekranı — üç tarih birlikte

Cetvel şu üçünü aynı anda göstermeli. (Açık kuruma geçiş dördüncü satır
olacaktı; v1 kapsamı dışına alındı — bkz. 1.1b.)

| Satır | Ne | Dayanak |
|---|---|---|
| 1 | **Koşullu salıverilme tarihi** | 5275 m.107 / m.108 |
| 2 | **Denetimli serbestlik başlangıcı** ve süresi | 5275 m.105/A |
| 3 | **Bihakkın (hak ederek) tahliye tarihi** | Cezanın tamamı |

Bu üçünün altında, `CALCULATOR_DISCLAIMER` ile birlikte 1.1b'deki
**kapsam notu** da görünecek.

### 1.7. Hesaplama adımları (taslak akış)

```
1. Toplam ceza süresini güne çevir  (1 yıl = 365, 1 ay = 30)
2. Mahsup (TCK m.63) → net infaz edilecek süre
3. Suç tarihi eşiklerini belirle: 30.03.2020 / 31.07.2023 / 04.06.2025
4. Suç kategorisi + tekerrür → KS oranını seç
   · çakışma hâlinde YÜKSEK oran (bkz. 1.4 sonu)
5. Kurumda geçirilecek süre:
   · süreli hapis  → net süre × KS oranı
   · müebbet       → tablodaki sabit yıl (orana bakılmaz)
   · mükerrir + önceki ilam verilmişse → m.108/2 tavanını uygula
6. KS tarihi          = infaza başlama + (5)
7. Bihakkın tahliye   = infaza başlama + net süre
8. DS başlangıcı:
   · uygulanabilir her hâl için ayrı tarih hesapla
     (standart 1 yıl · 4 yıl özel durum · hâl A 3 yıl · hâl B/C 4 yıl)
   · hâl C yalnızca "açık kurumda 3 ay" onay kutusu işaretliyse dahil edilir
   · DS tarihi = bu tarihlerin EN ERKENİ (süreler toplanmaz)
   · suç tarihi ≥ 04.06.2025 ise kurumda en az (5)×1/10 ve en az 5 gün
     geçmiş olacak şekilde ileri kaydır
9. Hiçbir tarih infaza başlama tarihinden önce olamaz (alt sınır kontrolü)
```

> ✅ **Süre aritmetiği — ONAYLANDI ve ÖRNEKLE TEYİT EDİLDİ.** İnfaz
> hesabında süreler tamamen güne çevrilir: **1 yıl = 365 gün, 1 ay = 30
> gün.** Takvim esaslı hesap YAPILMAZ.
>
> Teyit: rakip araçlarda 5 yıllık ceza **1825 gün** olarak işleniyor
> (5 × 365 = 1825, tam bölünüyor). Artık yıl farkı yok — yani gerçek
> takvim kullanılmıyor, sabit konvansiyon kullanılıyor.
>
> Kodda sonucu: `toplamGun = yil * 365 + ay * 30 + gun`. Tarihler bu gün
> sayısının infaza başlama tarihine eklenmesiyle bulunur.

### 1.8. Kaynaklar

Aşağıdakilerin tamamı **ikincil kaynaktır.** Birincil kaynak `mevzuat.gov.tr` üzerindeki 5275 sayılı Kanun'un güncel metnidir; bu ortamdan erişilemedi (bağlantı zaman aşımına uğruyor), doğrulamada esas alınacak metin odur.

- [5275 s.K. m.107 — Koşullu Salıverilme (Baran Doğan)](https://barandogan.av.tr/blog/mevzuat/infaz-kanunu-madde-107-kosullu-saliverilme.html)
- [Koşullu Salıverilme, 5275 m.107 (Av. Mete Şahin)](https://www.avukatmetesahin.com/post/kosullu-saliverilme-sartli-tahliye)
- [Koşullu Salıverilme 2026 — oranlar ve tablolar (Kadim Hukuk)](https://kadimhukuk.com.tr/makale/kosullu-saliverilme-sartli-tahliye-nedir/)
- [10. Yargı Paketi ile İnfaz Kanunu'nda Yapılan Değişiklikler (Haliç Avukatlık)](https://halicavukatlikdanismanlik.com/10-yargi-paketi-ile-infaz-kanununda-yapilan-degisiklikler/)
- [7550 sayılı Kanun tam metni (Alomaliye)](https://www.alomaliye.com/2025/06/04/7550-sayili-ceza-ve-guvenlik-tedbirlerinin-infazi-hakkinda-kanun/)
- [7456 sayılı Kanunla Getirilen Geçici İnfaz Usulü — geçici m.10 (Ersan Şen)](https://sen.av.tr/en/makale/7456-sayili-kanunla-getirilen-gecici-infaz-usulu)
- [30.03.2020'ye kadar işlenen örgütlü suçlarda DS — geçici m.6 (Ersan Şen)](https://sen.av.tr/tr/makale/30.03.2020-tarihine-kadar-islenen-orgutlu-suclarda-denetimli-serbestlik-ve-orgutten-ayrilmanin-tespitinde-temadinin-kesilmesi-sorunu)
- [7242 s.K.'ya göre koşullu salıverilme oranları tablosu (TBB)](https://d.barobirlik.org.tr/2020/kosullusaliverilmeoranlari/3/)
- [İnfaz Kanunu m.108 — Mükerrirlere Özgü İnfaz Rejimi (Başbuğ & Zanbak)](https://basbugzanbak.av.tr/infaz-kanunu-108-madde-mukerrirlere-ozgu-infaz-rejimi-2025/)
- [11. Yargı Paketi Resmî Gazete'de — 7571 s.K. (Sanal Hukuk)](https://sanalhukuk.org/2025/12/25/11-yargi-paketi-resmi-gazetede-yayimlandi-31-temmuz-infaz-duzenlemesi/)
- [11. Yargı Paketi duyurusu (TBB)](https://www.barobirlik.org.tr/Haberler/kamuoyunda-11-yargi-paketi-olarak-adlandirilan-kanun-resmi-gazetede-yayimlanmistir-86169)
- [12. Yargı Paketi — 7589 s.K. neleri değiştirdi (Büken)](https://buken.av.tr/12-yargi-paketi-7589-sayili-kanun/)
- [TCK 188 fıkraları ve infaz oranları (Ulus Hukuk)](https://ulus.av.tr/tck-188/)

**Rakip araç incelemesi (Av. Onur Can Yılmaz, beş araç):** kadimhukuk,
kararara, dcahukuk, ayboga, topaktas. Bu araçlar 365 gün
konvansiyonunun ve v2'ye bırakılan açık kurum tablosunun kaynağı. **Rakip aracın çıktısı
kaynak değildir** — yalnızca resmî metinde neye bakılacağını gösterir.

### 1.9. Onay durumu

**✅ Formülün tamamı kapandı — açık hukuki soru kalmadı.**

| Konu | Cevap |
|---|---|
| Örgüt suçlarında süreli hapis oranı | 2/3 (m.107/4); terör 3713 m.17 gereği 3/4 |
| TCK m.188 | Ayrım **fıkra değil tarih** bazlı: 30.03.2020 sonrası 3/4, öncesi 2/3 |
| Mükerrir 33/39 yıl | Müebbet 33, ağırlaştırılmış müebbet 39 (sabit süre) |
| Mükerrir "32 yıl tavan" | Yanlıştı, kaldırıldı — m.108/2 dinamik kuralı geçerli |
| Süre aritmetiği | 1 yıl = 365, 1 ay = 30 — örnekle teyit edildi |
| Suç kategorisi sunumu | Sade dil |
| 7571 (11. paket) | Geçici m.10/6 — belgeye işlendi |
| 7589 (12. paket) | 5275'e dokunmuyor — etkisiz |
| v1 kapsamı | Karara bağlandı (1.1b) |
| **Geçici maddelerin birleşimi** | **Toplanmaz** — lehe olan / karma uyum; hâl A/B/C tablosu (1.5) |
| **Oran çakışması** | **Yüksek oran uygulanır** — `max(katalog, mükerrirlik)` |

**⬜ Yayın için kalan üç adım:**

1. **Test senaryolarının beklenen tarihleri** (1.10) — girdi tarafı
   dolduruldu (24 senaryo), beklenen dört tarih boş. Mevzuat kontrolü
   sonrası birlikte hesaplanacak.
2. **Resmî metin kontrolü** (1.12) — `mevzuat.gov.tr` üzerinden.
3. **Onay Durumu'nun "Onaylandı"ya çevrilmesi** — bundan sonra kod yazılır.

1.5'teki iki uygulama kararı (DS çakışmasında en erken tarih, "açık
kurumda 3 ay" için onay kutusu) **onaylandı** ve belgeye işlendi.

### 1.10. Test senaryoları — v1 çekirdek

**Girdi tarafı dolduruldu. Beklenen tarihler BİLİNÇLİ OLARAK BOŞ** —
mevzuat kontrolü bitince Av. Onur Can Yılmaz ile birlikte hesaplanıp
doldurulacak, sonra Vitest fikstürüne çevrilecek.

Senaryolar tek tek bir dalı zorlamak için seçildi; "gerçekçi dosya"
olmaları değil, **kapsama** amaçlanıyor. Hepsi v1 kapsamında: 18 yaş
üstü, tek ilam.

Kısaltmalar: **T** = tekerrür, **M** = mahsup (gün), **İB** = infaza
başlama.

#### Temel dallar

| # | Suç tarihi | Ceza | Kategori | T | İB | M | Neyi doğrular |
|---|---|---|---|---|---|---|---|
| 1 | 10.09.2024 | 5 yıl | Adi suç | yok | 01.03.2026 | 0 | En sade hâl: oran 1/2, DS standart 1 yıl, 1/10 şartı yok |
| 2 | 10.09.2024 | 5 yıl | Adi suç | yok | 01.03.2026 | 90 | TCK m.63 mahsup dalı (1 numaradan tek farkı bu) |
| 3 | 15.11.2024 | 18 yıl | Kasten öldürme (TCK 81) | yok | 20.01.2026 | 240 | Katalog oran 2/3 |
| 4 | 05.06.2021 | 10 yıl | Uyuşturucu ticareti (TCK 188) | yok | 12.04.2026 | 150 | TCK 188 → 3/4 (suç tarihi 30.03.2020 sonrası) **ve** DS hâl C |
| 5 | 12.01.2019 | 10 yıl | Uyuşturucu ticareti (TCK 188) | yok | 03.02.2026 | 0 | Aynı suç, 30.03.2020 **öncesi** → 2/3. Tarih bazlı ayrımı doğrular |

#### Tekerrür ve oran çakışması

| # | Suç tarihi | Ceza | Kategori | T | Önceki ilam | İB | M | Neyi doğrular |
|---|---|---|---|---|---|---|---|---|
| 6 | 20.03.2024 | 6 yıl | Adi suç (hırsızlık) | 1. defa mükerrir | 2 yıl | 10.05.2026 | 0 | Mükerrir oranı 2/3 **ve** m.108/2 tavanı |
| 7 | 08.02.2024 | 12 yıl | Uyuşturucu ticareti (TCK 188) | 1. defa mükerrir | 3 yıl | 01.06.2026 | 0 | **Oran çakışması**: max(3/4, 2/3) = 3/4 |
| 8 | 19.05.2024 | 9 yıl | Adi suç | 2. defa mükerrir | — | 15.07.2026 | 60 | İkinci tekerrür 3/4; m.108/2 tavanı UYGULANMAZ |

#### Denetimli serbestlik hâlleri (1.5 tablosu)

| # | Suç tarihi | Ceza | Kategori | Özel durum | İB | M | Neyi doğrular |
|---|---|---|---|---|---|---|---|
| 9 | 18.06.2018 | 7 yıl | Adi suç | — | 04.02.2026 | 0 | **Hâl A**: geçici m.6 → DS 3 yıl, erkenlik eklenmez |
| 10 | 22.02.2022 | 6 yıl | Adi suç | açık kurumda 3 ay: **evet** | 08.03.2026 | 0 | **Hâl C**: DS 1+3 = 4 yıl |
| 11 | 22.02.2022 | 6 yıl | Adi suç | açık kurumda 3 ay: **hayır** | 08.03.2026 | 0 | 10 ile aynı, kutu işaretsiz → hâl C uygulanmaz, standart 1 yıl |
| 12 | 14.10.2024 | 8 yıl | Adi suç | 70 yaş üstü | 20.02.2026 | 0 | DS 4 yıl |
| 13 | 25.12.2024 | 4 yıl | Adi suç | 0-6 yaş çocuklu kadın | 11.03.2026 | 0 | DS 4 yıl |
| 14 | 22.02.2022 | 6 yıl | Adi suç | 70 yaş üstü + açık kurumda 3 ay: evet | 08.03.2026 | 0 | **DS çakışması**: 4 yıl ile hâl C birlikte → en erken tarih seçilmeli, süreler toplanmamalı |

#### 7550 şartı (1/10 + asgari 5 gün)

| # | Suç tarihi | Ceza | Kategori | İB | M | Neyi doğrular |
|---|---|---|---|---|---|---|
| 15 | 15.09.2025 | 3 yıl | Adi suç | 02.02.2026 | 0 | Suç tarihi 04.06.2025 **sonrası** → 1/10 şartı devrede |
| 16 | 15.09.2025 | 3 ay | Adi suç | 05.01.2026 | 0 | 1/10 hesabı 5 günün altına düşüyor → **asgari 5 gün tabanı** devreye girer |
| 17 | 20.05.2025 | 3 yıl | Adi suç | 02.02.2026 | 0 | Suç tarihi 04.06.2025 **öncesi** → geçici m.11, şart uygulanmaz (15 ile karşılaştırmalı) |

#### Müebbet ve ağırlaştırılmış müebbet

| # | Suç tarihi | Ceza | Kategori | T | İB | M | Neyi doğrular |
|---|---|---|---|---|---|---|---|
| 18 | 11.11.2024 | Müebbet | Kasten öldürme | yok | 03.03.2026 | 420 | Sabit 24 yıl; orana bakılmaz |
| 19 | 02.05.2024 | Ağırlaştırılmış müebbet | Nitelikli kasten öldürme | yok | 15.09.2026 | 300 | Sabit 30 yıl |
| 20 | 07.07.2024 | Müebbet | Kasten öldürme | 1. defa mükerrir | 01.10.2026 | 0 | Mükerrir müebbet → 33 yıl |
| 21 | 07.07.2024 | Ağırlaştırılmış müebbet | Nitelikli kasten öldürme | 1. defa mükerrir | 01.10.2026 | 0 | Mükerrir ağ. müebbet → 39 yıl |

#### Eşik günü sınır testleri

Bu üçü, "tarihe kadar" ifadesinin o günü **içerip içermediğini** ayırmak
için var. Resmî metin kontrolünde özellikle bakılmalı: eşik günü hangi
tarafa düşüyor?

| # | Suç tarihi | Ceza | Kategori | İB | Neyi doğrular |
|---|---|---|---|---|---|
| 22 | 30.03.2020 | 5 yıl | Adi suç | 01.04.2026 | Geçici m.6 eşiğinin tam günü |
| 23 | 31.07.2023 | 5 yıl | Adi suç | 01.04.2026 | Geçici m.10/6 eşiğinin tam günü |
| 24 | 04.06.2025 | 3 yıl | Adi suç | 01.04.2026 | 7550 / geçici m.11 eşiğinin tam günü |

#### Doldurulurken dikkat

- **4 ve 5 numara aynı suçu farklı tarihlerde** kullanıyor; ikisinin
  oranı farklı çıkmazsa tarih bazlı ayrım yanlış kodlanmış demektir.
- **10 ve 11 numara yalnızca onay kutusunda ayrılıyor**; sonuçları aynı
  çıkarsa kutu hiç okunmuyor demektir.
- **14 numara en kritik senaryo**: süreler toplanırsa 7 yıl çıkar,
  doğru davranışta 4 yıl çıkmalı.
- **Uyuşturucu ticaretinin geçici m.6 istisnası olup olmadığı**
  netleşmeli — 5 numaranın DS hâli buna bağlı (hâl A mı, hâl B mi).
- Her senaryoda hangi rakip aracın hangi sonucu verdiği not edilirse,
  araçlar çeliştiğinde hangisinin resmî metinle uyuştuğu ayırt edilebilir.

**Teyit edilmiş tek veri noktası:** 5 yıllık ceza = **1825 gün**
(5 × 365) — 365 gün konvansiyonunu doğruluyor (bkz. 1.7).

### 1.11. v2 senaryoları — şimdilik toplanmayacak

SSÇ (çocuk hükümlü) ve açık cezaevine geçiş senaryoları v1 kapsamı
dışında (bkz. 1.1b). v2 açıldığında bu başlık altında toplanacak;
şu an boş bırakılması bilinçlidir — v1 fikstürüne karışmasınlar.

### 1.11b. Rakip araç karşılaştırması — 14 Eylül 2026

Üç aracın yayımladığı kurallar tek tek çıkarılıp belgemizle
karşılaştırıldı: **kadimhukuk**, **ayboga**, **topaktas**.
(dcahukuk sayfası 403 verdi, kararara taranmadı.)

> **Yöntem notu:** Bu araçların JavaScript'i çalıştırılamadı; yayımladıkları
> kural metinleri ve çözülmüş örnekler okundu. Uyuşma doğruluk kanıtı
> değil — TÜFE serisinde birden çok kaynak aynı yanlışı yazıyordu.
> Değerli olan **ayrışma**: hangi kuralın tartışmalı olduğunu gösteriyor.

#### ✅ Üç kaynakta da doğrulanan (bizimle uyumlu)

| Konu | Durum |
|---|---|
| 1 yıl = 365 gün, 1 ay = 30 gün | Üçü de aynı — en temel varsayımımız bağımsız olarak doğrulandı |
| Müebbet 24 yıl, ağırlaştırılmış müebbet 30 yıl | Üçü de aynı |
| Mükerrir müebbet 33 / ağ. müebbet 39 | topaktas aynı |
| TCK 188 → 3/4 (30.03.2020 sonrası) | Uyumlu |
| m.108/2 tavanı | topaktas'ın örneği bizim anlayışımızla birebir: 10 yıl ceza, 1. tekerrür → tekerrürlü KS 6 yıl 8 ay, ekleme 1 yıl 8 ay; önceki ilam 1 yıl ise ekleme 1 yılı geçemez → gerçek KS 6 yıl |

#### ⚠️ Ayrışmalar — mevzuat kontrolünde bakılacak

**1. Hâl A'da DS süresi: 3 yıl mı, 6 yıl mı?**

| Kaynak | 30.03.2020 öncesi adi suç |
|---|---|
| **Belgemiz (hâl A)** | **3 yıl** — m.10/6 erkenliği ayrıca eklenmez |
| kadimhukuk | 3 yıl |
| topaktas | 3 yıl (geçici m.6), 7571 erkenliğini ayrı mekanizma sayıyor |
| **ayboga** | **6 yıl (3+3)** — geçici m.6 + m.10/6 toplanıyor |

ayboga doğrudan **topluyor.** Bu, "süreler toplanmaz, en lehe olan
uygulanır" kararımızla çelişiyor. Üç yıllık fark, tahliye tarihini üç
yıl kaydırır — karşılaştırmanın en ağır bulgusu.

**2. Açık kurumda kalma şartı: tek eşik mi, ceza süresine bağlı mı?**

| Kaynak | Şart |
|---|---|
| **Belgemiz (hâl C)** | En az **3 ay** |
| ayboga | <10 yıl → **1 ay**, ≥10 yıl → cezanın **1/10'u** |
| topaktas | <10 yıl → **1 ay**, ≥10 yıl → **3 ay** |

İki kaynak da şartı **ceza süresine bağlıyor**, bizim belge tek bir
"3 ay" diyor. Doğruysa formdaki onay kutusu yeniden tasarlanmalı: tek
kutu yetmez, eşik cezaya göre değişir.

**3. Küsurat kuralı — belgemizde HİÇ YOK**

Oran uygulandığında yarım gün çıkabiliyor (1.665 gün × 1/2 = 832,5).
Belgemiz bu durumu hiç ele almıyor; kod yazılırken keyfî bir karar
vermek zorunda kalırdık.

| Kaynak | Kural |
|---|---|
| ayboga | "Küsuratlar hükümlü lehine yorumlanır", yukarı yuvarlanır |
| kadimhukuk | Metinde "hükümlü lehine" diyor, ama kendi örneğinde 832,5 → **833** gün kurumda kalma çıkarıyor — bu hükümlü **aleyhine**. Kaynak kendi içinde tutarsız. |
| topaktas | Belirtmiyor |

**4. İkinci defa tekerrürde tarih penceresi**

ayboga, ikinci tekerrürde 3/4 oranının **01.06.2024 – 04.06.2025**
aralığıyla sınırlı olduğunu söylüyor. Belgemizde böyle bir pencere yok;
7550 sonrası genel kural olarak kaydettik. Diğer iki kaynak da pencere
belirtmiyor.

**5. Katalog listeleri birbirini tutmuyor**

| Suç grubu | Belgemiz | Ayrışma |
|---|---|---|
| TCK 132-138 (özel hayata karşı) | Yok | kadimhukuk 2/3'e koyuyor |
| TCK 302-325 (devlet güvenliği) | Yok | kadimhukuk 3/4'e, topaktas 2/3'e koyuyor |
| TCK 326-339 (devlet sırları) | 2/3 | kadimhukuk'ta yok |
| TCK 220 (örgüt) | m.107/4 üzerinden 2/3 | topaktas açıkça 2/3 listesinde |

**6. Açık kuruma geçiş (v1 kapsamı dışı, not olarak)**

topaktas bizim v2 notumuzla uyuşuyor (≤3 yıl doğrudan, 3-10 yıl KS'ye
7 yıl kala, >10 yıl 1/10 + 7/5 yıl). **kadimhukuk tamamen farklı** bir
kural veriyor: kapalıda 1/3 + KS'ye 1 yıl kala. Muhtemelen güncellenmemiş.
v2'ye geçildiğinde bu ayrışma çözülmeli.

### 1.11c. Kod düzeyinde inceleme — 18 Eylül 2026

Formlarına değer girip sonuç okumak mümkün olmadı (araçların JavaScript'i
çalıştırılamıyor). Bunun yerine **hesap mantığının kendisi okundu**:
topaktas'ın sayfasındaki 63 KB'lık satır içi betik çıkarılıp algoritma
birebir yeniden çalıştırıldı. Bu, form çıktısı karşılaştırmaktan güçlü —
kuralın ne olduğunu değil, ne yapıldığını gösteriyor.

(ayboga'nın hesap betiği fetch edilen sayfada bulunmadı; aşağıdaki
sonuçlar topaktas'ın kodundan.)

#### Çalıştırılan senaryo

12 yıl · adi suç · suç tarihi **15.06.2019** (30.03.2020 öncesi) ·
tekerrür yok · infaza başlama 01.03.2026 · mahsup yok

| Çıktı | Tarih |
|---|---|
| Koşullu salıverilme | 28.02.2032 (2.190 gün) |
| Bihakkın tahliye | 26.02.2038 |
| Açık kuruma geçiş | 13.05.2027 |
| **DS — standart** | **28.02.2029** — KS'den **3,00 yıl** önce |
| **DS — 7571 erken** | **28.08.2026** — KS'den **5,51 yıl** önce |

#### 🔴 Belgemiz burada YANLIŞ — hâl A düzeltilmeli

Belgemiz hâl A için *"3 yıl — m.10/6'nın erkenliği AYRICA EKLENMEZ"*
diyor. topaktas'ın kodu bunu yapmıyor:

```js
if (sucTarihi <= D_31072023 && !ex11) { … dsErken hesaplanır … }
```

Eşik **31.07.2023** ve bu, 30.03.2020 öncesi suçları da kapsıyor.
Yani geçici m.6'nın 3 yılı **üstüne** 7571 erkenliği geliyor. ayboga'nın
"6 yıl (3+3)" özeti bu birleşik etkiyi anlatıyor; topaktas aynı sonucu
iki ayrı tarih olarak sunuyor. **İki araç da aynı yere varıyor —
çelişki anlatım farkıymış.** Belgemiz ise ikisinden de ayrışıyor.

Ama erkenlik ham bir toplama değil; kodda **iki niteliği** var:

1. **Başvuruya bağlı.** Kodun kendi açıklaması: *"infaz hâkimliğine
   başvurulması halinde standart tarihlerden 3'er yıl önce … çıkış
   mümkündür. Başvuru zorunludur — otomatik değildir."* Yani araç bunu
   kesin tarih olarak değil, **koşullu ikinci tarih** olarak göstermeli.
2. **Tabanı var.** `dsErken = max(standartDS − 3 yıl, açığa ayrılma + 90 gün)`
   Senaryoda ham 3+3 hesabı 01.03.2026 verirdi; taban onu 28.08.2026'ya
   itti — 5,51 yıl, 6 değil.

#### ✅ Önceki ayrışma kaydımdaki bir hatanın düzeltmesi

§1.11b/2'de "açık kurumda 3 ay şartı ceza süresine göre 1 ay/3 ay
olmalı" demiştim. Kod ikisini **ayrı taban** olarak kullanıyor:

| Taban | Değer |
|---|---|
| Açık kuruma **erken** ayrılma | ceza < 10 yıl → 30 gün, ≥ 10 yıl → 90 gün kapalıda |
| **DS** erken çıkışı | her hâlde açığa ayrıldıktan **90 gün** sonra |

DS tarafında bizim "en az 3 ay" rakamımız **doğruymuş**. 30/90 ayrımı
açık kuruma geçişe ait — o da v1 kapsamı dışında.

#### ✅ Oran çakışması kararımız kodla doğrulandı

```js
if (tekerrur === '1' && base < 2/3) base = 2/3;   // yükseltir, ezmez
if (tekerrur === '2') base = 0.75;
```

Birinci tekerrür oranı **yükseltiyor, ezmiyor** — TCK 188'den 3/4 alan
bir mükerrir 3/4'te kalıyor. Bu, `max(katalogOranı, mükerrirlikOranı)`
kuralımızın birebir karşılığı.

#### 🆕 v2 sorusunu cevaplayan bulgu — SSÇ katsayıları

Belgemizde "1/3 ve 1/2 katsayıları neye uygulanıyor" sorusu v2'ye
ertelenmişti. topaktas'ın kodu bunu **gün çarpanı** olarak uyguluyor,
KS oranı olarak değil:

> 15 yaş altı → 1 fiilî gün = **3 ceza günü**
> 15–18 yaş → 1 fiilî gün = **2 ceza günü**

Dayanak olarak 5275 geçici m.6 gösteriliyor. v2'ye geçildiğinde bu
yorum doğrulanmalı.

#### 🆕 Belgemizde hiç olmayan kural

Terör suçu + tekerrüre esas önceki suç da TMK kapsamındaysa **koşullu
salıverilme hiç uygulanmıyor** (TMK m.17/3). Kodda açık bir dal olarak
var. v1 kapsamımızda terör suçu bulunduğu için bu eklenmeli.

#### 7571 muafiyet listesi (koddan)

2. tekerrür · nitelikli cinsel saldırı · çocuğun cinsel istismarı ·
nitelikli reşit olmayanla cinsel ilişki · terör · örgüt kurma · örgüt
faaliyeti çerçevesinde işlenen suç · basit cinsel suçlar

### 1.12. Kapanmadan önce yapılacak son kontrol

Onay, `mevzuat.gov.tr` üzerindeki **resmî metinle** yapılacak. Kontrol
listesi:

- [ ] m.107 tam metni — 1.4'teki oran tablosunun her satırı
- [ ] m.107/4 örgüt oranı (2/3 olarak işaretlendi, teyit bekliyor)
- [ ] m.108 tam metni — 33/39 yıl ve m.108/2'nin lafzı
- [ ] m.105/A tam metni — 1/10 + 5 gün şartı
- [ ] TCK m.188 — tarih bazlı ayrımın doğrulanması
- [ ] Geçici m.6, m.10/6, m.11 — hâl A/B/C tablosunun (1.5) doğrulanması
- [ ] 7571 yeni bir geçici madde mi ekledi, yoksa m.10'a 6. fıkra mı
- [ ] m.107/m.108 çakışmasında yüksek oranın uygulandığının teyidi
- [ ] 13. Yargı Paketi yürürlüğe girdi mi
- [ ] **Hâl A'da erkenlik uygulanıyor mu** — kod uyguluyor, belgemiz uygulamıyordu; belgemiz yanlış görünüyor (1.11c)
- [ ] **Erken çıkış başvuruya mı bağlı** — koda göre otomatik değil; araç koşullu ikinci tarih göstermeli (1.11c)
- [ ] **Terör + önceki TMK suçu → KS yok** (TMK m.17/3) — belgemizde hiç yok (1.11c)
- [x] ~~Açık kurum şartı tek eşik mi~~ — çözüldü: DS tabanı her hâlde 90 gün, 30/90 ayrımı açık kuruma geçişe ait (1.11c)
- [ ] **Küsurat kuralı** — belgede hiç yok, karara bağlanmalı (1.11b/3)
- [ ] **İkinci tekerrürde 3/4** bir tarih penceresiyle sınırlı mı (1.11b/4)
- [ ] **Katalog listeleri** — TCK 132-138, 302-325, 326-339, 220 (1.11b/5)

- **Onay Durumu:** ⬜ Bekliyor

## 2. Araç Değer Kaybı Hesaplama

> **Durum: HESAPLAMA ARACI DEĞİL — BİLGİLENDİRME SAYFASINA DÖNÜŞTÜRÜLDÜ.**
> Av. Onur Can Yılmaz 20 Eylül 2026'da 2.5'teki **A seçeneğini** onayladı.
> `src/lib/` altına bu araç için hiçbir kod yazılmadı ve yazılmayacak;
> `CALCULATORS` listesinden çıkarıldı. İçerik
> `src/content/blog/arac-deger-kaybi-yeni-donem.md` dosyasında, yayın
> adresi `/blog/arac-deger-kaybi-yeni-donem`. Uygulama ayrıntısı 2.7'de.

### 2.1. 🔴 Kesin cevap: Ek-1 tamamen kaldırıldı

**Resmî Gazete 12.06.2026, Sayı 33278** — Sigortacılık ve Özel Emeklilik
Düzenleme ve Denetleme Kurumu (SEDDK), *Karayolları Motorlu Araçlar
Zorunlu Mali Sorumluluk Sigortası Genel Şartlarında Değişiklik
Yapılmasına Dair Genel Şartlar*:

> **MADDE 6-** Aynı Genel Şartların **Ek-1'i**, Ek-2'si, Ek-3'ü ve
> Ek-7'si **yürürlükten kaldırılmıştır.**
>
> **MADDE 8-** Bu Genel Şartlar **1/7/2026** tarihinde yürürlüğe girer.

Soru "kaldırdı mı, yanına mı ekledi" idi. Cevap: **kaldırdı.** Yanına
bir şey eklenmedi; ek bütünüyle yürürlükten kalktı.

### 2.2. Yerine ne geldi — yeni A.5/a

Aynı değişikliğin MADDE 2'si, Maddi Zararlar Teminatını yeniden
yazmış. Değer kaybına ilişkin cümle:

> Değer kaybı, Kurum tarafından belirlenecek usul ve esaslara göre
> atanacak sigorta eksperi tarafından **aracın markası, yaşı, modeli,
> kullanılmışlık düzeyi, hasar gördüğü kısımları, geçmiş hasar durumu
> ve aracın kaza tarihinden önceki ikinci el satış değeri ile
> onarılmasından sonraki ikinci el satış değerinin arasındaki fark**
> dikkate alınarak tespit edilir.

Katsayı yok, tablo yok, formül yok. Yedi unsur sayılıyor ve tespit
ekspere bırakılıyor.

Aynı madde iki şey daha getirmiş:

- Araç hasarı için başvuran hak sahibi, **değer kaybı talebinde de
  bulunmuş sayılıyor** — ayrı başvuru şartı kalktı.
- Eksper atanmışsa, değer kaybı tutarına **raporunda yer vermek
  zorunda**; sigortacı bunu nihai raporun ulaştığı günü takip eden iş
  günü içinde hak sahibine bildiriyor.

### 2.3. Ek-1'in tam tarihçesi — dördü de birincil kaynaktan

| Dönem | Ek-1'in içeriği | Kaynak |
|---|---|---|
| 14.05.2015 – 19.03.2020 | Parça bazlı puanlama: T1 (kaynaklı ana parça değişimi) + T2 (düzeltme, eksper 1-5 puanlıyor) + T3 (diğer parçalar) + T4 (boya), ardından km düzeltmesi | RG 14.05.2015 / 29355 |
| 20.03.2020 – 03.12.2021 | **Baz Değer Kaybı = Rayiç × %19**, sonra × hasar boyutu katsayısı (A1 0,90 … A4 0,25) × km katsayısı (0,90 … 0,10) | RG 20.03.2020 / 31074, MADDE 6 |
| 04.12.2021 – 30.06.2026 | **R × K × HK × T × G** — araç koduna bağlı Rayiç Değer (R) ve Kullanılmışlık (K) katsayıları; Hasar Katsayısı (HK), 30'dan fazla parça kodu için Parça Değişim (P) / Onarım (O) ve Boya (Y) katsayılarından türetiliyor | RG 04.12.2021 / 31679 |
| **01.07.2026 –** | **YOK — ek yürürlükten kaldırıldı** | RG 12.06.2026 / 33278, MADDE 6 |

> 🔴 **Piyasadaki hesap makineleri güncel değil.** İncelenen sitelerin
> kullandığı `Rayiç × %19 × hasar katsayısı × km katsayısı` formülü
> yalnızca **20.03.2020 – 03.12.2021** arasında yürürlükteydi. Aralık
> 2021'de R×K×HK×T×G sistemiyle değiştirildi, Temmuz 2026'da ise ek
> tamamen kaldırıldı. Yani o araçlar **beş yıldır yürürlükte olmayan**
> bir formülü uyguluyor.
>
> Bu, ikincil kaynağa güvenmemenin neden önemli olduğunun somut örneği:
> iki site de aynı formülü veriyordu ve ikisi de eskiydi.

### 2.4. 2021 formülü de otomatikleştirilemez

Kaldırılmadan önceki son hâl (04.12.2021) hesaplanabilir gibi görünse
de değil:

- **Madde 1:** "Değer kaybı tazminatı, sigorta eksperi tarafından
  **ayrıca düzenlenen bir değer kaybı raporu** ile hesaplanır."
- Piyasa değeri, **TSB Kasko Araç Değer Listesi** ile **TOBB SEİK
  Piyasa Değer Listesi** bedellerinin ortalaması; ikisinde de yoksa
  eksper araştırıyor.
- R ve K katsayıları **araç koduna** göre ayrı tablolardan geliyor.
- HK, 30'dan fazla parça kodunun her biri için ayrı P/O ve Y
  katsayılarından türetiliyor.

Bir web formunun toplayamayacağı girdiler: araç kodu, parça parça
işlem listesi, iki ayrı sektörel değer listesindeki bedeller.

### 2.5. Karar — A seçeneği onaylandı (20 Eylül 2026)

Kodlama durdurulmuş, üç seçenek sunulmuştu. **A seçeneği seçildi.**

| # | Seçenek | Değerlendirme |
|---|---|---|
| **A** | **Bilgilendirme sayfasına çevir** | Güncel rejimde hesaplanacak bir şey olmadığı için en dürüst seçenek. İçerik: yeni A.5/a'nın saydığı yedi unsur, ayrı başvuru şartının kalkması, eksper raporunun rolü, kaza tarihine göre hangi rejimin uygulandığı, AYM 2022/167 ve SEİK 2024/1'in etkisi |
| B | 01.07.2026 öncesi kazalar için 2021 formülünü kodla | Girdiler bir web formuna sığmıyor (2.4); ayrıca kullanıcı kitlesi zamanaşımıyla küçülüyor |
| C | Hiç yapma, listeden çıkar | Konu çok aranıyor; bilgilendirme sayfası bu talebi karşılayabilir |

**Önerim: A.** Araç `CALCULATORS` listesinden çıkarılır, içerik Sigorta
Hukuku çalışma alanının altına bir sayfa ya da blog yazısı olarak
konur. "Hazırlanıyor" etiketiyle beklemek yanlış vaat olur.

### 2.7. A seçeneğinin uygulanması — 20 Eylül 2026

**Yapılanlar:**

| Dosya | Değişiklik |
|---|---|
| `src/content/blog/arac-deger-kaybi-yeni-donem.md` | Bilgilendirme yazısı. Rakam üreten hiçbir form yok |
| `src/lib/calculators.ts` | `arac-deger-kaybi` kaydı silindi; yerine gerekçeyi ve yazının adresini gösteren yorum bırakıldı |
| `src/content/practice-areas/sigorta-hukuku.md` | Değer kaybı paragrafından yazıya bağlantı |
| `src/pages/hesaplama-araclari/index.astro` | Meta açıklamasındaki "araç değer kaybı" ibaresi kaldırıldı — artık listede olmayan bir aracı vaat ediyordu |
| `src/content.config.ts`, `src/pages/blog/[slug].astro` | Blog şemasına isteğe bağlı `ctaTitle` / `ctaMessage`; yazı sonundaki iletişim bloğu konuya göre özelleşebiliyor |

**Yazının kapsadığı altı başlık** (talep edilen içerik listesi):

1. Yeni A.5/a'nın saydığı yedi unsur — hüküm aynen alıntılanıp maddelendi
2. Ayrı başvuru şartının kalkması + eksperin raporda tutarı gösterme zorunluluğu
3. Hesabın neden kullanıcı tarafından yapılamayacağı — "formül kalmadı", girdi bir forma sığmıyor
4. Kaza tarihine göre dört dönem. **Bilinçli olarak oran/katsayı verilmedi**; yalnızca "hangi dönem hangi kurala tabi"
5. AYM 2022/167 ve SEİK 2024/1 — reel piyasa analizi
6. CTA: "Değer kaybı talebinizin ne kadar olabileceğini birlikte değerlendirelim" + WhatsApp/telefon

**AYM ve SEİK'in doğrulama durumu.** İkisi de 2.6'da yalnızca künye
olarak duruyordu; yazıya girmeden önce ayrıca araştırıldı:

- **SEİK 2024/1 — birincil kaynaktan okundu.** TOBB Sigorta Eksperleri
  İcra Komitesi'nin kendi duyuru sayfası: tarih **29.04.2024**, içerik
  şu: SBM sistemi üzerinden düzenlenen değer kaybı raporlarında, genel
  şartlara göre hesaplanan tutarın **yanı sıra** reel piyasa analizi
  yöntemiyle yapılan değerlendirmeye de yer verilecek. Gerekçe olarak
  "tarafların mağduriyet yaşamaması" ve AYM kararı gösteriliyor.
  **"Yanı sıra" vurgusu önemli: yerine geçmiyor, ekleniyor.**
- **AYM E.2021/82, K.2022/167 — birincil metne ULAŞILAMADI.** Bu
  oturumda resmigazete.gov.tr sertifika hatası verdi, AYM norm kararlar
  bilgi bankası ise JS ile yükleniyor. Künye (29.12.2022 tarihli karar,
  RG **14.02.2023, Sayı 32104**) ve hüküm (KTK m.90/1'in ikinci cümlesi
  ile m.90/2 iptal, m.92'nin (l) bendine ilişkin istem ret) birbirinden
  bağımsız ikincil kaynaklarda aynı. Yazıda yalnızca bu künye ve hüküm
  aktarıldı; yürürlüğün ertelenip ertelenmediğine **değinilmedi**, çünkü
  bu nokta doğrulanamadı.

  ⚠️ **Açık iş:** RG 14.02.2023 / 32104 metnine erişim sağlandığında
  hüküm fıkrası birebir teyit edilmeli. Teyit edilene kadar yazıdaki
  AYM paragrafı bu belgede "ikincil kaynağa dayanıyor" olarak işaretli
  kalır.

**Mahrumiyet bedeli (§ 5) için uyarı.** Kaldırılan ekler arasında Ek-2
ve Ek-3 de var. § 5'e geçmeden önce bu iki ekin ne düzenlediği ve
mahrumiyet bedelinin bugün neye dayandığı aynı yöntemle kontrol
edilmeli — aynı sürprizle karşılaşma ihtimali yüksek.

### 2.6. Kaynaklar — tamamı birincil

- **Kaldırma:** RG **12.06.2026, Sayı 33278** (SEDDK) — [metin](https://www.resmigazete.gov.tr/eskiler/2026/06/20260612-3.htm) · MADDE 6 ekleri kaldırıyor, MADDE 8 yürürlüğü 1/7/2026 olarak belirliyor
- **2021 hâli (R×K×HK×T×G):** RG **04.12.2021, Sayı 31679** — [TSB konsolide metin, ekler dahil](https://www.tsb.org.tr/content/Legislations/Trafik_Genel_%C5%9Eartlar%C4%B1_06122021__Ekler_Dahil.pdf)
- **2020 hâli (%19 formülü):** RG **20.03.2020, Sayı 31074**, MADDE 6 — [metin](https://www.resmigazete.gov.tr/eskiler/2020/03/20200320-3.htm) *(formül ve tablolar sayfadaki görüntülerde)*
- **Özgün hâli (2015):** RG **14.05.2015, Sayı 29355** — [ana metin](https://www.resmigazete.gov.tr/eskiler/2015/05/20150514-5.htm) · [ekler](https://www.resmigazete.gov.tr/eskiler/2015/05/20150514-5-1.pdf)
- **SEİK duyurusu:** Sigorta Eksperleri İcra Komitesi, **29.04.2024 / 2024/1** — [Değer Kaybı Hesaplamalarında Reel Piyasa Analizi Yönteminin Uygulanmasına İlişkin SEİK Duyurusu](https://www.tobbseik.org.tr/index.php/duyurular/301-deger-kaybi-hesaplamalarinda-reel-piyasa-analizi-yonteminin-uygulanmasina-iliskin-seik-duyurusu-2024-1) *(birincil, okundu)*
- **AYM:** 29.12.2022, **E.2021/82, K.2022/167** — RG 14.02.2023, Sayı 32104 *(birincil metne erişilemedi — bkz. 2.7)*
- TBK m. 49 · KTK m. 90, m. 91, m. 97, m. 109 · 5684 s.K. m. 30

- **Onay Durumu:** ✅ **Karara bağlandı (20.09.2026)** — hesaplama aracı
  yapılmayacak, bilgilendirme yazısına dönüştürüldü. Uygulama 2.7'de.

## 3. Kira Artış Oranı Hesaplama

> **Durum: ONAYLANDI ve YAYINDA.** Kod yazıldı, testler geçiyor.

### 3.1. Bu aracın asıl zorluğu formül değil, VERİ

Aritmetik önemsiz:

```
yeniKira = mevcutKira × (1 + oran)
```

Zorluk üç yerde:

1. **Hangi oran?** Kanun, haberlerde geçen "yıllık enflasyon"u değil,
   TÜFE'nin **on iki aylık ortalamalara göre değişim oranını** esas alıyor.
   Bu iki rakam Türkiye'de birbirinden ciddi biçimde ayrışıyor ve
   kullanıcıların en sık yaptığı hata bunları karıştırmak.
2. **Hangi ayın oranı?** Rakam her ay değişiyor; sözleşmenin yenilendiği
   aya karşılık gelen doğru rakamın seçilmesi gerekiyor.
3. **Veri bayatlarsa araç sessizce yanlışa düşer.** İnfaz aracında risk
   mevzuat değişikliğiydi; burada risk her ay tekrarlanıyor.

Araştırma sırasında bu tehlike somut olarak görüldü: farklı kaynaklar
aynı ay için **%34,88** ve **4,88**, ya da **%32,03** ve **2,03** gibi
birbirini tutmayan rakamlar veriyor. Bazıları aylık TÜFE değişimini,
bazıları on iki aylık ortalamayı yazıyor. Kaynak seçimi bu araçta
formülden daha kritik.

### 3.2. Kanuni dayanak

| Konu | Dayanak |
|---|---|
| Artış tavanı — TÜFE on iki aylık ortalama | **TBK m. 344/1** |
| Anlaşma yoksa hâkimin belirlemesi | **TBK m. 344/2** |
| Beş yıldan uzun / beşinci yıldan sonra yenilenen sözleşmeler | **TBK m. 344/3** |
| Yabancı para kira bedelleri | **TBK m. 344/4** |
| Aşırı ifa güçlüğü — uyarlama davası | **TBK m. 138** |
| Konut kiralarında %25 tavan *(SONA ERDİ)* | **TBK geçici m. 1** |

**%25 tavanı 01.07.2024'te sona erdi.** O tarihten sonra TBK m. 344'ün
genel hükmü yeniden geçerli. Tavan yalnızca **konut** kiralarına
uygulanıyordu, işyerine değil. Geçmiş bir yenileme dönemi hesaplanacaksa
hâlâ sonuç doğurur (bkz. 3.6 kapsam sorusu).

TBK m. 344 hem konut hem **çatılı işyeri** kiralarını kapsıyor.

### 3.3. v1 kapsamı — KARARA BAĞLANDI

Av. Onur Can Yılmaz'ın kapsam kararı. Araç bilinçli olarak dar tutuldu.

**v1'de VAR:**

- Güncel (ve tabloda oranı bulunan) bir yenileme ayı için azami kira bedeli
- Konut ve çatılı işyeri — ikisi de aynı orana tabi
- Sözleşmede kararlaştırılmış oran verilirse tavanla karşılaştırma

**v1'de YOK:**

| Kapsam dışı | Karar |
|---|---|
| **Beş yıl ayrımı (m. 344/3)** | Araç beş yıl kuralını ayırt etmeyecek |
| **Geçmiş dönem hesabı** | Yalnız güncel/yaklaşan yenilemeler; %25 tavanı dönemi (11.06.2022 – 01.07.2024) hiç kodlanmayacak |
| Yabancı para kira (m. 344/4), uyarlama davası (m. 138), emsal kira analizi | Kapsam dışı |

**Bu iki kararın sadeleştirdiği şeyler:**

- **Sözleşme başlangıç tarihi** girdi olmaktan çıktı — yalnızca beş yıl
  kuralı için gerekiyordu.
- **Kira türü (konut/işyeri)** girdi olmaktan çıktı — %25 tavanı sona
  erdiği ve geçmiş dönem kapsam dışı olduğu için ikisi bugün aynı orana
  tabi. Sonucu değiştirmeyen bir alan formda gürültüden başka bir şey
  değil.
- Geçmiş oran tablosu gerekmiyor; tablo yalnızca açıklanmış güncel
  ayları tutacak.

> ⚠️ **Beş yıl kararının bir sonucu var, kapsam notuyla karşılanacak.**
> Beş yıldan uzun süren kira ilişkilerinde bedel TÜFE ile sınırlı
> değildir; emsal kira, taşınmazın durumu ve hakkaniyet birlikte
> değerlendirilerek hâkim belirler (TBK m. 344/3). Araç bu hâli ayırt
> etmeyeceği için o kullanıcıya da endeks tabanlı bir sayı gösterecek.
>
> Bunu sessiz bırakmamak adına, `CalculatorShell`'in `scopeNote` alanına
> şu metin konacak:
>
> > Bu araç, kira bedelinin TÜFE tavanına tabi olduğu durumlar için
> > tahmini hesaplama yapar. Beş yıldan uzun süren kira ilişkilerinde
> > bedel endeksle sınırlı olmayıp hâkim tarafından belirlenebilir; bu
> > araç söz konusu ayrımı yapmaz.
>
> Böylece araç sade kalıyor ama kullanıcı kendi durumunun kapsam dışı
> olabileceğini görüyor.

### 3.4. Sonuç "yeni kira" değil, "azami bedel"

TBK m. 344/1 anlaşmayı *"...oranını geçmemek koşuluyla"* geçerli sayıyor.
Sözleşmede daha düşük bir artış kararlaştırılmışsa **o** geçerlidir;
tavan otomatik uygulanmaz. Sözleşmede hüküm yoksa m. 344/2 devreye girer
ve bedeli hâkim belirler — yine tavanı aşmamak üzere.

> **Tasarım sonucu:** Sonuç satırının etiketi "Yeni kira bedeli" değil,
> **"Uygulanabilecek azami kira bedeli"** olmalı. Hem hukuken doğru hem
> reklam yasağı açısından güvenli.

### 3.5. Girdi alanları

| Alan | Tip | Neden gerekli |
|---|---|---|
| **Mevcut kira bedeli** | TL | Hesabın tabanı |
| **Yenileme ayı** | ay + yıl | Hangi oranın uygulanacağını belirler |
| **Sözleşmedeki artış oranı** | % (**opsiyonel**) | Verilirse tavanla karşılaştırılır ve hangisinin uygulanacağı gösterilir |

Üç alan. Beş yıl ve geçmiş dönem kapsam dışı kaldığı için form bu kadar
sade kalabiliyor.

### 3.6. Oran — ONAYLANDI

**Uygulanacak oran:** Yenileme ayından **bir önceki ay** açıklanan
**TÜFE on iki aylık ortalamalara göre değişim oranı.** Konut ve çatılı
işyerinde aynı.

**Formül:**

```
artisTutari = mevcutKira × oran / 100
azamiBedel  = mevcutKira + artisTutari
```

**Onaylanmış veri noktası ve örnek hesap:**

| | |
|---|---|
| Yenileme ayı | Eylül 2026 |
| Oran | **%31,79** |
| Mevcut kira | 10.000 TL |
| Artış tutarı | 10.000 × 31,79 / 100 = **3.179 TL** |
| Azami bedel | **13.179 TL** |

Bu senaryo doğrudan test fikstürüne girecek.

> **Not:** Oran yenileme **ayına** bağlı; ayın kaçında yenilendiği
> sonucu değiştirmiyor. Aynı ay içinde yenilenen tüm sözleşmeler aynı
> oranı kullanıyor.

#### TÜFE verisi — mekanizma

Üç seçenek değerlendirildi:

| Seçenek | Artı | Eksi |
|---|---|---|
| **A. Depoda elle tutulan tablo** | Sıfır JS, sıfır ağ isteği; her değişiklik git geçmişinde denetlenebilir | Aylık disiplin gerektirir |
| B. Derleme sırasında TÜİK'ten çekme | Otomatik | Aylık yeniden derleme gerekir; uç değişirse derleme kırılır |
| C. Tarayıcıda çekme | Her zaman güncel | Sıfır JS ilkesini bozar, üçüncü tarafa istek (KVKK), TÜİK erişilemezse araç çalışmaz |

**Öneri: A.** Tablo `src/lib/tufe.ts` içinde; her satırda ay, oran ve
TÜİK'in açıkladığı tarih. Geçmiş dönem kapsam dışı olduğu için tablo
kısa kalacak — yalnızca açıklanmış güncel aylar.

**Tablo hangi ayları tutuyor — KARARA BAĞLANDI:** **2026 yılının
tamamı** (Ocak–Eylül, her ay bir satır büyüyor). 2026 öncesine
inilmiyor: %25 tavanının yürürlükte olduğu dönem (11.06.2022 –
01.07.2024) v1 kapsamı dışında ve ayrı bir tavan mantığı gerektirir.

Girilen seri:

| Yenileme ayı | Oran | Kaynak bülten |
|---|---|---|
| Ocak 2026 | %34,88 | Aralık 2025 |
| Şubat 2026 | %33,98 | Ocak 2026 |
| Mart 2026 | %33,39 | Şubat 2026 |
| Nisan 2026 | %32,82 | Mart 2026 |
| Mayıs 2026 | %32,43 | Nisan 2026 |
| Haziran 2026 | %32,24 | Mayıs 2026 |
| Temmuz 2026 | %32,03 | Haziran 2026 |
| Ağustos 2026 | %31,90 | Temmuz 2026 |
| **Eylül 2026** | **%31,79** | **Ağustos 2026** |

> ⚠️ **Doğrulama düzeyi eşit değil.** Eylül 2026 kaydı TÜİK Ağustos
> bülteninden doğrudan doğrulandı. Ocak–Ağustos kayıtları ikincil
> kaynaklardan derlenip Av. Onur Can Yılmaz tarafından onaylandı;
> bültenden tek tek teyit EDİLMEDİ. Seri monoton azalıyor ve
> doğrulanmış Eylül değerinde bitiyor — tutarlılık göstergesi, kanıt
> değil. Bir uyuşmazlıkta bültene bakılmalı.

Tabloya oranı işlenmemiş bir ay seçilemiyor: form yalnızca tablodaki
ayları listeliyor.

**Aylık güncelleme — hatırlatıcı kuruldu.** Her ayın 4'ünde (10.00,
Europe/Istanbul) çalışan bir bulut ajanı, TÜİK'in o ayki bültenindeki
"on iki aylık ortalamalara göre değişim" oranını bulup rapor ediyor.
Ajan **yalnızca haber veriyor**; depoda değişiklik yapmıyor, commit
atmıyor. Rakam TÜİK bülteninden teyit edildikten sonra tabloya elle
(Claude Code oturumunda) işleniyor.

Otomatik yayına bağlanmamasının gerekçesi 3.8'de: bültende dört ayrı
oran yan yana duruyor ve yanlış satırı okumak kolay. Yanlış bir yasal
tavanı sessizce yayınlamaktansa insan gözü tercih edildi.

Ajanın adresi: https://claude.ai/code/routines/trig_01B8VEn4Z6NmYvjEzRLuX411

**Bayatlama koruması — zorunlu:** Seçilen yenileme ayı için tabloda veri
yoksa araç **tahmin etmemeli**; "bu ayın oranı henüz açıklanmadı"
deyip hesap yapmamalı. Sessizce en son bilinen oranı kullanmak bu araçta
yapılabilecek en kötü hata. Aynı şekilde, kapsam dışı kalan eski bir ay
seçilirse hesap yapmayıp kapsam uyarısı vermeli.

Kullanılan oranın hangi aya ait olduğu ve açıklanma tarihi sonuç
ekranında görünmeli — `CalculatorShell`'in `lawAsOf` alanı bunun için var.

### 3.7. Hesaplama adımları

```
1. Yenileme ayına karşılık gelen oranı tabloda ara
   · yoksa → hesaplama yapma, eksik veri uyarısı ver  → BİTİR
2. artisTutari = mevcutKira × oran / 100
3. azamiBedel  = mevcutKira + artisTutari
4. Sözleşme oranı verilmişse:
   · sözleşme oranı ≤ tavan  → uygulanacak olan sözleşme oranıdır
   · sözleşme oranı > tavan  → tavan uygulanır, aşan kısım geçersiz
5. Sonucu "azami" olarak etiketle
```

### 3.8. Oranın okunacağı yer — ÇÖZÜLDÜ

**Ayrı bir "seri" yok; aranan rakam standart aylık TÜFE bülteninin
içindeki bir satır.** TÜİK her ay yayımladığı *Tüketici Fiyat Endeksi*
bülteninde aynı ay için birden fazla değişim oranı veriyor:

| Bültendeki satır | Ne anlatır | Kira artışında |
|---|---|---|
| Aylık değişim | Bir önceki aya göre | ❌ |
| **Yıllık değişim** | Geçen yılın aynı ayına göre — **manşet enflasyon** | ❌ |
| **On iki aylık ortalamalara göre değişim** | Son 12 ayın ortalamasının, önceki 12 ayın ortalamasına oranı | ✅ **Bu** |
| Yılbaşına göre değişim | Aralık'a göre | ❌ |

Kanunun (TBK m. 344/1) işaret ettiği rakam üçüncüsü. Haberlerde
duyurulan "enflasyon açıklandı" rakamı ise ikincisi.

#### İkisinin farkı somut ve büyük

Aralık 2025 bülteninden, aynı ay için:

| Satır | Oran |
|---|---|
| Aylık değişim | %0,89 |
| **Yıllık değişim (manşet)** | **%30,89** |
| **On iki aylık ortalamalara göre değişim** | **%34,88** |

Ocak 2026'da yenilenen sözleşmelerde uygulanan tavan **%34,88** oldu —
manşet %30,89 değil. 10.000 TL'lik bir kirada aradaki fark aylık
**399 TL**, yıllık yaklaşık 4.800 TL.

> ⚠️ **Tabloyu güncelleyecek kişi için kural:** TÜİK bülteninde
> **"on iki aylık ortalamalara göre değişim"** satırı okunacak. Manşette
> duyurulan yıllık oran KULLANILMAYACAK. Bu satır, TÜİK'in aylık TÜFE
> haber bülteninde yıllık ve aylık oranlarla yan yana duruyor.
>
> Araştırmada ikincil kaynakların bu rakamı sık sık kırptığı da görüldü
> — "%34,88" yerine "4,88", "%31,79" yerine "1,79" yazan sayfalar var.
> Rakam TÜİK bülteninden okunmalı, haber sitesinden değil.

#### Tuzağın ikinci kez yakalandığı yer

14 Eylül 2026'da tabloya 2026'nın aylık oranları girilmek istendi ve
verilen seri şuydu: 30,65 · 31,53 · 30,87 · 32,37 · 32,61 · 32,11 ·
31,75 · 31,51. Girilmeden önce kontrol edildi ve bunların **yıllık
değişim** serisi olduğu anlaşıldı. İki bağımsız doğrulama:

1. **Ağustos 2026 bülteni** aynı ay için iki rakam veriyor: yıllık
   **%31,51**, on iki aylık ortalama **%31,79**. Serinin Ağustos değeri
   birincisine, ayrıca onaylanmış Eylül tavanı (%31,79) ikincisine eşit.
2. Aynı bülten "yıllık enflasyon bir önceki aya kıyasla 0,24 puan
   azaldı" diyor → Temmuz yıllık = 31,51 + 0,24 = **31,75**, serinin
   Temmuz değeriyle birebir aynı.

Doğru tavan serisi ise monoton azalıyor (bir hareketli ortalamada
beklenen davranış): 34,88 · 33,98 · 33,39 · 32,82 · 32,43 · 32,24 ·
32,03 · 31,90 · 31,79. Ocak'ta iki seri arasındaki fark **4,23 puan** —
10.000 TL'lik kirada aylık 423 TL.

**Çıkarılan ders:** Bu tuzak teoride değil pratikte iki kez karşımıza
çıktı. Tabloya yeni oran girilirken her seferinde bültendeki iki rakam
YAN YANA okunmalı; ikisi birbirine yakın olduğu için tek başına
bakıldığında hangisi olduğu anlaşılmıyor.

**Kaynak:** TÜİK — Tüketici Fiyat Endeksi aylık haber bülteni
(`data.tuik.gov.tr`). Her ayın rakamı, takip eden ayın ilk günlerinde
açıklanıyor.

### 3.8b. Yuvarlama — KARARA BAĞLANDI

**Yuvarlama yapılmayacak; taraflara bırakılacak.** Araç ham sonucu
gösterir.

Örnek: 27.500 × 31,79 / 100 = **8.742,25 TL** artış → azami bedel
**36.242,25 TL**. Araç bu rakamı olduğu gibi yazar, tam liraya
yuvarlamaz.

Gerekçe kayıt için: yuvarlama hukuki bir zorunluluk değil, tarafların
anlaşmasına bağlı bir pratik. Araç yuvarlarsa, yuvarlanmış rakamı yasal
tavan sanan bir kullanıcı tavanı birkaç kuruş aşabilir ya da hakkını
eksik kullanabilir. Ham sonuç her iki hatayı da önlüyor.

### 3.9. Kaynaklar

Tamamı **ikincil**. Birincil kaynak TÜİK bülteni ve `mevzuat.gov.tr`
üzerindeki TBK metni.

- [Kira artış oranı — TBK 344, TÜFE sınırı ve 5 yıl kuralı (Çiftçi & Partners)](https://ciftcipartners.com/kira-artis-orani-tufe-tbk-344/)
- [Kira artış oranı hesaplama (Kadim Hukuk)](https://kadimhukuk.com.tr/kira-artis-orani-hesaplama/)
- [Konut kiralarındaki güncel artış oranları (Lexology)](https://www.lexology.com/library/detail.aspx?g=22756e96-612a-4dd6-b776-bbaa60887782)
- [Kira artış oranı 2026 — konut ve işyeri (Tahancı)](https://www.tahanci.av.tr/kira-artis-hesaplama/)
- [TÜİK — Tüketici Fiyat Endeksi haber bülteni](https://data.tuik.gov.tr/) *(birincil kaynak: "on iki aylık ortalamalara göre değişim" satırı)*
- [Ocak 2026 kira artış oranı ve Aralık 2025 TÜFE verileri (CNN Türk)](https://www.cnnturk.com/ekonomi/ocak-2026-kira-artis-orani-hesaplama-kira-artis-orani-tufe-yuzde-kac-oldu-aralik-ayi-enflasyon-rakamlari-tuik-2381226)

### 3.10. Test senaryoları

Girdi tarafı dolduruldu. Beklenen çıktılar, oran tablosu kurulduktan
sonra doldurulacak — **1 numaralı senaryo hariç**, o onaylanmış veri
noktasından geliyor ve şimdiden kesin.

| # | Mevcut kira | Yenileme ayı | Sözleşme oranı | Beklenen | Neyi doğrular |
|---|---|---|---|---|---|
| 1 | 10.000 TL | Eylül 2026 (%31,79) | — | artış **3.179 TL**, azami **13.179 TL** | Onaylanmış temel hesap |
| 2 | 27.500 TL | Eylül 2026 (%31,79) | — | artış **8.742,25 TL**, azami **36.242,25 TL** | Küsurat korunuyor, yuvarlama yok |
| 3 | 10.000 TL | Eylül 2026 (%31,79) | %20 | Sözleşme oranı uygulanır → 12.000 TL | Sözleşme oranı **tavanın altında** |
| 4 | 10.000 TL | Eylül 2026 (%31,79) | %45 | Tavan uygulanır → 13.179 TL, aşan kısım geçersiz | Sözleşme oranı **tavanın üstünde** |
| 5 | 10.000 TL | Eylül 2026 (%31,79) | %31,79 | Tavana eşit → 13.179 TL | Sınır: oran tavana **tam eşit** |
| 6 | 10.000 TL | Tabloda olmayan bir ay | — | **Hesap yok**, eksik veri uyarısı | Bayatlama koruması |
| 7 | 10.000 TL | %25 tavanı dönemi (ör. Ocak 2023) | — | **Hesap yok**, kapsam dışı uyarısı | Geçmiş dönem kapsam dışı |
| 8 | 0 TL / negatif | Eylül 2026 | — | Girdi hatası | Doğrulama |

**Yuvarlama:** yapılmıyor (3.8b). 2 numaralı senaryo bunu doğruluyor —
küsurat korunmalı, tam liraya inilmemeli.

- **Onay Durumu:** ✅ **Onaylandı** — Av. Onur Can Yılmaz, 14 Eylül 2026.
  Kod: `src/lib/kira-artis.ts` + `src/lib/tufe.ts`, testler
  `src/lib/kira-artis.test.ts`, sayfa
  `src/pages/hesaplama-araclari/kira-artis-orani.astro`.

## 4. İcra / Gecikme Faizi Hesaplama

> **Durum: ONAYLANDI ve YAYINDA.** Kod yazıldı, testler geçiyor.

### 4.1. Bu araç kiradan yapısal olarak farklı

Kira aracında tek bir orana tek bir çarpma yapılıyordu. Burada durum
başka: faiz bir **tarih aralığı** boyunca işliyor ve o aralıkta oran
değişmiş olabilir. Dolayısıyla hesap tek bir çarpma değil, **dönemlere
bölme** işlemi.

Somut örneği: 01.01.2024'te muaccel olmuş bir alacak için 01.10.2026'da
kanuni faiz hesaplanacaksa, aralık **üç ayrı orana** bölünüyor:

```
01.01.2024 ─────── 31.05.2024   %9
01.06.2024 ─────── 30.07.2026   %24
31.07.2026 ─────── 01.10.2026   %31
```

Her dilim kendi oranıyla ayrı hesaplanıp toplanıyor. Kodun çekirdeği bu
bölme işlemi; çarpmanın kendisi önemsiz.

Bunun bir sonucu var: **hesap cetveli burada gerçekten işe yarıyor.**
Kullanıcı toplam faizi değil, hangi dönemde hangi oranın kaç gün
işlediğini görmek istiyor. `ResultSheet` her dilimi ayrı satır olarak
gösterebilir.

### 4.2. Kanuni dayanak

| Konu | Dayanak |
|---|---|
| Kanuni (yasal) faiz oranı | **3095 s.K. m.1** |
| Temerrüt faizi; ticari işlerde avans oranı | **3095 s.K. m.2** |
| Faize faiz yasağı (anatosizm) | **3095 s.K. m.3** |
| Yabancı para borçlarında faiz | **3095 s.K. m.4/a** |
| Ticari satımlarda geç ödeme faizi | **TTK m.1530** |
| İcra takibinde faiz talebi | **İİK** ilgili maddeler |

#### 7589 sayılı Kanun kanuni faizin belirlenme YÖNTEMİNİ değiştirdi

12. Yargı Paketi (31.07.2026) bu araç açısından önemli: kanuni faiz
artık Cumhurbaşkanı kararıyla belirlenen sabit bir oran değil,
**TCMB'nin kısa vadeli kredi işlemlerinde uyguladığı reeskont oranının
%80'i.** Bir önceki yılın 31 Aralık oranı esas alınıyor; 30 Haziran
oranı bundan 5 puan veya daha fazla farklıysa 1 Temmuz'da yeni oran
uygulanıyor.

Yeni metinde Cumhurbaşkanına oranı artırma/indirme yetkisi veren hüküm
yok — oran kendiliğinden güncelleniyor.

> **Aracın bakımı açısından:** Oran artık yılda bir (bazen iki) kez,
> kanunun kendi mekanizmasıyla değişiyor. Kira aracındaki TÜFE tablosu
> gibi burada da elle tutulan bir **dönem tablosu** gerekiyor. Fark:
> TÜFE her ay değişiyordu, bu yılda bir-iki kez — bakım yükü daha hafif,
> ama unutulması daha kolay.

### 4.3. Oranlar — derlenen tablo (DOĞRULANMALI)

**Kanuni faiz (3095 m.1):**

| Dönem | Oran |
|---|---|
| 01.01.2006 – 31.05.2024 | %9 |
| 01.06.2024 – 30.07.2026 | %24 |
| 31.07.2026 – … | **%31** |

%31'in kaynağı: 31.12.2025 reeskont oranı %38,75 × 0,80 = %31.

**Ticari işlerde temerrüt faizi:**

| Tür | 2026 oranı |
|---|---|
| TCMB kısa vadeli avans oranı (3095 m.2) | **%39,75** |
| TTK m.1530 geç ödeme faizi | **%43** |

> ⚠️ Ticari oranların geçmiş yıllara ait tablosu henüz derlenmedi. v1
> ticari faizi kapsayacaksa o tablo da gerekiyor (TCMB her yıl ilan
> ediyor).

> ⏸ Kanuni faizle ilgili **Anayasa Mahkemesi iptal kararları** olduğu
> görüldü. Av. Onur Can Yılmaz'ın kararıyla şimdilik göz ardı ediliyor;
> izleme maddesi olarak duruyor. İleride oran tablosunu etkilediği
> anlaşılırsa tablo yeniden gözden geçirilecek.

### 4.4. Formül ve sayım kuralları — KARARA BAĞLANDI

Basit faiz — **anatosizm yasağı** (3095 m.3) gereği bileşik faiz
uygulanmıyor; birikmiş faiz anaparaya eklenip üzerine faiz
yürütülmüyor.

```
dilimFaizi = anapara × (oran / 100) × (gunSayisi / 365)
toplamFaiz = Σ dilimFaizi
toplamBorc = anapara + toplamFaiz
```

Dikkat: her dilimde çarpan **anapara**, bir önceki dilimin sonucu değil.
Bu, anatosizm yasağının koddaki karşılığı ve gözden kaçarsa sonuç
sessizce şişer.

**Onaylanan üç kural:**

| Konu | Karar |
|---|---|
| Yıl paydası | **Her hâlde 365.** Artık yılda da 365; 360 kullanılmıyor. |
| Gün sayımı | Başlangıç günü sayılmaz, bitiş günü sayılır → `gün = bitiş − başlangıç` |
| Dilim sınırı | Sınır günü **eski (önceki) döneme** yazılır |

> ⚠️ **Sınır kuralında bir belirsizlik kaldı.** Karar "31'inci günü
> düşük faiz oranı olan eski tarihli faize göre hesapla" biçiminde
> verildi. Mevcut tabloda eski dönem aynı zamanda **düşük** oranlı
> (9 → 24 → 31), yani iki okuma da aynı sonucu veriyor. Kod
> **"eski döneme yaz"** kuralını uyguluyor; tarih tabanlı, deterministik
> ve dönem tablosuyla uyumlu olduğu için.
>
> Ama 7589 sonrası kanuni faiz TCMB reeskontuna bağlı ve **düşebilir.**
> Oran düştüğü bir sınırda "eski dönem" ile "düşük oran" ayrışacak.
> O gün geldiğinde hangisinin geçerli olduğu netleşmeli. Şimdilik
> ayrışma yok.

#### Doğrulanmış örnek hesap

100.000 TL anapara, 01.01.2024 – 01.10.2026, kanuni faiz:

| Dilim | Gün | Oran | Faiz |
|---|---|---|---|
| 01.01.2024 – 31.05.2024 | 151 | %9 | 3.723,29 TL |
| 31.05.2024 – 30.07.2026 | 790 | %24 | 51.945,21 TL |
| 30.07.2026 – 01.10.2026 | 63 | %31 | 5.350,68 TL |
| **Toplam** | **1.004** | | **61.019,18 TL** |

Toplam borç: **161.019,18 TL**

Sağlama: 01.01.2024 ile 01.10.2026 arası 1.004 gün; dilim günleri
151 + 790 + 63 = 1.004. Sınır günleri ne iki kez sayılıyor ne de
düşüyor.

> **Yuvarlama önerisi:** Her dilim ayrı ayrı kuruşa yuvarlanıp
> toplanıyor (yukarıdaki tablo böyle hesaplandı). Gerekçe: cetvel
> dilimleri kullanıcıya tek tek gösteriyor; satırlar toplamı tutmazsa
> araç güvenilirliğini kaybeder. Alternatif (tam hassasiyette toplayıp
> sonda yuvarlamak) birkaç kuruş farkla satırların toplamını bozardı.
> Onayınıza sunulur.

### 4.5. Girdi alanları (taslak)

| Alan | Tip | Neden gerekli |
|---|---|---|
| **Anapara** | TL | Hesabın tabanı |
| **Faiz başlangıç tarihi** | tarih | Temerrüt, vade veya ihtarname tarihi |
| **Faiz bitiş tarihi** | tarih | Takip tarihi veya ödeme tarihi |
| **Faiz türü** | seçim: kanuni / ticari avans / TTK 1530 / sözleşmesel | Hangi oran tablosunun kullanılacağını belirler |
| **Sözleşmesel oran** | % (koşullu) | Yalnızca "sözleşmesel" seçilirse gösterilir |

### 4.6. Kapsam için önerim

Kira aracındaki dersle: dar başlamak, sonra genişletmek.

**v1'de olsun:**

- Tek alacak, tek faiz türü, tek tarih aralığı
- Basit faiz, otomatik dönem bölme
- Kanuni faiz + sözleşmesel oran

**v1'de olmasın:**

| Kapsam dışı önerisi | Gerekçe |
|---|---|
| Ticari avans ve TTK 1530 | Geçmiş yıl tabloları henüz derlenmedi; ayrıca hangi işin "ticari iş" olduğu bir nitelendirme, araç bunu bilemez |
| Kısmi ödemeler / ara tahsilatlar | Her ödeme anaparayı düşürüp yeni dilim açıyor; ciddi karmaşıklık |
| Yabancı para borçları (3095 m.4/a) | Ayrı rejim |
| Takip sonrası faiz, harç ve masraflar | Bu, 6 numaralı aracın konusu |
| Ticari cari hesapta bileşik faiz istisnası | Anatosizm yasağının istisnası; nadir ve nitelendirme gerektiriyor |

Bu daraltma ile araç "bir alacağa şu tarihler arasında ne kadar kanuni
faiz işler" sorusunu cevaplıyor — en sık sorulan soru bu.

### 4.7. Açık sorular

**✅ Cevaplandı:**

| Soru | Cevap |
|---|---|
| Dilim sınırında gün | Sınır günü eski döneme yazılır |
| Artık yıl | Payda her hâlde 365 |
| 365 mi 360 mı | 365 |
| AYM iptal kararları | Şimdilik göz ardı ediliyor — izleme maddesi olarak duruyor |

| Kapsam (4.6) | **Kabul** — ticari faiz (avans, TTK 1530) v1 dışında |
| Dilim yuvarlaması | **Her dilim ayrı ayrı kuruşa yuvarlanır**, sonra toplanır |

Açık soru kalmadı.

### 4.8. Kaynaklar

Tamamı **ikincil**. Birincil kaynak `mevzuat.gov.tr` (3095 s.K., TTK) ve
TCMB'nin reeskont/avans oranları duyurusu.

- [3095 sayılı Kanun — konsolide metin (Lexpera)](https://www.lexpera.com.tr/mevzuat/kanunlar/kanuni-faiz-ve-temerrut-faizine-iliskin-kanun-3095)
- [Yasal faiz oranı 2026 ve dönemsel tablo (Büken Hukuk)](https://buken.av.tr/yasal-faiz-hesaplama-2026/)
- [Yeni yasal faiz oranı — 12. Yargı Paketi değişikliği (Elçi)](https://www.elci.av.tr/makale/yasal-faiz-orani-kac-oldu-yeni-duzenlemeyle-kanuni-faiz-yuzde-31-2026-182)
- [Yasal faize ilişkin AYM iptal kararları (Legal Blog)](https://legal.com.tr/blog/ekonomi/yasal-faize-iliskin-anayasa-mahkemesi-iptal-kararlari-ve-enflasyon-kosullarinda-faiz-uygulamasi/)
- [TCMB — reeskont ve avans faiz oranları](https://www.tcmb.gov.tr/)

### 4.9. Test senaryoları

Kodlandı — `src/lib/gecikme-faizi.test.ts`, 17 test. Kapsanan dallar:

| Dal | Doğrulanan |
|---|---|
| Üç oranı kesen aralık | 4.4'teki örnek, birebir |
| Dilim günleri toplamı | Aralığın toplam gününe eşit — sınır günü ne çift sayılıyor ne düşüyor |
| Dilim faizleri toplamı | Gösterilen toplama eşit (yuvarlama kuralı) |
| Tek dönem içinde kalan aralık | Tek dilim üretiliyor |
| Sınıra tam denk gelen bitiş | Gün eski döneme yazılıyor, yeni dilim açılmıyor |
| Sınırın ertesinde başlayan aralık | Yeni oran kullanılıyor |
| Artık yıl | Payda 365 kalıyor; tam bir yıl → tam yıllık oran |
| Anatosizm | Her dilim anapara üzerinden hesaplanıyor |
| Sözleşmesel oran | Tek dilim; tablo kısıtı uygulanmıyor |
| Girdi doğrulama | Anapara, tarih sırası, var olmayan tarih (31 Nisan, 29 Şubat 2023), 2006 öncesi |
| Oran tablosu | Sıralı, yalnız sonuncusu açık uçlu, belgedeki değerlerle birebir |

- **Onay Durumu:** ✅ **Onaylandı** — Av. Onur Can Yılmaz, 14 Eylül 2026.
  Kod: `src/lib/gecikme-faizi.ts` + `src/lib/faiz-oranlari.ts`, sayfa
  `src/pages/hesaplama-araclari/icra-gecikme-faizi.astro`.

## 5. Araç Mahrumiyet Bedeli Hesaplama

> **Durum: ONAYLANDI ve YAYINDA.** Mekanizma ve ekran metinleri Av. Onur
> Can Yılmaz tarafından 20 Eylül 2026'da karara bağlandı; 5.9'daki dört
> açık soru **21 Eylül 2026'da** cevaplandı ve onay verildi. Kod
> `src/lib/mahrumiyet-bedeli.ts`, testler
> `src/lib/mahrumiyet-bedeli.test.ts`, arayüz
> `src/pages/hesaplama-araclari/arac-mahrumiyet-bedeli.astro`.

### 5.1. Bu araç diğerlerinden yapısal olarak farklı

Önceki üç araçta rakam bizdeydi: TÜFE tablosu (§ 3), kanuni faiz dönemleri
(§ 4), harç tarifeleri (§ 6). Hepsinin ortak derdi bayatlama. Burada
**kodda hiçbir rakam tutulmuyor** — çünkü tutulacak bir rakam yok:

- Değer kaybının aksine (§ 2), mahrumiyet bedeli için genel şartlarda bir
  ek, katsayı cetveli veya tarife bulunmuyor. Dayanak doğrudan haksız fiil
  hükümleri ve Yargıtay uygulaması.
- Günlük kira bedeli piyasa verisi: araç segmentine, sezona, şehre ve
  kiralama süresine göre değişiyor. Kodda sabitlenirse bir sezon sonra
  sessizce yanlış olur.

**Seçilen mekanizma — Seçenek A.** Kullanıcı iki ayrı kiralama şirketinden
kendi teklifini alır ve girer; araç yalnızca çarpar, aralığı ve ortalamayı
gösterir. Bayatlayacak veri tablosu olmadığı için **bu aracın bakım yükü
sıfır** — sekiz araç içinde bunu söyleyebildiğimiz tek araç.

Buna karşılık yeni bir zayıflık doğuyor: sonucun kalitesi tamamen girilen
bedele bağlı. Tek günlük kiralama fiyatları uzun dönem fiyatlarından
belirgin biçimde yüksek olduğundan, yönerge metni kullanıcıyı hesapladığı
gün sayısına yakın bir süre için teklif almaya yönlendiriyor (5.4).

### 5.2. Kanuni dayanak

| Konu | Dayanak | Durum |
|---|---|---|
| Haksız fiil — zararın tazmini sorumluluğu | **TBK m. 49** | ✅ |
| Zarar miktarı tam olarak ispat edilemiyorsa hâkimin belirlemesi | **TBK m. 50/2** | ✅ |
| Makul onarım süresi ve emsal günlük kira bedeli üzerinden hesap; fiili kiralama belgesi aranmaması | **Yargıtay 4. HD, 29.09.2022, E. 2021/26777, K. 2022/11236** | ✅ |

Bu aracın asıl dayanağı **TBK m. 50/2**:

> Uğranılan zararın miktarı tam olarak ispat edilemiyorsa hâkim, olayların
> olağan akışını ve zarar görenin aldığı önlemleri göz önünde tutarak,
> zararın miktarını hakkaniyete uygun olarak belirler.

Mahrumiyet bedelinin fiilen araç kiralanmış olmasına bağlı olmadığı,
"belge yoksa tazminat yok" yaklaşımının reddedildiği nokta tam olarak
budur. Aracımızın yaptığı iş de zaten bu: fiili bir makbuz değil, emsal
bedel üzerinden bir tahmin üretmek.

> ✅ **Künye doğrulandı — 21 Eylül 2026.** Taslakta bu künye "teyide
> muhtaç" olarak işaretlenmişti; bu oturumda gov.tr alan adlarının tamamı
> sertifika hatası verdiği için birincil metne ulaşılamamıştı. Av. Onur
> Can Yılmaz künyeyi **Yargıtay 4. Hukuk Dairesi, T. 29.09.2022, E.
> 2021/26777, K. 2022/11236** olarak, birbirinden bağımsız iki kaynaktan
> (lexpera.com.tr ve alparslanlevent.av.tr) teyit etti. Kararın konusu
> araç mahrumiyet bedeli; TBK m. 50/2'ye dayanarak kiralama makbuzu
> aranmadığı yönündeki içeriği de doğrulandı.
>
> Künye bu nedenle sonuç ekranında gösteriliyor. Taslaktaki "teyit
> edilmezse künye yazılmaz" kuralı işletilmedi, çünkü teyit geldi.

### 5.3. Kapsam — v1

**VAR:**

- Özel (ticari olmayan) araç
- Kullanıcının kendi topladığı iki günlük kira teklifi
- Gün sayısı × bedel; alt–üst aralık ve ortalama

**YOK:**

| Kapsam dışı | Neden |
|---|---|
| **Ticari araçta kazanç kaybı** | Taksi, kamyon, ticari minibüs gibi araçlarda zarar "kiralama bedeli" değil, elde edilemeyen kazançtır; ayrı bir kalem ve ayrı ispat rejimi |
| **Kusur oranına göre indirim** | Forma girdi eklemiyoruz; sonuç karşı tarafın tam kusurlu olduğu varsayımına dayanıyor (bkz. Soru 2) |
| **Onarım bedeli ve değer kaybı** | Ayrı kalemler; değer kaybı için § 2'deki karar geçerli |
| **İkame araç sağlanmış hâller** | Hesaptan düşülmüyor; kapsam notuyla uyarılıyor (5.4) |
| **Tasarruf edilen giderin düşülmesi** | Tutarı somut olaya bağlı; teknik notla bildiriliyor, hesaba girmiyor (5.6) |

### 5.4. Ekran metinleri — birebir kullanılacak

Aşağıdaki dört metin Av. Onur Can Yılmaz tarafından yazılmıştır ve **kodda
birebir** yer alır. Değiştirilmesi yeni onay gerektirir.

**(a) Sayfa başındaki bilgi notu** — formun ve sonucun üstünde, sayfa
genişliğinde:

> Kazadan sonra aracınızın serviste kaldığı gün sayısı × benzer bir aracın
> günlük kiralama bedeli üzerinden hesaplanan bir tutarı, kazaya kusurlu
> sürücüden ve araç sahibinden hukuki yollarla (icra takibi veya dava)
> talep edebileceğinizi biliyor musunuz?

**(b) Kaynak yönergesi** — form alanlarının hemen üstünde, iki bağlantıyla
birlikte (`enterprise.com.tr`, `garenta.com`):

> Aracınızla aynı veya benzer segmentteki bir aracın günlük kiralama
> bedelini yukarıdaki sitelerden tespit edip aşağıya yazınız. Mümkünse
> hesapladığınız gün sayısına yakın bir süre için teklif alın — tek
> günlük fiyatlar genelde daha yüksek çıkar.

**(c) Kapsam notu** — `CalculatorShell`'in `scopeNote` propu olarak, sonuç
sütununda. **Üç paragraf**: ilki 20 Eylül'de yazılan ikame araç notu,
diğer ikisi 21 Eylül'de Soru 2 ve Soru 3'ün cevabıyla eklendi:

> Bu süre zarfında sigorta şirketiniz, servis veya karşı taraf size
> ücretsiz bir ikame araç sağladıysa, mahrumiyet bedeli talebiniz bu
> durumdan etkilenebilir. Bu durumun hesaplamanızı nasıl etkilediğini bize
> danışabilirsiniz.

> Kazada sizin de kusurunuz varsa, talep edilebilecek tutar kusur oranınız
> ölçüsünde azalır.

> Taksi, kamyon gibi ticari amaçla kullanılan araçlarda zarar kira bedeli
> değil kazanç kaybı esasına göre hesaplanır, bu araç bu durumu kapsamaz.

Üç paragrafı tek bir uzun cümle yığınına çevirmemek için `scopeNote`
propunun tipi `string | readonly string[]` olarak genişletildi; dizi
verildiğinde kabuk her maddeyi ayrı paragraf basıyor. Mevcut tek metinli
kullanım (§ 6, harç aracı) etkilenmedi.

**(d) Zorunlu genel uyarı** — `CALCULATOR_DISCLAIMER`, kabuk tarafından
basılıyor, prop ile kapatılamıyor:

> Bu hesaplama tahminidir, somut olayınız için hukuki değerlendirme
> gereklidir.

**Reklam yasağı kontrolü (CLAUDE.md Bölüm 4/3).** Dört metin de kontrol
edildi: üstünlük iddiası, sonuç garantisi, müvekkil referansı veya başarı
oranı yok. (a)'daki "biliyor musunuz" kalıbı bilgilendirici; (c)'deki
"bize danışabilirsiniz" ifadesi bir kanal bildirimi, ikna edici bir vaat
değil. Kalem uygun görünüyor.

### 5.5. Girdi alanları

| Alan | id | Tip | Kural |
|---|---|---|---|
| Aracın serviste kaldığı gün sayısı | `gun` | tam sayı | 1 – 3650 |
| Birinci günlük kira bedeli | `bedel-1` | TL | > 0 |
| İkinci günlük kira bedeli | `bedel-2` | TL | > 0 |

Bedel alanlarının ipucu metinleri kaynağı gösterir ("Enterprise'dan
aldığınız teklif" / "Garenta'dan aldığınız teklif"), böylece cetvel
satırları marka adı taşımak zorunda kalmaz.

Üst sınır olarak 3650 gün (10 yıl) konuyor: makul onarım süresi tartışması
ayrı, ama on yılı aşan bir girdi kullanıcı hatasıdır ve sessizce devasa
bir rakam üretmesindense reddedilmesi doğru.

### 5.6. Hesap

Girdi: `gun` (tam sayı), `gunlukBedeller` (en az iki pozitif sayı).

```
tutar[i] = gun × bedel[i]
alt      = min(tutar)
üst      = max(tutar)
ortalama = tutarların aritmetik ortalaması
```

**Aritmetik kuralı.** § 3, § 4 ve § 6'daki ile aynı: bedeller kuruşa
çevrilip tam sayı olarak çarpılır, yuvarlama yalnızca sonda yapılır.

```
bedelKurus[i]  = round(bedel[i] × 100)
tutarKurus[i]  = bedelKurus[i] × gun          // tam sayı, kayıp yok
ortalamaKurus  = round(Σ tutarKurus[i] / n)
```

`gun ≤ 3650` ve makul bir bedel tavanında en büyük ara değer 10¹¹
mertebesinde kalır; `Number.MAX_SAFE_INTEGER` sınırına yaklaşılmaz
(§ 4'te bu sınır bir kez sorun olmuştu, bu yüzden yazılıyor).

**İki bedel eşitse** aralık satırı tek değer gösterir ("1.000,00 TL"),
"1.000,00 – 1.000,00 TL" yazılmaz.

**Geçersiz girdi durumları:** `gecersiz-gun` (tam sayı değil, 1'den küçük
veya 3650'den büyük), `gecersiz-bedel` (sıfır, negatif veya sayı değil),
`yetersiz-teklif` (ikiden az bedel). Her biri ayrı bir hata mesajı alır;
§ 6'daki gibi tahmin yürütülmez.

### 5.7. Sonuç ekranı

Hesap cetveli (`ResultSheet`) satırları:

| Satır | Değer | Açıklama |
|---|---|---|
| Birinci teklife göre | `tutar₁` | `N gün × X TL` |
| İkinci teklife göre | `tutar₂` | `N gün × Y TL` |
| **Tahmini aralık** | `alt – üst` | iki teklifin verdiği alt ve üst uç |
| **Ortalama tahmin** | `ortalama` | kapanış satırı (`total: true`) |

Cetvelin hemen altında **iki teknik not** (birebir):

> Bu tutardan, aracınızı kullanmadığınız için tasarruf ettiğiniz
> yakıt/bakım gideri düşülebilir; gerçek tazminat bu rakamdan az
> çıkabilir.

> Girdiğiniz gün sayısı, bilirkişi tarafından "makul onarım süresi"ne
> indirilebilir; hesaplanan tutar fiili gün sayısına değil, mahkemenin
> kabul edeceği süreye göre değişebilir.

Ardından kabuğun bastığı sabit bloklar: mevzuat tarihi → kapsam notu
(5.4/c) → zorunlu uyarı (5.4/d).

**Dayanak gösterimi.** Cetvelin kapanış satırı TBK m. 49 ve m. 50/2'ye
bağlanır. İçtihat künyesi 5.2'deki kurala tabi.

### 5.8. Kaldırılan eklerin kontrolü — § 2'de söz verilmişti

§ 2.7'de, 12.06.2026 tarihli değişikliğin Ek-2 ve Ek-3'ü de kaldırdığı ve
bu araca geçmeden önce kontrol edilmesi gerektiği yazılmıştı. Kontrol
yapıldı:

- **Ek-2 ve Ek-3 bu aracı ilgilendirmiyor.** İkisi de bedensel zarar
  kalemlerinin hesabına ilişkin: destekten yoksun kalma tazminatı ve
  sürekli sakatlık tazminatı. Kaynaklar hangi numaranın hangisine ait
  olduğunda çelişiyor (biri Ek-2'yi destekten yoksun kalma, diğeri Ek-3'ü
  gösteriyor); ayrım bu araç bakımından önemsiz olduğu için
  çözülmedi. Ek-7'nin içeriği belirlenemedi.
- **ZMSS teminatı bakımından.** İkincil kaynaklar araç mahrumiyetini
  dolaylı zarar sayıp zorunlu trafik sigortası teminatının dışında kabul
  ediyor; talebin işleten ve sürücüye yöneltilmesi gerektiğini söylüyor.
  Bu, senin belirlediğin çerçeveyle ("kusurlu sürücüden ve araç
  sahibinden") birebir örtüşüyor. Birincil metinden teyit edilemedi
  (gov.tr erişimi yok). **Hesabı etkilemiyor**, çünkü araç zaten
  sigortacıya değil sorumlulara yöneltilen talebi anlatıyor.

### 5.9. Onay durumu — dört sorunun cevabı

Sorular 20 Eylül 2026'da soruldu, **21 Eylül 2026'da** cevaplandı:

| # | Soru | Cevap |
|---|---|---|
| 1 | Yargıtay künyesi teyit edilebildi mi? | ✅ **Evet.** 4. HD, T. 29.09.2022, E. 2021/26777, K. 2022/11236. İki bağımsız kaynaktan teyit edildi (5.2). Sonuç ekranında gösteriliyor |
| 2 | Kusur oranı forma mı, kapsam notuna mı? | **Kapsam notuna** — öneri onaylandı, forma girdi eklenmedi (5.4/c) |
| 3 | Ticari araç belirtilsin mi? | **Evet** — kapsam notuna eklendi (5.4/c) |
| 4 | `lawAsOf` = 20 Eylül 2026 | Onaylandı |

**Kodlama sırası** (CLAUDE.md Bölüm 6): belge → onay → `src/lib/` saf
fonksiyon → Vitest → arayüz. Sıra atlanmadı.

- **Onay Durumu:** ✅ **Onaylandı — 21 Eylül 2026**

## 6. Dava / İcra Harç ve Masraf Hesaplama

> **Durum: ONAYLANDI ve YAYINDA.** Kod yazıldı, testler geçiyor.

### 6.1. Bu araç öncekilerden farklı: tek formül değil, kalem listesi

Kira aracında tek orana tek çarpma, faiz aracında dönemlere bölme vardı.
Burada ise bir **kalem listesi** toplanıyor ve hangi kalemlerin listeye
gireceği birkaç ayrı soruya bağlı:

- Dava mı, icra takibi mi?
- Konusu **para ile ölçülebilir** mi (nispi harç) yoksa ölçülemez mi (maktu)?
- Hangi mahkeme? (başvurma harcı sulh ve asliyede farklı)
- Kaç taraf var? (tebligat gideri taraf başına)
- Avukatla mı takip ediliyor? (baro pulu, vekâlet suret harcı)

Yani hesap, **koşullu bir toplam**. Cetvel burada da işini yapıyor:
kullanıcı toplam rakamı değil, hangi kalemin neden listede olduğunu
görmeli.

### 6.2. En büyük risk: tarifeler her yıl değişiyor

Kira aracında bakım yükü aylık tek bir orandı, faizde yılda bir-iki
oran. Burada **on beşe yakın rakam** var ve hepsi her yıl 1 Ocak'ta
yeniden belirleniyor (Harçlar Kanunu genel tebliği, HMK gider avansı
tarifesi, TBB pul bedelleri, icra satış giderleri tarifesi).

> **Tasarım sonucu:** Tarife tablosu **yıl bazlı** tutulmalı ve araç
> hangi yılın tarifesini kullandığını sonuç ekranında göstermelidir.
> Yıl geçtiğinde tablo güncellenmezse araç sessizce eski rakamları
> verir — kira aracındaki bayatlama korumasının aynısı burada da
> gerekiyor: tablosu olmayan yıl için hesap yapılmamalı.

### 6.3. Kanuni dayanak

| Konu | Dayanak |
|---|---|
| Yargı harçları (başvurma, karar ve ilam, peşin) | **492 s.K. Harçlar Kanunu**, (1) Sayılı Tarife |
| Nispi harcın dörtte birinin peşin alınması | **492 s.K. m. 28** |
| Gider avansı | **HMK m. 114, 120** + yıllık Gider Avansı Tarifesi |
| İcra takibinde masraf — işlem başına peşin ödeme | **İİK m. 59** |
| İcra takibinde harç | 492 s.K. (1) Sayılı Tarife, B bölümü |
| Vekâlet pulu / baro pulu | **1136 s.K. Avukatlık Kanunu m. 27** |
| Vekâlet ücreti | **Avukatlık Asgari Ücret Tarifesi (AAÜT)** |

### 6.4. Dava açılış maliyeti — kalemler

| Kalem | Nasıl hesaplanır |
|---|---|
| Başvurma harcı | Maktu, mahkemeye göre değişir |
| **Peşin harç** (nispi davada) | Dava değeri × nispi oran × **1/4** |
| **Maktu karar ve ilam harcı** (nispi olmayan davada) | Sabit tutar |
| Gider avansı — tebligat | Taraf sayısı × tebligat birim gideri × katsayı |
| Gider avansı — diğer iş ve işlemler | Sabit tutar |
| Vekâlet pulu | Avukatla takipte, sabit |

Bakiye nispi harç (kalan 3/4) karar aşamasında ödenir — **açılış
maliyeti değil.** Araç bunu ayrı bir bilgi satırı olarak göstermeli,
toplama katmamalı.

### 6.5. İcra takibi açılış maliyeti — kalemler

| Kalem | Nasıl hesaplanır |
|---|---|
| Başvurma harcı | Maktu |
| **Peşin harç** | Asıl alacak × **binde 5** *(ilamlı takipte peşin harç yok)* |
| Tebligat gideri | Borçlu sayısı × birim gider (normal PTT / UETS farklı) |
| Baro pulu | Avukatla takipte |
| Vekâlet suret harcı | Avukatla takipte |

**Tahsil harcı** takip açılışında değil, tahsilat gerçekleştiğinde ve
tahsilatın hangi aşamada olduğuna göre değişen oranlarda alınıyor —
açılış maliyetine girmiyor, ayrı bir bilgi olarak anılabilir.

### 6.6. 2026 rakamları ve doğrulama durumu

Her kalem kaynağıyla ve doğrulama düzeyiyle birlikte kayıtlı.
Doğrulanmamış bir rakam kodlanmaz.

#### Harçlar — 98 Seri No'lu Tebliğ (RG 31.12.2025, Sayı 33124, 5. Mükerrer)

Maktu harçlar **%18,95** oranında artırılarak yürürlüğe girdi.

| Kalem | 2026 tutarı |
|---|---|
| Sulh mahkemeleri **ve icra tetkik mercileri** başvurma harcı | **335,20 TL** |
| Asliye ve idare mahkemeleri başvurma harcı | **732,00 TL** |
| **İcra başvuru harcı** (icra dairesinde takip açılışı) | **732,00 TL** |
| Yargıtay ve Danıştay başvurma harcı | 1.124,50 TL |
| Anayasa Mahkemesi bireysel başvuru harcı | 6.024,10 TL |
| Keşif harcı | 5.188,00 TL |

*Kaynak: tebliğe dayanılarak Av. Onur Can Yılmaz tarafından verildi
(20 Eylül 2026). Tebliğin kimliği Resmî Gazete'nin içindekiler
sayfasından ayrıca doğrulandı.*

#### Tebligat — PTT Posta ve Telgraf Ücret Tarifesi (04.02.2026)

| Gönderi türü | Ücret |
|---|---|
| **Normal tebligat** (100 g'a kadar) | **265,00 TL** |
| Hızlı tebligat | 530,00 TL |
| İadeli taahhütlü / cevaplı tebligat | 390,00 TL |
| MTS tebligat | 310,00 TL |
| Taahhütlü gönderi | 125,00 TL |
| Normal tebligatta sonraki her 1.000 g | 45,00 TL |

*Normal, hızlı, MTS ve ağırlık kademesi tarife PDF'inden doğrudan
okundu. İadeli taahhütlü ve taahhütlü gönderi rakamları Av. Onur Can
Yılmaz tarafından verildi.*

#### Nispi harçlar ve oranlar

| Kalem | Değer | Dayanak |
|---|---|---|
| **Nispi karar ve ilam harcı** | **binde 68,31** (%6,831) | Hüküm altına alınan değer üzerinden |
| **Peşin harç** | Nispi harcın **1/4**'ü | 492 s.K. m. 28 |
| **Maktu karar ve ilam harcı** | **732,00 TL** | Konusu belli değerle ilgili olmayan davalar |
| **İcra peşin harcı** | **binde 5** (%0,5) | **492 s.K. m. 29** — ilamsız ve kambiyo senetlerine mahsus takipler |

> **m. 29'un lafzından çıkan sonuç:** İcra peşin harcı yalnızca
> **ilamsız** ve **kambiyo senetlerine mahsus** takiplerde alınıyor.
> İlamlı takipte alınmadığı yönündeki taslak notu bu ifadeyle
> destekleniyor — araçta ilamlı/ilamsız ayrımı bir dal olarak gerekiyor.

#### Avukatlı takipte eklenen kalemler

| Kalem | Değer |
|---|---|
| Baro pulu (vekâlet pulu) | **164,00 TL** |
| Vekâlet suret harcı | **104,00 TL** |

> ⚠️ **Vekâlet suret harcında ikincil kaynakla fark var.** Taslağa
> ikincil kaynaktan **110,00 TL** olarak girilmişti; Av. Onur Can
> Yılmaz **104,00 TL** verdi. Tabloya 104,00 yazıldı. Fark küçük ama
> kaydı tutuluyor ki ileride hangisinin nereden geldiği izlenebilsin.

#### Gider avansı — HMK Gider Avansı Tarifesi m. 4

Davacı, dava açarken **peşin** olarak yatırır:

| Kalem | Hesap |
|---|---|
| Tebligat gideri | **taraf sayısı × 5 × 265,00 TL** |
| Diğer iş ve işlemler (maktu) | **530,00 TL** |

Katsayı **5**, tarifenin m. 4 hükmünden geliyor: davacı taraf sayısının
beş katı tutarında tebligat ücreti yatırmakla yükümlü.

Örnek: 1 davacı + 1 davalı → 2 × 5 = 10 tebligat → 2.650 TL; artı
530 TL maktu → **3.180 TL** gider avansı.

#### Nispi harçta asgari taban

**Nispi karar ve ilam harcı 732,00 TL'den aşağı olamaz.** Dava değeri
düşük olduğu için binde 68,31 üzerinden hesaplanan tutar bu rakamın
altında kalırsa taban uygulanır.

*(Tapu ve kadastro işlemlerinde ayrı bir asgari taban var — 411,60 TL —
ama o bu aracın kapsamı dışında.)*

> ✅ **ÇÖZÜLDÜ — (a) okuması onaylandı.** Taban nispi harca uygulanır,
> peşin harç onun dörtte biridir. 5.000 TL'lik davada: ham nispi 341,55
> → taban 732,00 → peşin **183,00 TL**.
>
> Bu yorum `harc-masraf.test.ts` içinde adı açıkça "ASGARİ TABAN
> YORUMU" olan bir testle sabitlendi. Yorum değişirse yalnızca o test
> kırılır ve düzeltilecek yer belli olur.
>
> <details><summary>Değerlendirilen iki okuma</summary>
> 5.000 TL'lik bir davada ham nispi harç 341,55 TL çıkıyor ve taban
> devreye girip 732,00 TL oluyor. Peşin harç bundan sonra:
>
> | Okuma | Peşin harç |
> |---|---|
> | (a) Taban nispi harca uygulanır, peşin onun 1/4'ü | **183,00 TL** |
> | (b) Taban doğrudan peşin harca uygulanır | 732,00 TL |
>
> Fark dört kat. 492 s.K. m. 28'in lafzı (*"nispi karar ve ilam
> harcının dörtte biri"*) (a)'yı destekliyor.
> </details>

### 6.6b. Dört çelişkinin durumu

| # | Çelişki | Durum |
|---|---|---|
| 1 | Artış oranı | ✅ **ÇÖZÜLDÜ: %18,95.** 2025 yeniden değerleme oranı. %43,93 büyük ihtimalle 2024 oranıydı — o rakamı 2026 için veren kaynak bir yıl geriymiş |
| 2 | İcra başvurma harcı 335,20 mı 732,00 mü | ✅ **ÇÖZÜLDÜ: ikisi de doğru, ayrı harçlar.** 335,20 TL **icra tetkik mercii** (icra hukuk mahkemesi) başvurma harcı; 732,00 TL **icra dairesinde takip açılışı** başvuru harcı. Araç ikisini karıştırmamalı — takip açan kullanıcı 732,00'yi öder |
| 3 | Tebligat gideri | 🟡 **Yarısı çözüldü.** Birim ücret 265,00 TL doğrulandı. Ama gider avansı tarifesinde taraf başına **5 katsayısı** olup olmadığı hâlâ açık; bu PTT'nin değil Adalet Bakanlığı tarifesinin konusu. Katsayı varsa 2 taraflı davada tebligat gideri 530 değil **2.650 TL** |
| 4 | Nispi harçta asgari taban | ⬜ Çözülmedi |

### 6.7. Kapsam önerim

Kira ve faizdeki dersle: dar başla.

**v1'de olsun:**

- **Dava açılış maliyeti**: nispi ve maktu ayrımı, mahkeme türüne göre
  başvurma harcı, gider avansı, isteğe bağlı vekâlet pulu
- **İlamsız icra takibi açılış maliyeti**: başvurma harcı, peşin harç,
  tebligat, isteğe bağlı avukat kalemleri
- Tek yıl tarifesi (2026), yıl bazlı tabloya hazır yapı

**v1'de olmasın:**

| Kapsam dışı | Gerekçe |
|---|---|
| **Vekâlet ücreti (AAÜT)** | Ayrı ve geniş bir tarife; dava türüne göre değişen maktu ve nispi kademeleri var. Kendi başına bir araç olmayı hak ediyor |
| Bakiye nispi harç, tahsil harcı | Açılış maliyeti değil; bilgi satırı olarak gösterilir |
| Bilirkişi, keşif, tanık avansları | Dava sırasında ve hâkim takdiriyle isteniyor |
| İcra satış giderleri | Satış aşamasına ait; takip açılışında ödenmiyor |
| İstinaf / temyiz harçları | Ayrı aşama |
| Harçtan muafiyet ve adli yardım | Nitelendirme gerektiriyor, araç bilemez |

### 6.7b. Hesaplama adımları

**Dava açılışı**

```
1. Başvurma harcı  ← mahkeme türüne göre (sulh 335,20 · asliye/idare 732,00)
2. Konusu para ile ölçülebiliyor mu?
   · EVET → nispiHarc = davaDegeri × 0,06831
            nispiHarc = max(nispiHarc, 732,00)       ← asgari taban
            pesinHarc = nispiHarc / 4                 ← 492 m.28
            bakiye    = nispiHarc − pesinHarc         ← karar aşamasında, TOPLAMA GİRMEZ
   · HAYIR → maktuHarc = 732,00 (peşin ödenir)
3. Gider avansı = (tarafSayisi × 5 × 265,00) + 530,00
4. Avukatla takip ediliyorsa: + 164,00 (baro pulu) + 104,00 (vekâlet suret harcı)
5. Açılış toplamı = 1 + (2'deki peşin veya maktu) + 3 + 4
```

**İlamsız icra takibi**

```
1. Başvuru harcı 732,00
2. Peşin harç = alacak × 0,005          ← 492 m.29, ilamsız ve kambiyo takipleri
   · İLAMLI takipte bu adım YOK
3. Tebligat = borçluSayisi × 265,00
4. Avukatla takip ediliyorsa: + 164,00 + 104,00
5. Toplam = 1 + 2 + 3 + 4
```

> ✅ **İcra tarafında ×5 katsayısı uygulanmıyor — doğrulandı.**
> Gider Avansı Tarifesi'ndeki "taraf sayısının beş katı" kuralı yalnızca
> hukuk mahkemelerinde açılan davaları kapsıyor ve bir **dava şartı**.
> İcra takibi İİK'ya tabi ve oradaki kural farklı: **yapılacak işlem
> kadar masraf peşin ödenir (İİK m. 59).** Takip açılışında borçlu
> başına tek tebligat (ödeme veya icra emri) hesaplanır.
>
> Sonraki tebligatlar (yenileme, kıymet takdiri, satış ilanı) kendi
> işlemleri sırasında ayrıca masraflanıyor — açılış maliyetine
> girmiyor, aracın kapsamı dışında.

### 6.7c. Örnek hesaplar (onay bekliyor)

**Dava** — 100.000 TL, asliye hukuk, 2 taraf, avukatlı:

| Kalem | Tutar |
|---|---|
| Başvurma harcı | 732,00 |
| Nispi karar ve ilam harcı | 6.831,00 |
| **Peşin harç** (1/4) | **1.707,75** |
| Gider avansı | 3.180,00 |
| Baro pulu | 164,00 |
| Vekâlet suret harcı | 104,00 |
| **Açılış toplamı** | **5.887,75 TL** |
| *Bakiye nispi harç (karar aşamasında)* | *5.123,25 TL* |

**İcra** — 100.000 TL ilamsız takip, 1 borçlu, avukatlı:

| Kalem | Tutar |
|---|---|
| Başvuru harcı | 732,00 |
| Peşin harç (binde 5) | 500,00 |
| Tebligat | 265,00 |
| Baro pulu | 164,00 |
| Vekâlet suret harcı | 104,00 |
| **Toplam** | **1.765,00 TL** |

### 6.8. Onay durumu

Tüm rakamlar, formül ve tasarım kararları kapandı.

| Karar | Sonuç |
|---|---|
| Asgari taban | (a) — taban nispi harca, peşin onun 1/4'ü |
| Kapsam | Kabul — vekâlet ücreti (AAÜT) dışarıda; bakiye nispi harç ve ilamlı takipte peşin harç bilgi satırı |
| Mahkeme listesi | Sulh · asliye/idare olarak ikiye ayrıldı |
| Yuvarlama | Kuruş korunuyor |
| İcrada ×5 katsayısı | Yok — İİK m. 59, işlem başına masraf |

### 6.9. Kaynaklar

Tamamı **ikincil**. Birincil kaynaklar: `mevzuat.gov.tr` (492 s.K., HMK,
İİK), Resmî Gazete'de yayımlanan yıllık tarifeler, TBB duyuruları.

**Birincil:**

- **Harçlar Kanunu Genel Tebliği (Seri No: 98)** — Resmî Gazete 31.12.2025, Sayı 33124 (5. Mükerrer). [Gazete PDF](https://www.resmigazete.gov.tr/eskiler/2025/12/20251231M5.pdf) *(rakamlar bu makinede okunamadı, bkz. 6.6)*
- **PTT Posta ve Telgraf Ücret Tarifesi, 04.02.2026** — [ptt.gov.tr/tarifeler](https://www.ptt.gov.tr/tarifeler) · tebligat birim ücretleri buradan alındı
- 492 sayılı Harçlar Kanunu, HMK m. 114/120, İİK m. 59 — `mevzuat.gov.tr`

**İkincil** (yalnızca yön göstermek için; rakamları doğrulanmadan kodlanmayacak):

- [2026 yılı harç oran ve tutarları özeti (Vergide Gündem)](https://www.vergidegundem.com/uploads/SIRKULER_006_Harclar_EK_52fef5377e.pdf)
- [2026 dava açma maliyetleri: harçlar ve gider avansı (Av. Mete Şahin)](https://www.avukatmetesahin.com/post/2026-dava-acma-maliyetleri-harclar-ve-gider-avansi)
- [İcra takibi masrafı hesaplama, 2026 tarifesi (İşleyen Hukuk)](https://isleyenhukukburosu.com/hesaplama-araclari/icra-masrafi-hesaplama/)
- [Yargı harçları ve avanslar 2026 (Bal Law Firm)](https://ballawfirm.com/yargi-harclari-ve-avanslar/)
- [2026 yılı güncel yargı harçları Resmî Gazete'de (Sanal Hukuk)](https://sanalhukuk.org/2025/12/31/2026-yili-guncel-yargi-harclari-resmi-gazetede-yayimlandi/)
- [2026 icra satış giderleri tarifesi (İcra Hukuku)](https://www.icra.gen.tr/2026-satis-giderleri-tarifesi-yayinlandi/)

### 6.10. Test senaryoları

Kodlandı — `src/lib/harc-masraf.test.ts`, 19 test:

| Dal | Doğrulanan |
|---|---|
| Dava örneği | 6.7c'deki hesap birebir (5.887,75 TL) |
| Bakiye nispi harç | Bilgi satırı, toplama girmiyor |
| **Asgari taban yorumu** | Adı açık test — yorum değişirse yalnız bu kırılır |
| Taban devreye girmeyen dava | Açıklama metni taban demiyor |
| Maktu dava | Nispi satırlar hiç üretilmiyor |
| Sulh mahkemesi | Başvurma harcı farklı |
| Avukatsız | Pul ve suret harcı hiç eklenmiyor |
| Çok taraflı | Tebligat doğrudan katlanıyor |
| İcra örneği | 6.7c'deki hesap birebir (1.765,00 TL) |
| **İcrada ×5 yok** | 3 borçlu → 795 TL, 3.975 değil |
| İlamlı takip | Peşin harç bilgi satırı, tutar 0 |
| Girdi doğrulama | Taraf/borçlu sayısı, dava değeri, alacak |
| Tarife tablosu | Bilinmeyen yıl hesaplanmıyor · 2026 değerleri birebir · pozitiflik |

- **Onay Durumu:** ✅ **Onaylandı** — Av. Onur Can Yılmaz, 20 Eylül 2026.
  Kod: `src/lib/harc-masraf.ts` + `src/lib/harc-tarifeleri.ts`, sayfa
  `src/pages/hesaplama-araclari/harc-ve-masraf.astro`.

## 7. Şirket Kuruluş Maliyeti Hesaplama

- **Kanuni Dayanak (başlangıç noktası):** Türk Ticaret Kanunu, güncel harç/damga vergisi tarifeleri
- **Girdi alanları:** Şirket türü (LTD/AŞ), sermaye miktarı, ortak sayısı
- **Formül:** _TODO_
- **Kaynak(lar):** _TODO_
- **Test örnekleri:** _TODO_
- **Onay Durumu:** ⬜ Bekliyor

## 8. Marka Tescil Süreç Takvimi

- **Kanuni Dayanak (başlangıç noktası):** 6769 sayılı Sınai Mülkiyet Kanunu, TÜRKPATENT süreçleri
- **Not:** Bu bir hesap makinesi değil, interaktif bir zaman çizelgesi/aşama göstergesi olacak — "formül" yerine aşama süreleri (ör. ilan süresi 2 ay, itiraz süresi vb.) doğrulanmalı.
- **Aşama süreleri:** _TODO_
- **Kaynak(lar):** _TODO_
- **Onay Durumu:** ⬜ Bekliyor

---

**Genel kural:** Bir araç "Onaylandı" olmadan canlıya alınmaz. Onaylanan her aracın sonuç ekranında, bu belgedeki "Kanuni Dayanak" bilgisi kullanıcıya gösterilir.
