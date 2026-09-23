# Hesaplama Araçları — Formül ve Kaynak Kayıt Defteri

Bu belge, `CLAUDE.md` Bölüm 6'daki her hesaplama aracının **kodlanmadan önce** doğrulanmış formülünü ve hukuki dayanağını kayıt altına almak için var. Kural: bir araç için bu belgedeki ilgili bölüm doldurulup "Onay Durumu: Onaylandı" olarak işaretlenmeden, `src/lib/` altında o aracın kodu yazılmaz.

Her bölümdeki "Kanuni Dayanak" ve "Kaynak" alanları şu an genel araştırmadan gelen başlangıç noktalarıdır — **kesinleşmiş formül değildir**. Av. Onur Can Yılmaz tarafından doğrulanıp somut katsayı/formülle güncellenmesi gerekir.

---

## 1. İnfaz / Yatar Hesaplama

> **Durum: KODLANDI — 23 Eylül 2026.** Kod `src/lib/infaz*.ts`, arayüz
> `src/pages/hesaplama-araclari/infaz-hesaplama.astro`, 25 test geçiyor.
> Ayrıntı 1.16'da.

### 🚫 YAYIN ENGELLERİ — iki madde

Araç çalışıyor ve testleri geçiyor, ama **aşağıdaki iki madde
kapanmadan canlıya alınmamalıdır.** İkisi de Av. Onur Can Yılmaz'ın
kendi infaz dosyası tecrübesiyle teyit edeceği noktalar; web
araştırmasıyla çözülemediler.

| # | Madde | Neden yayın engeli | Ayrıntı |
|---|---|---|---|
| **1** | **Mahsup sırası (A/B okuması)** | Kod A okumasını uyguluyor (mahsup → oran). Bir pratisyen kaynağı ters sırayla hesaplıyor. **Yanlışsa mahsuplu her dosyada tarih kayar** — 18 yıllık cezada 80 güne kadar | 1.15/Karar 1 |
| **2** | **TCK m. 188 oranı** | 2/3 mü 3/4 mü belirlenemedi. Araç şu an oranı kullanıcıya seçtiriyor; bu geçici çözüm, kalıcı cevap değil | 1.13/4 |

Birinci madde **sessiz** bir hata riski taşıdığı için sonuç ekranı ara
adımları gösteriyor (1.15) — sıra yanlışsa ekrandan okunabilsin.
İkincisi kullanıcıya açıkça soruluyor, zaten sessiz kalmıyor.

Bu iki madde kapanınca bölümün durumu **"Yayına hazır"**a çevrilecek.

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
| **7571** (11. paket) | 25.12.2025 | **Geçici m.10/6** — 31.07.2023 ve öncesi suçlar. 🔴 *Sabit 3 yıllık indirim DEĞİL, bir EŞİK kuralı; kapalıda geçirme şartı cezaya göre 1 veya 3 ay. Bkz. **1.13/1**.* |
| **7589** (12. paket) | 31.07.2026 | **5275'in infaz rejimine dokunmuyor.** Genel af veya infaz indirimi yok. Kontrol edildi, bu araç açısından etkisiz. |
| **7593** | **08.08.2026** | **m.107/5** — çocuk hükümlü indirimi yeniden yazıldı: kasten öldürme, TCK 102-103, 188 ve 220 hariç, 15 yaşını dolduruncaya kadar kurumda geçen **1 gün 2 gün** sayılır. Bkz. **1.14/a**. *(v1 kapsamı dışı — SSÇ v2'de.)* |

> ✅ **7571'in kapsam dışı bıraktığı suçlar — resmî metinden doğrulandı.**
> Tam liste **1.13/1**'de. Önceki ikincil kaynak listesi kabaca doğruymuş
> ama eksikti: TCK İkinci Kitap Dördüncü Kısım'ın dört bölümü ve kasten
> öldürmedeki TCK 82/1-d,e,f istisnası kayıtlarda yoktu.
>
> ⚠️ **Altı değişiklik oldu.** Bu tablo 7242 ile başlayıp 7593 ile
> sürüyor; sonuncusu bu yılın Ağustos'unda yürürlüğe girdi ve biz
> haberdar değildik. § 1.1'deki "bir sonraki paket bu aracı sessizce
> yanlış hâle getirir" uyarısı teorik değil — **zaten bir kez oldu.**
> Araç yayına girerse mevzuat takibi bir bakım işi hâline gelir.

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

| Kategori | Oran | Dayanak |
|---|---|---|
| Genel kural (adi suçlar) | **1/2** | m.107/2 |
| **Katalog suçlar** (tam liste 1.13/3'te) | **2/3** | m.107/2 bentleri |
| Örgüt kurmak/yönetmek veya örgüt faaliyeti çerçevesinde işlenen suçlar (TCK 220) — **süreli hapis** | **2/3** | **m.107/2 son cümle** |
| Nitelikli cinsel suçlar (TCK 102/2, 103, 104/2-3) | **3/4** | m.107/2 |
| **Uyuşturucu imal ve ticareti (TCK 188)** | ⚠️ **AÇIK — 1.13/4** | — |
| **Terör suçları** | **3/4** | **3713 m.17** — m.107 tablosundan DEĞİL, ayrı dal |
| Mükerrir — süreli hapis (m.108) | **2/3** | m.108 |
| İkinci defa mükerrir — süreli hapis (7550 s.K. sonrası) | **3/4** | m.108 |

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

> 🔴 **TCK m.188 — ÖNCEKİ KAYIT GERİ ALINDI, SORU YENİDEN AÇIK.**
> Bu kutuda "ayrım 30.03.2020 eşiğinden geliyor" yazıyordu. **O kayıt
> ikincil kaynaklara dayanıyordu ve resmî metin kontrolünde
> doğrulanamadı.** Ayrıntı ve yeni bulgular 1.13/4'te; eşik tarihi
> 30.03.2020 değil **28.06.2014** olabilir. Bu satır çözülmeden araç
> yayına alınamaz.

> ✅ **Oran çakışması — ÇÖZÜLDÜ.** Katalog suç oranı ile mükerrirlik
> oranı çakıştığında **yüksek olan (hükümlü aleyhine olan) oran**
> uygulanır. Örnek: nitelikli cinsel suç (3/4) + birinci defa mükerrir
> (2/3) → **3/4**. (Önceki örnek TCK m.188 üzerindendi; o oran 1.13/4'te
> yeniden açıldığı için örnek değiştirildi.)
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

> ✅ **HÂL B ve C DOĞRULANDI — fıkranın iki cümlesi farklı kurulmuş.**
>
> Geçici m.10/6'nın tam metni iki ayrı cümle ve **ikisi aynı şeyi
> yapmıyor**:
>
> > ...açık ceza infaz kurumlarına ayrılmasına **üç yıl veya daha az süre
> > kalanlar**, bu şartların oluştuğu tarih itibarıyla açık ceza infaz
> > kurumlarına ayrılabilir. Bu hükümlüler ile 31/7/2023 tarihi ve
> > öncesinde işlenmiş suçlar nedeniyle açık ceza infaz kurumlarında
> > bulunan hükümlüler, **talepleri hâlinde en az üç ay açık ceza infaz
> > kurumunda kalmış olmak şartıyla** ilgili mevzuat uyarınca cezalarının
> > denetimli serbestlik tedbiri altında infazı uygulamasından **üç yıl
> > erken yararlandırılır.**
>
> | Cümle | Yapısı | Sonuç |
> |---|---|---|
> | **Açığa ayrılma** | "üç yıl veya daha az **kalanlar**… ayrılabilir" | **Eşik kuralı** |
> | **Denetimli serbestlik** | "üç yıl **erken yararlandırılır**" — "kalanlar" ve "şartların oluştuğu tarih" ibareleri YOK | **Sabit kaydırma** |
>
> Yani 1.13/1'deki eşik düzeltmesi **yalnızca açığa ayrılma tarihini**
> etkiliyor; DS tarihini etkilemiyor. Yukarıdaki tablodaki
> **"1 + 3 = 4 yıl" doğru ve olduğu gibi kalıyor.**
>
> **DS'ye özgü iki şart** (açığa ayrılmada yok):
>
> 1. **Talep gerekiyor** — "talepleri hâlinde". Otomatik değil.
> 2. **En az üç ay açık ceza infaz kurumunda** kalmış olmak.
>
> ➡️ **Kod sonucu: iki AYRI fonksiyon.** Açığa ayrılma (eşik mantığı) ve
> DS (sabit kaydırma) tek bir fonksiyonda birleştirilmeyecek; mantıkları
> farklı ve birinin düzeltilmesi diğerini bozmamalı.

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
1. Ceza ve mahsubu AY cinsine çevir (1 yıl = 12 ay, 1 ay = 30 gün)
2. Mahsup (TCK m.63) hükmolunan cezadan düşülür → kalan ceza
   · A okuması — oran BUNDAN SONRA uygulanır (bkz. 1.15/Karar 1)
3. Suç tarihi eşiklerini belirle: 30.03.2020 / 31.07.2023 / 04.06.2025
4. Suç kategorisi + tekerrür → KS oranını seç
   · çakışma hâlinde YÜKSEK oran (bkz. 1.4 sonu)
5. Kurumda geçirilecek süre (oran YIL-AY-GÜN seviyesinde uygulanır,
   sonuç sonra güne çevrilir — bkz. 1.15/Karar 2):
   · süreli hapis  → kalan ceza × KS oranı
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

**⬜ Yayın için kalan üç adım** *(23.09.2026 itibarıyla güncellendi):*

1. ~~**Resmî metin kontrolü**~~ — ✅ **tamamlandı** (1.12, 1.13, 1.14).
   Dört soru kapandı, biri açık kaldı.
2. ⚠️ **TCK m.188 oranı** (1.13/4) — tek açık hukuki madde. v1 için
   geçici çözüm kararlaştırıldı (kullanıcıya iki oran seçeneği), ama
   kalıcı cevap aranıyor.
3. **Test senaryolarının beklenen tarihleri** (1.10) — 24 senaryonun
   girdi tarafı dolu, beklenen dört tarih boş. **1.13'teki düzeltmeler
   sonrası yeniden gözden geçirilmeli**; özellikle Geçici m.10/6 mantığı
   değiştiği için DS tarihlerini etkileyen senaryolar.

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
| ~~4~~ | ~~05.06.2021~~ | ~~10 yıl~~ | ~~Uyuşturucu (TCK 188)~~ | — | — | — | 🚫 **FİKSTÜRDEN ÇIKARILDI** (1.15). DS hâl C'yi sınayan yeni bir senaryo, oranı açık olmayan bir suçla yeniden yazılacak |
| ~~5~~ | ~~12.01.2019~~ | ~~10 yıl~~ | ~~Uyuşturucu (TCK 188)~~ | — | — | — | 🚫 **FİKSTÜRDEN ÇIKARILDI** (1.15) |

#### Tekerrür ve oran çakışması

| # | Suç tarihi | Ceza | Kategori | T | Önceki ilam | İB | M | Neyi doğrular |
|---|---|---|---|---|---|---|---|---|
| 6 | 20.03.2024 | 6 yıl | Adi suç (hırsızlık) | 1. defa mükerrir | 2 yıl | 10.05.2026 | 0 | Mükerrir oranı 2/3 **ve** m.108/2 tavanı |
| 7 | 08.02.2024 | 12 yıl | **Nitelikli cinsel suç (TCK 102/2)** | 1. defa mükerrir | 3 yıl | 01.06.2026 | 0 | **Oran çakışması**: max(3/4, 2/3) = 3/4. *Kategori 188'den değiştirildi — oranı açık olan bir suç üzerinden çakışma testi kurulamaz* |
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

### 1.12. Resmî metin kontrolü — TAMAMLANDI (23 Eylül 2026)

Av. Onur Can Yılmaz kontrolü `mevzuat.gov.tr` konsolide metinleriyle
yaptı. Sonuçlar 1.13 ve 1.14'te.

- [x] m.107 oran tablosu — doğrulandı, **iki düzeltmeyle** (1.13/3)
- [x] Örgüt oranı — süreli hapiste **2/3**, dayanağı m.107/2 son cümle; m.107/4 oran maddesi değil (1.13/3)
- [x] m.108 — 33/39 yıl ve m.108/2 lafzı; ayrıca ikinci tekerrür yasağının kalktığı (1.14/c)
- [x] Geçici m.10/6 — **eşik kuralı**, sabit indirim değil (1.13/1)
- [x] Erken çıkışta başvuru şartı — açık kurumda yok, DS'de **var** (1.13/1)
- [x] TMK m.17/3 — birebir doğrulandı, belgeye girdi (1.13/2)
- [x] Katalog listeleri — 302-325 listede **değil**, 132-138 **eksikti** (1.13/3)
- [x] Küsurat kuralı — kanunda yok; tasarımla çözüldü (1.13/5)
- [x] İkinci tekerrürde tarih penceresi — resmî metinde **yok** (1.14/c)
- [x] ~~Hâl A'da erkenlik~~ — soru yanlış çerçevelenmişti; 30.03.2020 ile Geçici m.10'un ilgisi yok (1.13/1)
- [ ] ⚠️ **TCK m.188 oranı** — **TEK AÇIK MADDE** (1.13/4)
- [ ] 13. Yargı Paketi yürürlüğe girdi mi — *7593 çıktı (1.14/a); başka paket var mı, ayrıca bakılacak*

### 1.13. Resmî metin doğrulaması — 23 Eylül 2026

Av. Onur Can Yılmaz, 1.12'deki beş açık maddeyi **5275, 3713 ve 5237
sayılı kanunların `mevzuat.gov.tr` üzerindeki konsolide metinleriyle**
karşılaştırdı. Sonuçlar aşağıda. Ayrıntılı alıntılar claude.ai
projesindeki `infaz-hesaplama-kaynak-karsilastirmasi.md` § 9'da.

**Dördü kapandı, biri açık kaldı (m.188).**

#### 1) Geçici m.10/6 — "3 yıl erken çıkış" bir EŞİK KURALI, indirim değil

🔴 **Bu, belgedeki en büyük hatanın düzeltilmesi.**

Madde metni:

> ...31/7/2023 tarihi itibarıyla veya öncesinde işlenmiş suçlar nedeniyle
> kapalı ceza infaz kurumlarında bulunan hükümlülerden, toplam hapis
> cezası on yıldan az ise bir ayını, on yıl ve daha fazla ise üç ayını bu
> kurumlarda geçirip **açık ceza infaz kurumlarına ayrılmasına üç yıl
> veya daha az süre kalanlar**, bu şartların oluştuğu tarih itibarıyla
> açık ceza infaz kurumlarına ayrılabilir.

**Doğru mantık:**

```
kapaliSart = toplamCeza < 10 yıl ? 1 ay : 3 ay

eğer (normalAçığaAyrılma − bugün) ≤ 3 yıl
 VE  kapalıdaGeçen ≥ kapaliSart
→ açığaAyrılma = şartların oluştuğu tarih   (yani hemen)

değilse → madde HİÇ devreye girmez, normal tarih beklenir
```

> ❌ **`max(standartDS − 3 yıl, açığaAyrılma + 90 gün)` FORMÜLÜ YANLIŞ.**
> Rakip aracın kodundan çıkardığımız bu formül sabit bir indirim
> varsayıyordu. Madde sabit indirim vermiyor; **eşiğe girenleri öne
> alıyor**, girmeyenlere hiç dokunmuyor. Formül kullanılmayacak.

**Başvuru şartı — ikiye ayrılıyor:**

| Kısım | Başvuru gerekli mi |
|---|---|
| Açık kuruma ayrılma | **Hayır** — idari/otomatik |
| Erken denetimli serbestlik | **Evet** — madde açıkça "talepleri hâlinde" diyor |

Yani araç DS tarafında koşullu bir ikinci tarih göstermeli; açık kurum
tarafında göstermemeli.

**Maddeden yararlanamayan suçlar:**

- Kasten öldürme (TCK 82/1-d, e, f **hariç**)
- Cinsel dokunulmazlığa karşı suçlar (TCK 102, 103, 104/2-3)
- TCK İkinci Kitap Dördüncü Kısım **Dördüncü, Beşinci, Altıncı ve
  Yedinci** Bölümler
- TMK kapsamındaki suçlar
- Örgüt faaliyeti çerçevesinde işlenen suçlar

> ⚠️ **Soru yanlış çerçevelenmişti.** 1.12'de bu madde "30.03.2020
> öncesi mi" diye soruluyordu. **30.03.2020 (Geçici m.6) tamamen ayrı
> bir konu** — infaz oranı ve DS süresiyle ilgili. Geçici m.10'un eşiği
> **31.07.2023**. İkisi karıştırılmış; ayrıldı.

#### 2) TMK m.17/3 — birebir doğrulandı, belgeye girdi

3713 sayılı Kanun m. 17:

> Bu Kanun kapsamına giren suçlardan mahkûm olanlar, hükümlerinin
> **kesinleşme tarihinden sonra** bu Kanunun kapsamına giren bir suçu
> işlemeleri halinde, **şartla salıverilmeden yararlanamazlar.**

Dikkat: eşik **kesinleşme tarihi**, suç tarihi değil.

**Aynı maddedeki iki ek istisna — v1 kapsamı KARARA BAĞLANACAK:**

- Firar veya ayaklanma suçundan mahkûmiyet **ve** üç kez hücre hapsi
  cezası alanlar da KS'den yararlanamaz.
- Ölüm cezası ağırlaştırılmış müebbete dönüştürülen terör hükümlüleri
  **hiç** KS'den yararlanamaz.

İkisi de şimdilik not; v1'e alınıp alınmayacağına Av. Onur Can Yılmaz
karar verecek.

#### 3) Katalog suç listesi — doğrulandı ve iki düzeltme

**2/3 oranına tabi suçlar (m.107/2):**

| Grup | Maddeler |
|---|---|
| Kasten öldürme | TCK 81, 82, 83 |
| Neticesi sebebiyle ağırlaşmış yaralama | TCK 87/2-d |
| İşkence ve eziyet | TCK 94, 95, 96 |
| Cinsel suçlar (yetişkin hükümlü) | TCK 102 *(2. fıkra hariç)*, 104 *(2-3. fıkra hariç)*, 105 |
| Cinsel suçlar (çocuk hükümlü — ayrı bent) | TCK 102, 103, 104, 105 |
| Özel hayata karşı suçlar | **TCK 132-138** |
| Uyuşturucu imal ve ticareti | TCK 188 → **bkz. 1.13/4, oranı açık** |
| Devlet sırları ve casusluk | **TCK 326-339** |
| Örgüt suçları (süreli hapis) | TCK 220 — m.107/2 **son cümle** |

> ✅ **Düzeltme 1 — TCK 302-325 katalogda DEĞİL.** 1.12'de bu aralık açık
> soru olarak duruyordu; listede yok. Yalnızca **326-339** var.
>
> ✅ **Düzeltme 2 — TCK 132-138 eksikti.** 1.4 tablosunda hiç yoktu,
> eklendi.

**Örgüt suçlarında oran karışıklığı da giderildi:**

| Ceza türü | Örgüt suçunda ne uygulanır | Dayanak |
|---|---|---|
| **Süreli hapis** | **2/3 oranı** — 3/4 DEĞİL | m.107/2 son cümle |
| Müebbet / ağırlaştırılmış müebbet | **Sabit yıl** (30 / 36) — oran değil | m.107/4 |

Yani m.107/4 bir oran maddesi değil, müebbet cezalarında kurumda
geçirilecek sabit süreyi belirleyen madde. 1.4 tablosundaki "örgüt
(m.107/4) → 2/3" satırının dayanağı m.107/2 olarak düzeltildi.

**Terör suçları ayrı bir daldan gelir.** 3/4 oranı 5275 m.107'den değil,
doğrudan **3713 sayılı Kanun m. 17**'den geliyor. Kodda "terör suçu"
seçildiğinde oran m.107 tablosundan değil, ayrı bir daldan okunmalı.

#### 4) ⚠️ TCK m.188 — TEK AÇIK MADDE

Resmî metinde **fıkra ayrımı yok**: m.107/2 madde 188'i bütün olarak
2/3 listesine koyuyor. Ama Geçici m.9/4 şunu diyor:

> 102, 103, 104, 105 ve 188'de düzenlenen suçlardan **28/6/2014
> öncesi** işlenenler için koşullu salıverilme oranı **2/3**'tür.

Bu hüküm, 28.06.2014 **sonrası** için farklı (muhtemelen 3/4) bir oran
olduğunu **ima ediyor** ama bunu açıkça yazan bir madde bulunamadı.

**Bu oturumda yapılan ek araştırma — iki bulgu:**

1. **Eşik tarihi büyük olasılıkla 28.06.2014**, 30.03.2020 değil.
   28.06.2014, **6545 sayılı Kanun**'un yürürlük tarihi; Geçici m.9/4 de
   bu tarihi anıyor. Belgedeki 30.03.2020 rakamı ikincil kaynaklardan
   gelmişti ve resmî metinde karşılığı bulunamadı. **Geri alındı.**
2. **İkincil kaynaklarda çelişki sürüyor.** Bir kaynak m.188 için süreli
   hapiste 3/4 diyor; bir başka kaynak 188'i yalnızca **çocuk hükümlüler**
   bendinde (m.107/2-e) gösteriyor. Av. Onur Can Yılmaz'ın resmî metin
   okuması ise 188'i yetişkinler için de 2/3 listesinde (m.107/2-g)
   görüyor. **Üç okuma birbirini tutmuyor.**

> **Durum: ARAŞTIRILIYOR.** Çözülene kadar araç TCK 188 için oranı
> KENDİ SEÇMEYECEK.

**v1 davranışı — KARARA BAĞLANDI (23.09.2026):**

- Kullanıcı "uyuşturucu ticareti" seçtiğinde **sistem otomatik oran
  atamayacak.**
- Bir **uyarı/ara ekran** çıkacak: *"2/3 mü 3/4 mü olduğunuzu
  avukatınızdan teyit edin, çoğu durumda 2/3'tür."*
- Hesap, **kullanıcının seçtiği orana** göre yapılacak.

Formda bu seçenek diğer suç kategorilerinden **ayrı işlenmeli** — tek
bir açılır menü öğesi olarak geçiştirilemez, kendi dalı olacak.

> 🚫 **Bu madde ŞİMDİLİK ARAŞTIRILMAYACAK.** Av. Onur Can Yılmaz'ın
> talimatı: v1 yukarıdaki davranışla çıkar, kalıcı cevap sonraya kalır.
>
> **Fikstür sonucu:** uyuşturucu ticareti içeren test senaryoları
> fikstür listesinden **çıkarıldı** (1.10). m.188 netleşmeden o
> senaryoların "doğru" tarihini iddia edemeyiz.

**Çözmek için gereken:** 28.06.2014 sonrası TCK 188 suçlarında oranı
**3/4'e çıkaran hükmün kendisi** — 6545 s.K.'nın 5275'te hangi maddeyi
değiştirdiği. Bulunamazsa oran 2/3'te kalır ve iki seçenekli sunum
kalıcı olur.

#### 5) Küsurat kuralı — kanunda YOK, sorun tasarımla çözüldü

5275'in ilgili hiçbir maddesinde (107, 108, Geçici 6, Geçici 9, Geçici
10) yuvarlama/küsurat hükmü yok. Muhtemelen kanun hükmü değil, infaz
uygulamasının teamülü.

> ✅ **v1 kararı: küsurat yuvarlaması YAPILMAYACAK.** Sonuç ekranında
> gün/ay yuvarlaması yerine doğrudan **takvim tarihi** gösterilecek
> ("23.04.2029" gibi). Böylece "yukarı mı aşağı mı, gün mü ay mı"
> sorusu tamamen ortadan kalkıyor — cevaplanması gereken bir soru
> olmaktan çıkıyor.

Kod tarafında sonucu: hesap gün cinsinden yapılıp tarihe çevrilecek,
ara sonuçlarda ay/yıl yuvarlaması olmayacak.

### 1.14. Ek bulgular — 23 Eylül 2026

Resmî metin kontrolünde daha önce hiç bilmediğimiz üç şey çıktı.

#### a) 7593 sayılı Kanun (08.08.2026) — m.107/5 değişti

Çocuk hükümlü indirimi yeniden yazılmış. Güncel hâli: **kasten öldürme,
cinsel suçlar (TCK 102, 103), uyuşturucu (188) ve örgüt (220) hariç**,
KS süresi hesabında hükümlünün **15 yaşını dolduruncaya kadar** infaz
kurumunda geçirdiği **1 gün, 2 gün** sayılır.

> ⚠️ **Mevzuat zinciri yine uzadı.** 1.2'deki değişiklik listesi beş
> kanundu (7242, 7456, 7550, 7571, 7589); 7593 ile **altı** oldu ve
> sonuncusu bu yılın Ağustos ayında yürürlüğe girmiş. Bu, § 1.1'de
> yazılan "bir sonraki paket bu aracı sessizce yanlış hâle getirir"
> riskinin somut kanıtı.

#### b) Çocuk hükümlü indiriminin İKİ REJİMİ var

| Suç tarihi | Rejim | Dayanak |
|---|---|---|
| **30.03.2020 öncesi** | 15 yaş altı: 1 gün = **3 gün** · 18 yaş altı: 1 gün = **2 gün** | Geçici m.6/4 |
| **Güncel** | Yalnızca 15 yaş altı: 1 gün = **2 gün**. 15-18 yaş için ayrı indirim **yok** | m.107/5 (7593 ile değişik) |

Formdaki **suç tarihi** alanı bu iki daldan birini seçmeli.

> **v1 kapsamı değişmiyor.** Çocuk hükümlü (SSÇ) § 1.1b'de v1 dışında
> bırakılmıştı; bu bulgu o kararı değiştirmiyor, **v2 için kaydediliyor.**
> Ama araç v1'de SSÇ'yi hesaplamadığına göre, kapsam notundaki "çocuk
> hükümlüler bu sürümde kapsam dışıdır" cümlesi daha da gerekli hâle
> geldi: iki ayrı rejim var ve ikisi de basit değil.

#### c) m.108 — ikinci tekerrürde KS yasağı KALKMIŞ

7550 sayılı Kanun (2025) ile değişmiş: ikinci defa tekerrürde koşullu
salıverilme artık **tamamen yasak değil**; süreli hapiste oran **3/4'e
çıkarılarak** uygulanıyor.

Bu, 1.4 tablosundaki "İkinci defa mükerrir → 3/4" satırını **doğruluyor**
ve 1.12'deki "ikinci tekerrürde 3/4 bir tarih penceresiyle sınırlı mı"
sorusunu da cevapsız bırakmıyor: sınır tarih penceresi değil, kanun
değişikliğinin kendisi. *(Bir ikincil kaynak 01.06.2024 – 04.06.2025
aralığı iddia ediyordu; resmî metinde böyle bir pencere yok.)*

### 1.15. Çekirdek fikstür — KARARA BAĞLANDI (23 Eylül 2026)

1.15'in ilk hâlinde üç açık soru vardı. Üçü de cevaplandı.

#### Karar 1 — Mahsup sırası: **A okuması**

> **Mahsup sırası: A okuması.** TCK m. 63'ün lafzına dayanır —
> *"hükmolunan hapis cezasından indirilir"*. Mahsup, koşullu salıverilme
> oranı uygulanmadan **önce** hükmolunan/ham cezadan düşülür; sonra kalan
> cezaya oran uygulanır.

> ⚠️ **YAYINDAN ÖNCE GÖZDEN GEÇİRİLECEK.** Bu noktada tek bir pratisyen
> sitesinin (`tahanci.av.tr`) örneği **ters yönde** hesap yapıyordu
> (B okuması: önce oran, sonra mahsup). Çelişki web araştırmasıyla tam
> çözülemedi; `barandogan.av.tr` yalnızca madde metnini tekrarlıyor,
> somut örnek veya içtihat içermiyor. **Av. Onur Can Yılmaz'ın kendi
> infaz dosyası tecrübesinden bu sırayı teyit etmesi önerilir.**
>
> Fark küçük değil: 18 yıllık cezada 80 güne kadar çıkıyor.

#### Karar 2 — Oran **yıl-ay-gün seviyesinde** uygulanır

Ceza güne çevrilip oranlanmıyor; oran yıl-ay-gün biriminde uygulanıp
sonuç güne çevriliyor.

```
1. ceza ve mahsup → ay cinsinden kesir   (1 yıl = 12 ay, 1 ay = 30 gün)
2. kalan = ceza − mahsup
3. infaz süresi = kalan × oran           ← oran BURADA uygulanır
4. sonucu yıl-ay-gün olarak ayrıştır
5. güne çevir                            (1 yıl = 365, 1 ay = 30 gün)
```

Örnek: 5 yıl × 1/2 = **2 yıl 6 ay** = 910 gün. *(Önce güne çevirseydik
1825 ÷ 2 = 912,5 gün çıkıyordu — hem 2,5 gün fark hem yarım gün
küsuratı.)* Müddetname uygulaması yıl-ay-gün birimiyle çalıştığı için
bu yöntem seçildi ve küsurat sorunu gerçekten ortadan kalktı.

> ℹ️ **İki dönüşüm birbirine denk değil** — bilinçli kabul. Konvansiyon
> kendi içinde tutarsız (12 × 30 = 360 ≠ 365), dolayısıyla "önce oranla
> sonra güne çevir" ile "önce güne çevir sonra oranla" aynı sonucu
> vermiyor. 3. senaryoda fark 5 gün. Seçilen yol ilki.

#### Karar 3 — 6b senaryosu eklendi

6. senaryo m.108/2 tavanını sınamıyordu (ekleme 1 yıl, tavan 2 yıl →
sınır devreye girmiyor). **6. senaryo olduğu gibi kaldı**, yanına önceki
ilamı **6 ay** olan **6b** eklendi; orada tavan gerçekten devreye
giriyor ve infaz süresini 4 yıldan 3 yıl 6 aya indiriyor.

#### 4 ve 5 numaralı yuvalar — YENİDEN DOLDURULDU

Eski 4 ve 5, TCK 188 senaryolarıydı ve oranı açık olduğu için
çıkarılmıştı (1.13/4). Yuvalar boş kalmasın diye, o senaryoların
sınadığı dalları **oranı tartışmasız suçlarla** yeniden kurdum:

| Yuva | Eski | Yeni | Sınadığı dal |
|---|---|---|---|
| 4 | Uyuşturucu + DS hâl C | **Adi suç, 12 yıl, hâl C** | Geçici m.10/6'nın DS kaydırması (4 yıl) |
| 5 | Uyuşturucu, tarih ayrımı | **Adi suç, 1 yıl 2 ay, suç 04.06.2025 sonrası** | 1/10 + 5 gün şartı **ve** DS'nin infaza başlamadan önceye düşememesi |

5. senaryo iki şeyi birden sınıyor: standart DS hesabı negatife düşüyor
(210 − 365 < 0), alt sınır devreye giriyor, sonra 1/10 şartı tarihi 21
gün ileri itiyor.

> 🔴 **4 ve 5 İKİ AYRI KANUNİ DAYANAĞI SINIYOR — birleştirilmesin.**
>
> İkisi de "hükümlü şu kadar süre kurumda kalmış olmalı" diyor ama
> **farklı maddelerden gelen, farklı işleyen iki ayrı kuraldır.**
>
> | | 4. senaryo | 5. senaryo |
> |---|---|---|
> | Dayanak | **Geçici m.10/6** | **m. 105/A** |
> | Şart | **3 ay açık** ceza infaz kurumunda kalmış olmak | İnfaz süresinin **1/10'u** ve **en az 5 gün** kurumda geçmiş olmak |
> | Kapsam | Yalnızca 31.07.2023 ve öncesi suçlar | 04.06.2025 sonrası suçlarda **genel** kural |
> | İşleyişi | **KAPI** — sağlanmazsa 3 yıllık erken kaydırma hiç uygulanmaz | **TABAN** — tarihi ileri iter |
> | Kullanıcıdan | Onay kutusuyla sorulur (vakıa) | Sorulmaz, hesaplanır |
>
> Biri kapı, diğeri taban. Tek bir "asgari kurumda kalma" fonksiyonuna
> sıkıştırılırsa ikisinin farklı davranışı kaybolur ve biri diğerini
> sessizce ezer. **Kodda ayrı ayrı kontrol edilecekler.**

#### Hesaplanan fikstür — yedi senaryo

Hepsi A okuması + yıl-ay-gün oranıyla hesaplandı.

| # | Senaryo | İnfaza başlama | İnfaz süresi | **KS** | **DS** | **Bihakkın** |
|---|---|---|---|---|---|---|
| 1 | Adi suç, 5 yıl | 01.03.2026 | 2 yıl 6 ay · 910 g | **27.08.2028** | **28.08.2027** | **28.02.2031** |
| 2 | Adi suç, 5 yıl, 90 g mahsup | 01.03.2026 | 2 yıl 4 ay 15 g · 865 g | **13.07.2028** | **14.07.2027** | **25.11.2030** |
| 3 | Kasten öldürme, 18 yıl, 240 g mahsup | 20.01.2026 | 11 yıl 6 ay 20 g · 4215 g | **05.08.2037** | **05.08.2036** | **16.05.2043** |
| 4 | Adi suç, 12 yıl, **hâl C** (DS 4 yıl) | 01.02.2026 | 6 yıl · 2190 g | **31.01.2032** | **01.02.2028** | **29.01.2038** |
| 5 | Adi suç, 1 yıl 2 ay, **1/10 şartı** | 01.03.2026 | 7 ay · 210 g | **27.09.2026** | **22.03.2026** | **30.04.2027** |
| 6 | Hırsızlık, 6 yıl, mükerrir, önceki ilam **2 yıl** | 10.05.2026 | 4 yıl · 1460 g | **09.05.2030** | **09.05.2029** | **08.05.2032** |
| 6b | Aynısı, önceki ilam **6 ay** | 10.05.2026 | 3 yıl 6 ay · 1275 g | **05.11.2029** | **05.11.2028** | **08.05.2032** |

**Ara adımlar — 2, 3 ve 6b için:**

| | 2 | 3 | 6b |
|---|---|---|---|
| Hükmolunan ceza | 5 yıl | 18 yıl | 6 yıl |
| Mahsup | −90 gün | −240 gün | yok |
| Kalan ceza | 4 yıl 9 ay | 17 yıl 4 ay | 6 yıl |
| Oran | 1/2 | 2/3 | 2/3 |
| Mükerrirsiz taban | — | — | 3 yıl |
| Tekerrür eklemesi | — | — | 1 yıl |
| m.108/2 tavanı | — | — | 6 ay → **sınırlandı** |
| İnfaz süresi | 2 yıl 4 ay 15 gün | 11 yıl 6 ay 20 gün | 3 yıl 6 ay |

> 6 ve 6b'nin **bihakkın tarihi aynı** (08.05.2032) — doğru. Tekerrür
> koşullu salıverilmeyi etkiliyor, cezanın kendisini değil.

#### Sonuç ekranı — ara adımlar gösterilecek

> ✅ **KARAR:** Sonuç ekranı yalnızca üç tarihi değil, **hesabın ara
> adımlarını da ayrı satırlar hâlinde** gösterecek:
>
> `hükmolunan ceza → mahsup → kalan ceza → uygulanan oran →`
> `[mükerrirse: taban, ekleme, m.108/2 tavanı] → infaz süresi → tarihler`
>
> **Gerekçe iki katlı.** Birincisi şeffaflık: kullanıcı ve avukatı
> hesabı çapraz kontrol edebilir. İkincisi ve daha önemlisi:
> **A/B kararının yanlış çıkması ihtimaline karşı en büyük güvenlik
> önlemi bu.** Ara adımlar görünürse, mahsubun nerede düşüldüğü
> ekrandan okunur; yalnızca nihai tarih gösterilseydi yanlış sıra
> sessizce yanlış tarih üretirdi ve kimse fark etmezdi.
>
> Bu, `ResultSheet`'in zaten taşıdığı "tek büyük sayı değil, adım adım
> döküm" tasarımıyla örtüşüyor — bileşen bu araç için de kullanılabilir.

### 1.16. Kodlandı — 23 Eylül 2026

Fikstür onaylandıktan sonra yazıldı. **25 test geçiyor.**

| Dosya | İçerik |
|---|---|
| `src/lib/infaz-sure.ts` | Süre aritmetiği. İki konvansiyonu tek yerde tutuyor: oran uygulanırken 1 yıl = 12 ay × 30 gün, takvime çevrilirken 1 yıl = 365 gün |
| `src/lib/infaz-oranlari.ts` | Oran tablosu, katalog listesi, terör için ayrı 3713 dalı, çakışmada yüksek oran |
| `src/lib/infaz.ts` | `ksEsigi` · `bihakkinTahliye` · `denetimliSerbestlik` · `acigaAyrilma` |
| `src/lib/infaz.test.ts` | Yedi çekirdek senaryo + kenar durumlar |
| `src/pages/hesaplama-araclari/infaz-hesaplama.astro` | Ara adımlı sonuç ekranı, TCK 188 uyarı kutusu |

#### Kodlama sırasında yakalanan hata

> 🔴 **Eşik kuralı sabit indirime dönüşmüştü.** `acigaAyrilma`nın ilk
> hâli "şartlar ileride ne zaman oluşur" sorusunu cevaplıyordu; bu,
> normal tarihine beş yıl kalan bir hükümlüyü de üç yıl erkene alıyordu
> — yani § 1.13/1'de düzelttiğimiz hatanın kodda yeniden doğması. Test
> yakaladı.
>
> **Düzeltme:** fonksiyona **zorunlu** bir `degerlendirmeTarihi`
> parametresi eklendi. Madde bir anda fotoğraf çekiyor; o an eşiğin
> içindekileri alıyor, dışındakilere hiç dokunmuyor. Parametrenin
> varsayılanı yok — varsayılan verilirse hata sessizce geri döner.
>
> Bir test ayrımı kalıcı olarak sabitliyor: aynı hükümlü, iki farklı
> değerlendirme anı, iki farklı sonuç.

#### `acigaAyrilma` — kod hazır, arayüzde YOK

> `acigaAyrilma` fonksiyonu mevcut ve test edilmiş (bkz. `src/lib`),
> ancak v1 sonuç ekranında gösterilmiyor — kapsam dışı bırakıldı,
> kullanıcının asıl aradığı KS/DS/bihakkın bilgileri öne çıkarılıyor.
> İleride bir iterasyonda eklenebilir, kod hazır.

Karar 23.09.2026'da verildi ve § 1.1b'deki kapsam kararıyla tutarlı.

- **Onay Durumu:** ✅ **Kodlandı ve onaylandı — 23 Eylül 2026.**
  Yayına alınması, bölüm başındaki **iki yayın engelinin** kapanmasına
  bağlı.

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
| Birinci günlük kira bedeli | `bedel-1` | TL | > 0, **isteğe bağlı** |
| İkinci günlük kira bedeli | `bedel-2` | TL | > 0, **isteğe bağlı** |

**İki bedel alanından en az biri dolu olmalıdır; ikisi birden zorunlu
değildir** (21 Eylül 2026 kararı, bkz. 5.5b). Gün sayısı her hâlde zorunlu.

Bedel alanlarının ipucu metinleri kaynağı gösterir ("Enterprise'dan
aldığınız teklif" / "Garenta'dan aldığınız teklif"), böylece cetvel
satırları marka adı taşımak zorunda kalmaz.

Üst sınır olarak 3650 gün (10 yıl) konuyor: makul onarım süresi tartışması
ayrı, ama on yılı aşan bir girdi kullanıcı hatasıdır ve sessizce devasa
bir rakam üretmesindense reddedilmesi doğru.

### 5.5b. Tek teklifle hesap — 21 Eylül 2026 kararı

Aracın ilk sürümü iki teklifi de zorunlu tutuyordu. Av. Onur Can Yılmaz
bunu gevşetti:

| Durum | Davranış |
|---|---|
| İki alan da dolu | Değişmedi: alt–üst aralığı ve ortalama |
| **Tek alan dolu** | `gün × bedel` ile **tek tutar** (aralık YOK) + ikinci teklif önerisi |
| İki alan da boş | Hesap yapılmaz, cetvel boş durumda kalır |

**Gerekçe:** ikinci teklifi almak için siteden ayrılan kullanıcı çoğu
zaman geri dönmüyor. Elindeki tek rakamla da bir tahmin alabilmeli.

**Boş alan ile yazılmış sıfır ayrımı.** Boş alan "teklif vermedim"
demektir ve listeye hiç girmez. Kullanıcının yazdığı `0` ise hatalı bir
tekliftir; sessizce atılmaz, `gecersiz-bedel` ile reddedilir — aksi hâlde
kullanıcı yanlış girdiğini hiç öğrenemez.

Bu ayrım `teklifleriTopla()` fonksiyonunda, yani `src/lib/` altında
yapılıyor. Betiğin içinde bırakılsaydı test edilemezdi; böylece "yalnızca
ikinci alan dolu" gibi hâller Vitest ile doğrulanıyor.

**Formda gösterim.** Alanların altına tek satırlık bir açıklama kondu:

> İki alandan en az birini doldurmanız yeterlidir. İkisini de
> doldurursanız sonuç bir aralık olarak gösterilir.

*Bu cümle 5.4'teki onaylı metinlerden değildir, davranış değişikliğinin
gerektirdiği arayüz açıklamasıdır — kullanıcı bunu görmezse tek teklifi
varken hesabı hiç denemez. Değiştirilmesi serbesttir.*

### 5.6. Hesap

Girdi: `gun` (tam sayı), `gunlukBedeller` (**en az bir** pozitif sayı).

```
tutar[i] = gun × bedel[i]
alt      = min(tutar)
üst      = max(tutar)
ortalama = tutarların aritmetik ortalaması
```

Tek teklifte üçü de aynı değere iner. Çağıran taraf bu durumda **aralık
göstermemeli**, `tutarlar.length`e bakmalıdır — tip tanımında da böyle
yazıyor.

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
veya 3650'den büyük), `gecersiz-bedel` (sıfır, negatif, sayı değil veya
tavanı aşıyor), `yetersiz-teklif` (hiç teklif yok). Her biri ayrı bir
hata mesajı alır; § 6'daki gibi tahmin yürütülmez.

### 5.7. Sonuç ekranı

Cetvel (`ResultSheet`) girilen teklif sayısına göre iki biçimden birini
alır.

**İki teklif:**

| Satır | Değer | Dayanak |
|---|---|---|
| Birinci teklife göre | `tutar₁` (`N gün × X TL`) | Y. 4. HD |
| İkinci teklife göre | `tutar₂` (`N gün × Y TL`) | — |
| Tahmini aralık | `alt – üst` | TBK m. 50/2 |
| **Ortalama tahmin** | `ortalama` | TBK m. 49 |

**Tek teklif:**

| Satır | Değer | Dayanak |
|---|---|---|
| Günlük kira bedeli | girilen teklif | Y. 4. HD |
| Mahrumiyet süresi | `N gün` | TBK m. 50/2 |
| **Mahrumiyet bedeli tahmini** | `tutar` (`N gün × X TL`) | TBK m. 49 |

Tek teklifli dal neden üç satır: aynı sayıyı "tek kalem" ve "toplam" diye
iki kez yazmamak için hesap adımlarına ayrıldı. Yan faydası, üç dayanağın
da ekranda kalması.

**Dayanak eşlemesi** iki dalda da aynı mantıkla kuruldu:

| Dayanak | Neyi karşılıyor |
|---|---|
| Yargıtay 4. HD | **Yöntem** — emsal günlük kira bedeli esas alınır, fiili kiralama belgesi aranmaz |
| TBK m. 50/2 | **Takdir** — zarar tam ispat edilemediği için aralık/süre hâkimin takdirine açık |
| TBK m. 49 | **Talep** — sonucun hukuki dayanağı |

*İlk sürümde m. 49 aralığa, m. 50/2 ortalamaya bağlıydı; 21 Eylül'de
yer değiştirdiler. Aralığın var olma sebebi zaten tutarın tam olarak
ispat edilememesi, yani doğrudan m. 50/2.*

**Tek teklifte ek olarak** (metin birebir, Av. Onur Can Yılmaz):

> Daha isabetli bir aralık için ikinci siteden de bir teklif almanızı
> öneririz.

Bu bir uyarı değil öneri olduğu için hata kutusundan görsel olarak
ayrıldı: çerçeve yok, yalnızca kenar çizgisi.

Cetvelin altında **iki teknik not** (birebir):

> Bu tutardan, aracınızı kullanmadığınız için tasarruf ettiğiniz
> yakıt/bakım gideri düşülebilir; gerçek tazminat bu rakamdan az
> çıkabilir.

> Girdiğiniz gün sayısı, bilirkişi tarafından "makul onarım süresi"ne
> indirilebilir; hesaplanan tutar fiili gün sayısına değil, mahkemenin
> kabul edeceği süreye göre değişebilir.

Ardından kabuğun bastığı sabit bloklar: mevzuat tarihi → kapsam notu
(5.4/c) → zorunlu uyarı (5.4/d).

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

**Sonraki değişiklik.** Aynı gün, araç yayına alındıktan sonra hesap
mantığı gevşetildi: iki teklif yerine **en az bir teklif** yeterli
(5.5b). Vitest'e tek teklifli iki senaryo ve alan okuma testleri eklendi.

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

> **Durum: TASLAK — ONAY BEKLİYOR.** Kod yazılmadı. Ön araştırma iki
> önemli hatayı ortaya çıkardı ve aracın tasarımını değiştirdi; karar
> soruları 7.8'de.

### 7.1. Araştırmanın iki bulgusu

Bu iki madde aracın nasıl kurulacağını belirliyor, o yüzden en başta:

#### 🔴 Bulgu 1: Limited şirket kuruluşu ticaret sicili harcından MUAF

**492 sayılı Harçlar Kanunu m. 123** (5281 s.K. ile eklenen fıkra):

> Anonim, eshamlı komandit, limited şirket ve kooperatiflerin kuruluş,
> pay devri, sermaye artırımı, birleşme, devir, bölünme ve nev'i
> değişiklikleri nedeniyle yapılacak işlemler ... bu Kanunda yazılı
> harçlardan ... müstesnadır.

2026 tarifesinde "ticari işletmenin ve unvanının tescil ve ilanı —
sermaye şirketlerinde" kalemi **35.354,50 TL** görünüyor (98 Seri No'lu
Harçlar Kanunu Genel Tebliği, RG 31.12.2025/33124 — § 6'daki yargı
harçlarıyla aynı tebliğ). Bu rakam tarifede var ama **şirket kuruluşunda
tahsil edilmiyor**; m. 123 istisnası devrede.

Bu, senin özetindeki kalem listesinde neden büyük bir harç kalemi
olmadığını da açıklıyor — liste bu yönüyle doğruymuş. Ama araç "ticaret
sicili harcı" diye bir satır koysaydı, en büyük kalemi uydurmuş olurduk.

#### 🔴 Bulgu 2: Şirket sözleşmesi 2018'den beri noterde onaylanmıyor

**7099 sayılı Kanun** (RG 10.03.2018) TTK m. 575'i değiştirdi. Şirket
sözleşmesi artık **ticaret sicili müdürlüğünde**, yetkilendirilmiş
personel huzurunda imzalanıyor; noter onayı şartı kalktı. İmza
beyannamesi ve defter tasdiki de sicil müdürlüğüne taşındı.

Dolayısıyla özetindeki **"noter masrafları ~4.000-6.500 TL"** kalemi
bugünkü mevzuatta karşılıksız. Noter yalnızca kurucular süreci bir
vekile yürüttürecekse (vekâletname) devreye giriyor — yani isteğe bağlı
bir kalem, zorunlu değil.

### 7.2. Asgari sermaye — dayanak DÜZELTİLDİ

Özette "7511 sayılı Kanun'la TTK'ya eklenen hüküm" yazıyordu. Doğrusu:

| | Tutar | Dayanak |
|---|---|---|
| Limited şirket | **50.000 TL** | **7887 sayılı Cumhurbaşkanı Kararı**, RG 25.11.2023 / 32380 — yürürlük **01.01.2024** |
| Anonim şirket | 250.000 TL | aynı Karar |
| Kayıtlı sermaye sistemli (halka açık olmayan) AŞ | 500.000 TL | aynı Karar |

Karar, TTK m. 332 ve m. 580'in metnini değiştirmiyor; bu maddelerin
Cumhurbaşkanına tanıdığı **artırma yetkisini** kullanıyor.

**7511 sayılı Kanun ayrı bir düzenleme.** TTK'ya **geçici m. 15** ekledi:
01.01.2024'ten önce kurulmuş ve sermayesi bu tutarların altında kalan
şirketler **31.12.2026**'ya kadar uyum sağlamazsa infisah etmiş
sayılacak (Ticaret Bakanlığı bu süreyi birer yıllık iki dönem uzatabilir).

> ⚠️ **Bu tarih bu yıl doluyor.** Kuruluş maliyeti aracının kapsamı
> dışında ama Ticaret & Şirketler Hukuku sayfasına veya bir blog
> yazısına konu olabilir — mevcut şirketleri doğrudan ilgilendiriyor.
> Ayrı bir iş olarak not ediyorum, bu araçla karıştırmıyorum.

### 7.3. Rekabet Kurumu payı — DOĞRULANDI

**4054 sayılı Rekabetin Korunması Hakkında Kanun m. 39/1-(c)** (bent,
5234 s.K. m. 29 ile eklenmiş), konsolide metinden birebir:

> Yeni kurulacak olan anonim ve limited şirket statüsündeki tüm
> ortaklıkların sermayelerinin ve sermaye artırımı halinde artan kısmın
> **on binde dördü** nispetinde yapılacak ödemeler

Oran **on binde dört** = **0,0004** = **%0,04**.

Usul ve esaslar: **4054 Sayılı Kanun Uyarınca Anonim ve Limited
Şirketlerin Yapacakları Ödemelere İlişkin Tebliğ (2017/4)**. Tebliğ
uyarınca **1 Ocak 2018'den itibaren** bu ödeme Rekabet Kurumu'na değil,
Ticaret Bakanlığı – Rekabet Kurumu – TOBB arasındaki protokol gereği
**kayıt olunan ticaret ve sanayi odasına** yapılıyor. Yani kullanıcı
açısından ayrı bir ödeme kalemi değil, oda veznesinde tahsil edilen bir
tutar.

> ⚠️ **10 kat çelişki — kayda geçti.** İncelenen ticaret odası
> sayfalarından biri bu payı **"binde 4"** olarak yazıyor. Kanun metni
> "on binde dördü" diyor ve Av. Onur Can Yılmaz da on binde dördü teyit
> etti. **Kanun metni esas.** 50.000 TL sermayede pay **20,00 TL**'dir;
> binde dört okunsaydı 200,00 TL çıkardı.

Bu kalem harç değil, Rekabet Kurumu'nun geliri — 492 m. 123 istisnası
buna işlemez, kuruluşta ödenir.

> 📌 **İzlenecek:** Rekabet Kurumu'nun sitesinde 2017/4 sayılı Tebliğ'in
> bir **değişiklik metni** görünüyor (2024 tarihli dosya). İçeriğine
> ulaşılamadı. Oran kanunda yazılı olduğu için değişiklik oranı
> etkilemez, ancak tahsil usulünü etkilemiş olabilir. Araç oranı
> kanundan aldığı için risk düşük.

### 7.4. Kalem listesi — Ankara (ATO), 2026

**A seçeneği onaylandı.** Rakamlar Av. Onur Can Yılmaz tarafından
verildi (kaynak: `atonet.org.tr` 2026 Yılı Kayıt Ücreti Tarifesi ve
ticaret sicili tarifeleri).

| # | Kalem | 2026 tutarı | Dayanak |
|---|---|---|---|
| — | Ticaret sicili tescil harcı | **0,00 — alınmıyor** | 492 s.K. m. 123 (tam istisna) |
| 1 | Oda kayıt ücreti | 3.900,00 TL | ATO 2026 tarifesi |
| 2 | Beyanname ücreti | 250,00 TL | ATO 2026 tarifesi |
| 3 | Defter tasdik + kuruluş tasdik ücreti | 2.500,00 TL | ATO 2026 tarifesi |
| 4 | TTSG ilan ücreti | **kelime × 2,48 TL** | TTSG ilan tarifesi |
| 5 | Rekabet Kurumu payı | **sermaye × 0,0004** | 4054 m. 39/1-(c), Tebliğ 2017/4 |

Sabit kısım (1+2+3) = **6.650,00 TL**. Değişken kısım kelime sayısı ve
sermayeden geliyor.

**Tescil harcı satırı cetvelde GÖRÜNECEK**, değeri 0,00 TL ve bilgi
satırı olarak (toplama katılmaz). Gerekçesi: bu kalem piyasadaki
listelerde en büyük rakam olarak dolaşıyor (2026 tarifesinde 35.354,50
TL). Satırı hiç göstermezsek kullanıcı "harcı unutmuşlar" diye
düşünür; 0,00 gösterip dayanağını yazarsak istisnayı öğretmiş oluruz.
§ 6'daki "Peşin harç alınmaz" satırıyla aynı yaklaşım.

### 7.5. Kapsam — v1

**VAR:** Limited şirket · nakdi sermaye · yeni kuruluş · **Ankara
Ticaret Odası** tarifesi.

**YOK:**

| Kapsam dışı | Neden |
|---|---|
| ~~Anonim şirket~~ | **21 Eylül 2026'da KAPSAMA ALINDI** — bkz. 7.12 |
| **Başka şehir / başka oda** | Oda kayıt ücreti ve tasdik bedelleri odaya göre değişiyor; kapsam notuyla söylenecek |
| **Mali müşavir ücreti** | Serbestçe belirleniyor. Toplama KATILMAZ, ayrı bilgi notu (7.7) |
| **Noter masrafı** | Zorunlu değil; ana sözleşme sicil müdürlüğünde ücretsiz imzalanıyor. Ayrı bilgi notu (7.7) |
| **e-imza / mali mühür** | Piyasa fiyatı, resmî tarife yok. Kapsam notunda anılacak |
| Ayni sermaye | Değerleme raporu ve mahkeme süreci gerektirir |
| Sermaye artırımı, şube, tür değiştirme | Ayrı işlemler |

**Limited şirkette sermayenin kuruluşta ödenmesi şartı yoktur** (7099
s.K.); sermaye tescilden sonra yirmi dört ay içinde ödenebilir. Anonim
şirkette 1/4 peşin ödeme şartı sürüyor — AŞ'nin ertelenme sebeplerinden
biri.

### 7.6. Hesap

Girdi: `yil`, `sermaye` (TL), `kelimeSayisi`.

```
oda        = tarife.odaKayit + tarife.beyanname + tarife.tasdik
ttsg       = kelimeSayisi × tarife.ttsgKelime
rekabet    = sermaye × 0,0004
toplam     = oda + ttsg + rekabet
```

**Kuruş tabanlı tam sayı aritmetiği** — § 3-§ 6 ile aynı:

```
sermayeKurus = round(sermaye × 100)
rekabetKurus = round(sermayeKurus × 4 / 10.000)
ttsgKurus    = round(tarife.ttsgKelime × 100) × kelimeSayisi   // 248 × kelime
```

Oran kanunda bir kesir (4/10.000) olduğu için doğrudan ondalıkla
çarpmak yerine tam sayı bölmesi kullanılıyor: 50.000 TL → 5.000.000
kuruş × 4 = 20.000.000 / 10.000 = **2.000 kuruş = 20,00 TL**.

**Doğrulama kuralları:**

| Durum | Koşul |
|---|---|
| `gecersiz-sermaye` | Sayı değil, **50.000 TL'den az**, veya tavanı aşıyor |
| `gecersiz-kelime` | Tam sayı değil, 1'den küçük, veya tavanı aşıyor |
| `tarife-yok` | O yılın tarifesi tabloya işlenmemiş |

Asgari sermaye sınırının altında **hesap yapılmaz** — sonuç verip
"ama bu sermaye ile şirket kurulamaz" demek yerine, baştan reddedip
sebebini söylüyoruz (7887 s. Karar). Diğer araçlardaki "bilinmeyen için
tahmin yürütme" ilkesinin bu araçtaki karşılığı.

Tavanlar taşma koruması: sermaye 1.000.000.000 TL, kelime 100.000.

### 7.7. Sonuç ekranı

Hesap cetveli satırları:

| Satır | Değer | Dayanak |
|---|---|---|
| Ticaret sicili tescil harcı | `0,00 ₺` *(bilgi satırı, toplama girmez)* | 492 m. 123 |
| Oda kayıt ücreti | `3.900,00 ₺` | ATO tarifesi |
| Beyanname ücreti | `250,00 ₺` | ATO tarifesi |
| Defter ve kuruluş tasdik ücreti | `2.500,00 ₺` | ATO tarifesi |
| Ticaret Sicili Gazetesi ilan ücreti | `kelime × 2,48 ₺` | TTSG tarifesi |
| Rekabet Kurumu payı | `sermaye × on binde 4` | 4054 m. 39/1-(c) |
| **Kuruluşta ödenecek toplam** | `toplam` | — |

**Üç bilgi notu** cetvelin altında. İlk ikisi birebir Av. Onur Can
Yılmaz'ın metni:

> Ayrıca genellikle bir mali müşavirle anlaşma yapılması gerekir, bu
> ücret serbestçe belirlenir ve yukarıdaki tutara dahil değildir.

> Ana sözleşme, noter yerine ücretsiz olarak Ticaret Sicili
> Müdürlüğü'nde de imzalanabilir. Noter tercih edilirse ek olarak
> yaklaşık 2.000-5.000 TL masraf oluşur.

Üçüncüsü benim, TTSG kaleminin niteliğini açıklıyor *(onayına tabi)*:

> Gazete ilan ücreti ana sözleşmenin kelime sayısına bağlıdır; kesin
> tutar sözleşme metni son hâlini aldığında belli olur.

**Kapsam notu** (`scopeNote`, üç paragraf):

> Bu araç limited şirket kuruluşunu ve Ankara Ticaret Odası tarifesini
> esas alır. Başka bir odaya kayıt olunacaksa oda kayıt ücreti ve
> tasdik bedelleri değişir.

> Kayıtlı sermaye sistemini kabul eden anonim şirketler (başlangıç
> sermayesi 500.000 TL) bu sürümün kapsamı dışındadır.

> Elektronik imza ve mali mühür bedelleri resmî bir tarifeye bağlı
> olmadığı için hesaba dahil edilmemiştir.

Zorunlu uyarı kabuktan geliyor, kapatılamıyor.

### 7.8. Bayatlama riski — yıl bazlı tablo

Beş kalemin dördü her yıl değişiyor (ATO tarifesi ve TTSG ilan ücreti).
Bu yüzden tarife § 6'daki gibi **yıl anahtarlı** tutulacak
(`src/lib/kurulus-tarifeleri.ts`) ve **tarifesi girilmemiş yıl için
hesap yapılmayacak.**

Değişmeyen tek şey oran: on binde dört kanunda yazılı, tarifeye bağlı
değil.

| Ne | Ne zaman değişir | Nereden |
|---|---|---|
| ATO kayıt/beyanname/tasdik | Her yıl başı | `atonet.org.tr` kayıt ücreti tarifesi |
| TTSG kelime ücreti | Her yıl başı | TTSG ilan tarifesi |
| Rekabet payı oranı | Kanun değişirse | 4054 m. 39 |
| Asgari sermaye | Cumhurbaşkanı Kararı ile | TTK m. 580 |

### 7.9. Test senaryoları

| # | Girdi | Beklenen |
|---|---|---|
| 1 | 50.000 TL sermaye, 1.500 kelime, 2026 | Oda 3.900 + beyan 250 + tasdik 2.500 + TTSG 3.720,00 + Rekabet 20,00 = **10.390,00 TL** |
| 2 | 250.000 TL sermaye, 2.000 kelime, 2026 | 6.650 + 4.960,00 + 100,00 = **11.710,00 TL** |
| 3 | 49.999 TL sermaye | `gecersiz-sermaye` — asgari sermaye sınırı |
| 4 | 50.000 TL, 0 kelime | `gecersiz-kelime` |
| 5 | 50.000 TL, 1.500 kelime, 2027 | `tarife-yok` |
| 6 | Tescil harcı satırı | Değeri 0,00, `bilgi: true`, toplama girmiyor |
| 7 | Kuruş kontrolü | 50.000 × 0,0004 tam **20,00**; kayan nokta artığı yok |

### 7.10. Kaynaklar

- **Asgari sermaye:** 7887 s. Cumhurbaşkanı Kararı, RG **25.11.2023 / 32380**, yürürlük 01.01.2024 *(iki bağımsız kaynak)*
- **Uyum süresi:** 7511 s.K. ile TTK **geçici m. 15** — son tarih **31.12.2026**
- **Rekabet payı oranı:** 4054 s.K. **m. 39/1-(c)** — [LEXPERA konsolide metin](https://www.lexpera.com.tr/mevzuat/kanunlar/rekabetin-korunmasi-hakkinda-kanun-4054) *(birebir alıntı alındı)*
- **Rekabet payı usulü:** **Tebliğ 2017/4** — "4054 Sayılı Kanun Uyarınca Anonim ve Limited Şirketlerin Yapacakları Ödemelere İlişkin Tebliğ"; 01.01.2018'den beri tahsilat odalar eliyle
- **Harç istisnası:** 492 s.K. **m. 123** *(iki kaynak; birebir metin görülemedi — Av. Onur Can Yılmaz uygulamadan teyit etti: kuruluşta hiç alınmıyor, tam istisna)*
- **Noterin zorunlu olmaması:** **Şirket Kuruluş Sözleşmesinin Ticaret Sicili Müdürlüklerinde İmzalanması Hakkında Tebliğ**, RG **06.12.2016 / 29910**; değişiklik RG **20.02.2021 / 31401**. Dayanağı 7099 s.K. ile değişik **TTK m. 575**
- **2026 ticaret sicili harç tarifesi:** 98 Seri No'lu Harçlar Kanunu Genel Tebliği, RG 31.12.2025 / 33124 (5. Mükerrer) — § 6 ile aynı tebliğ. *Tarifede sermaye şirketleri için 35.354,50 TL görünüyor; m. 123 nedeniyle kuruluşta uygulanmıyor*
- **ATO 2026 tarifesi ve TTSG kelime ücreti:** Av. Onur Can Yılmaz tarafından verildi, kaynak `atonet.org.tr`

### 7.11. Onay durumu — dört sorunun cevabı

Sorular 21 Eylül 2026'da soruldu ve aynı gün cevaplandı:

| # | Soru | Cevap |
|---|---|---|
| 1 | Beyanname ücreti kişi başına mı? | **Sabit.** ATO'nun kendi ifadesi kayıt başına okunuyor, kişi başına olduğuna dair kanıt yok. Formda yetkili sayısı alanı YOK |
| 2 | Kelime ipucundaki 1.500 rakamı | **Kullanılmayacak.** Av. Onur Can Yılmaz gerçek bir örnek sözleşmeyi inceledi: 4.000-4.500 kelimeye çıkan örnekler var. Tek bir düşük rakam yanıltıcı olur |
| 3 | TTSG bilgi notu (benim metnim) | Onaylandı, aynen |
| 4 | `lawAsOf` = 21 Eylül 2026 | Onaylandı |

**Kelime sayısı alanının ipucu** — birebir kullanılacak metin:

> Basit bir tek ortaklı sözleşme genellikle 1.500-2.500 kelime civarında
> olabilir, ancak amaç maddesindeki iş konusu sayısına göre bu belirgin
> şekilde artabilir. Sözleşmeniz hazırsa gerçek kelime sayısını yazın.

*Bir aralık verilmesinin sebebi: TTSG kalemi kelime sayısıyla doğrusal
arttığı için tek bir "tipik" rakam, sözleşmesi uzun olan kullanıcıya
gerçeğin yarısı kadar bir tutar gösterirdi. 4.000 kelimelik bir
sözleşmede bu kalem tek başına 9.920,00 TL ediyor.*

- **Onay Durumu:** ✅ **Onaylandı — 21 Eylül 2026**

### 7.12. Anonim şirket kapsama alındı — 21 Eylül 2026

Araç ilk sürümünde yalnızca limited şirket hesaplıyordu (7.5). Av. Onur
Can Yılmaz anonim şirketi de istedi. **Kalem listesi aynı kalıyor**;
değişen üç şey var.

#### Değişen: asgari sermaye

| Tür | Asgari esas sermaye | Dayanak |
|---|---|---|
| Limited | 50.000 TL | 7887 s. Cumhurbaşkanı Kararı |
| **Anonim** | **250.000 TL** | aynı Karar |
| ~~Kayıtlı sermayeli AŞ~~ | ~~500.000 TL~~ | **v2'ye ertelendi** |

**Kayıtlı sermaye sistemi bilinçli olarak dışarıda.** Nadir kullanılan
bir seçenek; forma üçüncü bir tür eklemek, kazandıracağı isabetten daha
fazla karmaşıklık getirirdi. Kapsam notunda açıkça söyleniyor, böylece
bu sistemdeki kullanıcı aracın kendisini kapsadığını sanmıyor.

#### Değişen: sermaye blokajı (yalnız AŞ)

**TTK m. 344/1:**

> Nakden taahhüt edilen payların itibarî değerlerinin en az yüzde
> yirmibeşi tescilden önce, gerisi de şirketin tescilini izleyen
> yirmidört ay içinde ödenir.

**TTK m. 345/1:** ödeme, 5411 sayılı Bankacılık Kanunu'na bağlı bir
bankada kurulmakta olan şirket adına açılan özel hesaba yatırılır; banka
bu tutarı ancak tüzel kişiliğin kazanıldığını bildiren sicil müdürlüğü
yazısı üzerine şirkete öder.

**Bu bir masraf DEĞİL** — tescilden sonra şirkete geçiyor. Bu yüzden
toplama girmiyor, kalem olarak da eklenmiyor; yalnızca bilgi notunda
tutarıyla gösteriliyor (aşağıda). Kalem olarak eklenseydi kullanıcı onu
cebinden çıkıp gidecek bir gider sanırdı.

**Limitedde bu şart YOK.** 7099 s.K. değişikliğinden sonra limited
şirkette sermaye tescilden sonra yirmi dört ay içinde ödenebiliyor,
kuruluşta blokaj aranmıyor. Not bu yüzden yalnızca AŞ seçildiğinde
görünüyor.

Not metni (birebir, Av. Onur Can Yılmaz — tutar araç tarafından
hesaplanıp cümlenin içine yerleştirilecek):

> Anonim şirkette, nakit olarak taahhüt edilen sermayenin en az %25'i
> tescilden önce bankada bloke edilmelidir. Bu bir masraf değildir,
> tescil sonrası serbest bırakılır; bu nedenle yukarıdaki toplama dahil
> edilmemiştir. **250.000 TL sermaye için bu tutar 62.500 TL'dir.**

#### Değişen: kelime sayısı ipucu

Limitedde kullanılan metnin sonuna bir cümle ekleniyor, yalnızca AŞ
seçiliyken görünüyor:

> Anonim şirket esas sözleşmesi genellikle limited şirket sözleşmesinden
> daha uzundur.

JS kapalıyken bu cümle de görünür kalır — doğru bir bilgi, gizlenmesi
şart değil. (Harç aracındaki `data-grup` deseninin aynısı.)

#### Değişmeyenler — teyit edildi

| Kalem | AŞ'de durum |
|---|---|
| **Ticaret sicili tescil harcı** | **Yine tam istisna.** 492 s.K. m. 123'ün lafzı zaten *"**Anonim**, eshamlı komandit, limited şirket ve kooperatiflerin kuruluş... işlemleri"* diyor — anonim listenin ilk sırasında. (7099 s.K. bu fıkrayı kooperatifleri ekleyecek şekilde değiştirmiş; anonim baştan beri kapsamda.) |
| Oda kayıt + beyanname | 3.900 + 250 = 4.150 TL, aynı |
| Defter ve kuruluş tasdik | 2.500 TL — kaynak tarifesinde zaten "AŞ-LTD-KOOP" ortak |
| TTSG ilan ücreti | Kelime × 2,48 TL, aynı mantık |
| Rekabet Kurumu payı | Sermaye × on binde dört. 4054 m. 39/1-(c) zaten "anonim ve limited şirket statüsündeki tüm ortaklıklar" diyor. Sermaye farklı olduğu için tutar kendiliğinden değişiyor |
| Noter | Aynı — tebliğ her iki türü de kapsıyor; ücretsiz sicilde imzalanabiliyor |
| Mali müşavir | Aynı — toplama girmiyor, ayrı not |

#### Ek test senaryoları

| # | Girdi | Beklenen |
|---|---|---|
| 8 | **AŞ**, 250.000 TL, 2.500 kelime, 2026 | 6.650 + TTSG 6.200,00 + Rekabet 100,00 = **12.950,00 TL**; blokaj **62.500,00 TL** ayrı |
| 9 | AŞ, 249.999 TL | `gecersiz-sermaye`, asgari **250.000** |
| 10 | Limited, 50.000 TL | Kabul — limitedin sınırı AŞ'ninkinden etkilenmiyor |
| 11 | Limited sonuçta blokaj | `undefined` — not gösterilmiyor |
| 12 | Aynı sermaye ve kelimede iki tür | Toplamlar **eşit** — tür yalnızca asgari sınırı ve blokajı etkiliyor |

#### Ek kaynaklar

- **Sermaye blokajı:** TTK **m. 344/1** (yüzde yirmibeş) ve **m. 345/1** (banka hesabı, serbest bırakma)
- **Harç istisnasının AŞ'yi kapsaması:** 492 s.K. m. 123 lafzı; fıkra 7099 s.K. ile kooperatifleri kapsayacak şekilde genişletilmiş
- **Limitedde blokaj aranmaması:** 7099 s.K. ile değişik TTK hükümleri

#### Uygulandı

İki tasarım kararı onaylandı ve uygulandı:

- **Sermaye ipucu tek cümle:** *"Limited şirkette asgari 50.000 TL,
  anonim şirkette 250.000 TL."* Tür değiştikçe metin değiştirmek yerine
  iki sınırı birden yazmak daha az kırılgan. `min` niteliği düşük sınıra
  sabit, türe özgü kontrol hesap fonksiyonunda — form doğrulaması iş
  mantığı taşımıyor.
- **AŞ kelime notu `data-grup="anonim"` ile:** JS kapalıyken görünür
  kalıyor. Doğru bir bilgi, gizlenmesi şart değil (CLAUDE.md Bölüm 4/4).

Blokaj notu, hukuki bir zorunluluk bildirdiği için yanında **TTK m. 344**
dayanağıyla basılıyor; diğer iki notta böyle bir etiket yok çünkü onlar
bir yükümlülük değil, kapsam açıklaması.

- **Onay Durumu:** ✅ **Onaylandı ve yayında — 21 Eylül 2026**

## 8. Marka Tescil Süreç Takvimi

> **Durum: TASLAK — ONAY BEKLİYOR.** Kod yazılmadı. Bu araç diğer
> yedisinden farklı: TL hesabı değil, tarih hesabı. Ama "süreyi kaynağa
> dayandırma" disiplini aynı. Karar soruları 8.8'de.

### 8.1. Bu aracın dürüstlük sorunu

Diğer yedi araçta bir doğru cevap vardı: tarife, oran, kanun maddesi.
Burada **yok**. TÜRKPATENT'in işlem süreleri kurumun iş yüküne göre
değişiyor ve hiçbir mevzuatta yazmıyor.

Üç kaynağa baktım ve aşama süreleri **tutmuyor**:

| Aşama | Ön araştırma özeti | etkinpatent.com | ataylaravukatlik.av.tr |
|---|---|---|---|
| Başvuru + şekli inceleme | ~1-2 hafta – 2 ay | 2 – 4 ay *(esas ile birlikte)* | 1 – 2 ay |
| Esas (mutlak ret) incelemesi | 2 – 5 ay | *(yukarıya dahil)* | 1 – 2 ay |
| **Bültende yayım + itiraz** | **2 ay** | **2 ay — "kesin"** | **2 ay** |
| Tescil belgesi | 1-2 hafta – 1-2 ay | 1 ay | 1 – 2 ay |
| **İtirazsız toplam** | 4 ay – 1 yıl | 6 – 10 ay | 6 – 8 ay |
| **İtirazlı toplam** | 12 – 18 ay | 12 – 24 ay | 10 – 18 ay |

Senin okuman doğru: bu bir çelişki değil, **sürecin doğası**. Üç kaynağın
tek hemfikir olduğu satır, kanunda yazılı olan tek satır — 2 aylık itiraz
süresi.

**Tasarım sonucu:** araç tek bir tarih vaat etmeyecek. Her aşama için
aralık gösterecek, tek kesin süreyi kanun maddesiyle işaretleyecek ve
sonucun garanti olmadığını açıkça söyleyecek.

### 8.2. Kanuni dayanak — dördü de doğrulandı

| Aşama | Madde | Durum |
|---|---|---|
| Şekli inceleme ve eksikliklerin giderilmesi | **SMK m. 15** | ✅ |
| Mutlak ret nedenleri incelemesi ve Bültende yayım | **SMK m. 16** | ✅ |
| **Yayımdan itibaren iki ay içinde itiraz** | **SMK m. 18/1** | ✅ birebir alıntı |
| Markanın tescili ve sicile kaydı | **SMK m. 22** | ✅ |

**SMK m. 18/1** — aracın tek kesin süresi, birebir:

> Bültende yayımlanmış bir marka başvurusunun, 5 inci veya 6 ncı
> maddelere göre tescil edilmemesi gerektiğine ilişkin itirazlar ilgili
> kişiler tarafından marka başvurusunun yayımından itibaren **iki ay**
> içinde yapılır.

**SMK m. 16/1-2:**

> Kurum, başvurunun şeklî yönden eksikliği bulunmadığına karar verirse
> 5 inci madde kapsamında başvuruyu inceler. Başvuru şartları eksiksiz
> şekilde yerine getirilmiş ve 15 inci madde ile bu maddenin birinci
> fıkrası hükümlerine göre reddedilmemiş başvuru Bültende yayımlanır.

**SMK m. 22:**

> Başvurusu eksiksiz yapılmış veya eksiklikleri giderilmiş, 16 ncı madde
> uyarınca incelenmiş, yayımlanmış, hakkında itiraz yapılmamış veya
> yapılan itirazların tümü nihai olarak reddedilmiş ... bir başvuru
> tescil edilerek sicile kaydedilir ve Bültende yayımlanır.

6769 sayılı Kanun **RG 10.01.2017**'de yayımlanarak yürürlüğe girdi.

#### 🔴 Madde numarası netleştirildi — m. 18, m. 6 DEĞİL

Av. Onur Can Yılmaz'ın elindeki kaynak süreyi "m. 6" olarak gösteriyordu.
Şüphesi haklı çıktı: **m. 5 ve m. 6 süreyi değil, itirazın DAYANAĞINI
düzenliyor.**

| Madde | Başlığı | Ne düzenliyor |
|---|---|---|
| m. 5 | Marka tescilinde **mutlak** ret nedenleri | İtirazın sebebi |
| m. 6 | Marka tescilinde **nispi** ret nedenleri | İtirazın sebebi |
| **m. 18** | **Yayıma itiraz** | **SÜRE — yayımdan itibaren iki ay** |
| m. 20/2 | Karara itiraz | Ayrı bir iki aylık süre: Kurum kararına karşı, bildirimden itibaren |

Karışıklığın kaynağı m. 18/1'in kendi lafzı: cümlenin içinde "5 inci
veya 6 ncı maddelere göre" geçiyor, ama bu itirazın dayanağını
gösteriyor. Süreyi veren madde **m. 18**.

**Sonuç ekranında gösterilecek dayanak: SMK m. 18/1.**

> ⚠️ **m. 20/2 ile karıştırılmamalı.** O da iki ay ama farklı bir şey:
> Kurum kararına karşı itiraz (YİDK yolu). Bu aracın gösterdiği süre
> üçüncü kişilerin yayıma itirazı, yani m. 18.

#### Bir de bayat kaynak uyarısı

Araştırma sırasında bir kaynak yayım süresini **"üç ay"** olarak
veriyordu. Bu 556 sayılı KHK dönemine ait; SMK süreyi **iki aya**
indirdi. Kanun metni açık, tereddüt yok — ama bu araç için tek kesin
süreyi neden kanuna bağladığımızın iyi bir örneği.

### 8.3. İtirazlı senaryo — teyit edildi

Ön araştırmada tek kaynaklıydı, teyit istemiştin. İki bağımsız kaynaktan
daha doğrulandı:

| Kaynak | İtirazlı süre |
|---|---|
| Ön araştırma | 12 – 18 ay |
| ataylaravukatlik.av.tr | 10 – 18 ay |
| etkinpatent.com | 12 – 24 ay |

Üçü de "bir yılı aşar, iki yılı geçmez" diyor. **12-18 ay** üçünün
ortasında duruyor ve senin verdiğin rakam; aracın kullanacağı aralık bu.
Dış uçların (10 ve 24) farkı belgeye kaydedildi.

### 8.4. Kullanılacak aşama süreleri — ZARF YÖNTEMİ

Kaynaklardan birini seçip diğerlerini yok saymak, olmayan bir kesinlik
iddia etmek olurdu. Bunun yerine her aşamada **kaynakların en düşüğü ile
en yükseği** alınıyor:

| # | Aşama | Min | Max | Dayanak |
|---|---|---|---|---|
| 1 | Başvuru ve şekli inceleme | 2 hafta | 4 ay | SMK m. 15 |
| 2 | Mutlak ret nedenleri incelemesi | 1 ay | 5 ay | SMK m. 16/1 |
| 3 | **Bültende yayım ve itiraz süresi** | **2 ay** | **2 ay** | **SMK m. 18/1** |
| 4 | Tescil belgesi ve sicile kayıt | 2 hafta | 2 ay | SMK m. 22 |

**İtirazsız toplam: 4 ay – 13 ay.**

> ⚠️ **Toplam, tek tek kaynakların toplamından geniş.** Kaynaklar
> itirazsız süreci 6-10 ve 6-8 ay diyor; bizim zarfımız 4-13 ay veriyor.
> Sebebi: her aşamanın en kötü hâlini üst üste toplamak, hiçbir dosyada
> gerçekleşmeyecek kadar kötümser bir üst sınır üretir. Bunu bilerek
> kabul ediyorum — **dar ve yanlış bir aralık yerine geniş ve dürüst bir
> aralık.** Senin ön araştırmandaki "4 ay – 1 yıl" okuması da buraya çok
> yakın.

**İtirazlı dal:** başvuru tarihi + **12 – 18 ay** (8.3).

### 8.5. Tasarım

**Tek girdi: başvuru tarihi.** Başka hiçbir alan yok — senin talimatın.

**İki dal, ikisi de aynı anda görünür.** Sekme/açılır menü yok:

- *İtiraz gelmezse* — dört aşama, her biri kendi tarih aralığıyla
- *İtiraz gelirse* — tek satır, başvuru + 12-18 ay

**Tarihler kümülatif.** Her aşamanın gösterdiği tarih, o aşamanın
**tamamlanmış olacağı** tarih aralığı: min yol minleri toplayarak, max
yol maxları toplayarak ilerliyor.

**Ay ekleme kuralı.** 31 Ocak + 1 ay = 28/29 Şubat (ayın sonuna
kırpılır), 3 Mart değil. JavaScript'in `Date` davranışı kırpmıyor, taşma
yapıyor; bu yüzden elle kırpan bir yardımcı yazılacak. UTC tabanlı —
§ 4'teki gibi, yaz saati kaymasını önlemek için.

**Geçerlilik:** başvuru tarihi **10 Ocak 2017**'den (SMK'nın yürürlük
tarihi) önceyse hesap yapılmaz. Öncesi 556 sayılı KHK rejimine tabi ve
aşama yapısı farklı; sessizce yanlış takvim üretmektense reddetmek doğru.

**Sıfır JS ve düzen kayması.** CLAUDE.md Bölüm 4/2'deki "yükseklik
önceden rezerve edilir" disiplininin buradaki karşılığı: **aşama
iskeleti sunucuda basılacak** — aşama adları, süreleri, açıklamaları ve
dayanakları JS olmadan da görünecek. Betik yalnızca tarih alanlarını
dolduracak. Böylece hesaplama öncesi/sonrası sayfa yüksekliği
değişmiyor ve JS kapalı kullanıcı da süreci okuyabiliyor.

### 8.6. Sonuç ekranı

Zorunlu uyarı (senin metnin, birebir) — `scopeNote` olarak:

> Bu süreler TÜRKPATENT'in tipik işlem sürelerine dayanan tahminlerdir,
> kurumun güncel iş yüküne göre değişebilir, resmi bir garanti içermez.

Bunun üstüne kabuğun bastığı `CALCULATOR_DISCLAIMER` de geliyor;
kapatılamıyor.

Her aşama satırı kendi kanun maddesini taşıyor (8.4 tablosu). 2 aylık
itiraz süresi görsel olarak **ayrı işaretlenecek**: diğerleri tahmin, bu
kanunda yazılı.

### 8.7. Test senaryoları — hesaplanmış değerlerle

Taslakta bu tablodaki tarihler elle kestirilmişti ve **min yolu
yanlıştı**: 29 Ocak'a bir ay eklenince 28 Şubat oluyor (Şubat 28
çekiyor), kestirme bunu atlamıştı. Aşağıdaki değerler bağımsız bir
takvim hesabıyla üretildi ve testlere öyle yazıldı.

**Senaryo 1 — başvuru 15.01.2026:**

| Aşama | En erken | En geç |
|---|---|---|
| 1. Başvuru ve şekli inceleme | 29.01.2026 | 15.05.2026 |
| 2. Mutlak ret incelemesi | **28.02.2026** *(kırpma)* | 15.10.2026 |
| 3. Bültende yayım ve itiraz | 28.04.2026 | 15.12.2026 |
| 4. Tescil ve belge | **12.05.2026** | **15.02.2027** |

İtirazlı dal: 15.01.2027 – 15.07.2027.

**Diğer senaryolar:**

| # | Girdi | Beklenen |
|---|---|---|
| 2 | 31.01.2026 | Son aşama en geç **28.02.2027** — 31.12.2026 + 2 ay kırpılıyor |
| 3 | 29.02.2028 + 12 ay | **28.02.2029** — artık olmayan yıla kırpma |
| 3b | 31.08.2026 + 18 ay | **29.02.2028** — artık yıla kırpma |
| 3c | 31.08.2025 + 18 ay | **28.02.2027** |
| 5 | 09.01.2017 | `smk-oncesi` |
| 6 | 10.01.2017 | Kabul — tam sınır |
| 7 | Geçersiz tarih | `gecersiz-tarih` |
| 8 | Yayım aşaması | `kesin: true`, dayanak `SMK m.18/1`, iki yolda da tam iki ay |

Ayrıca yapısal testler: tarihler geriye gitmiyor, en erken ≤ en geç, saat
bilgisi sonucu kirletmiyor, girdi `Date` nesnesi değiştirilmiyor, her
aşamanın dayanağı var, yalnızca bir aşama `kesin`.

### 8.8. Onay durumu — üç sorunun cevabı

Sorular 21 Eylül 2026'da soruldu ve aynı gün cevaplandı:

| # | Soru | Cevap |
|---|---|---|
| 1 | Zarf yöntemi | ✅ **Onaylandı.** 4-13 aylık geniş aralık, dar ve yanlış bir aralığa tercih ediliyor |
| 2 | Aşama 1/2 ayrımı | ✅ **Onaylandı.** m. 15 (şekli) ve m. 16 (esas) gerçekten ayrı maddeler |
| 3 | `lawAsOf` = 21 Eylül 2026 | ✅ Onaylandı |

**Ek olarak istenen iki kontrol yapıldı:**

- **İtiraz süresinin madde numarası** → m. 18 (yukarıda, 8.2). Şüphe
  yerindeydi, kaynaktaki "m. 6" yanlıştı.
- **TÜRKPATENT hizmet standartları tablosu** → 8.9'a bakınız. Sayfa
  açıldı ama tablo alınamadı; zarf yöntemiyle devam ediliyor.

### 8.9. Kaynaklar

- **6769 sayılı Sınai Mülkiyet Kanunu** — RG **10.01.2017 / 29944**. m. 15, m. 16, **m. 18/1**, m. 22 *(m. 18/1 ve m. 16 birebir alındı; m. 22 tam metin)*
- **etkinpatent.com** — "Marka Tescil Rehberi 2026" *(ikincil)*
- **ataylaravukatlik.av.tr** — "Marka Tescil Başvurusu 2026" *(ikincil)*
- Ön araştırma özeti — Av. Onur Can Yılmaz

> **TÜRKPATENT hizmet standartları tablosu denendi — alınamadı.**
> Verdiğin adres (`turkpatent.gov.tr/hizmet-standartlari-tablosu`) bu
> sefer **açıldı** (önceki oturumlardaki sertifika hatası yoktu), ancak
> sayfada yalnızca menü başlığı göründü; tablo içeriği gelmedi —
> muhtemelen betikle yükleniyor. Arama üzerinden de tablonun satırlarına
> ulaşılamadı.
>
> Bu yüzden 8.4'teki zarf, ikincil kaynaklarla kuruldu. **Tabloyu ekran
> görüntüsü veya PDF olarak gönderebilirsen aşama süreleri doğrudan ona
> bağlanır** ve ikincil kaynaklar dayanak olmaktan çıkar. Tek dosya
> değişikliğiyle yapılır: `src/lib/marka-asamalari.ts`.

- **Onay Durumu:** ✅ **Onaylandı — 21 Eylül 2026**

---

**Genel kural:** Bir araç "Onaylandı" olmadan canlıya alınmaz. Onaylanan her aracın sonuç ekranında, bu belgedeki "Kanuni Dayanak" bilgisi kullanıcıya gösterilir.
