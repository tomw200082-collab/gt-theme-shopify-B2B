# RUNBOOK — GT Everyday B2B Landing (Horizon)

עדכון אחרון: 2026-06-11 · ענף: `claude/gt-b2b-landing-page-le88xh` · HEAD `831d5c3`

## ⏸️ נקודת עצירה (2026-06-11) — ממשיכים מהמחשב

**מה הושלם ועלה ל-theme + נדחף לענף:**
- עיצוב v3.1 + v4: Hero ייעודי (`sections/b2b-hero.liquid`), כרטיסיות אלגנטיות,
  תיקון גלילה אופקית במובייל, **Quick-View למוצר** (תמונה+תיאור+מק"ט+מחיר+כמות+
  "הוספה להזמנה"+קישור לדף מוצר), scroll-reveal, עיצוב מחדש ל-FAQ. הכול ב-theme
  `156232417521` (UNPUBLISHED) וב-git (נקי, מסונכרן עם origin).
- **Make — שלד בנוי (כבוי):** Webhook `3210551`
  (`https://hook.eu1.make.com/vc6pf7f4m6c1mndnddpxmqslqddovhb6`) + Scenario
  `6137437` (Webhook→token→payments/form→response). JS שולח כבר income/client
  בפורמט GI. `webhook_url` בתבנית-ריפו מולא; ב-theme החי `mode=demo` עדיין.

**מה באמצע / הבא (לפי סדר):**
1. **המתנה לצילומי מסך מטום** → סבב עיצוב הבא (ריווחים/hero/header+footer של Horizon
   שכמעט ריקים). אני לא יכול לראות רינדור — ראו "מגבלת אימות".
2. **שקילה: עיצוב header+footer** של Horizon (כרגע כמעט ריקים — תורם לתחושת "פשטות").
3. **סיום G3** (חסום במפתחות API של חשבונית ירוקה): להדביק KEY_ID/KEY_SECRET במודול
   ה-token בתרחיש 6137437, Run once + הזמנת בדיקה, לתקן שמות שדות `/payments/form`
   מול ה-API החי, להפעיל תרחיש, ובעורך ה-theme להחליף `mode`→`live`. פירוט מלא
   בסעיף "G3 — שלד Make שנבנה בפועל" למטה.

**מצב סליקה: demo — בטוח. שום דבר לא מחויב/נשלח עד שטום מסיים את שלב 3.**

---

## 🖥️ השתלטות מהמחשב (2026-06-11) — אודיט מקצה-לקצה + טבלת פערים

**סביבה (שדרוג מול הענן):** המחשב המקומי. Shopify Admin API **נגיש** (טוקן GT Build Agent ב-
`C:\Users\tomw2\.gt-secrets\.env`, scopes כולל write_themes/read_themes/write_files/write_products —
products לא נוגעים). דפדפן אמיתי (Chrome DevTools MCP) זמין לאימות רינדור. הריפו שוכפל ל-
`C:\Users\tomw2\gt-theme-shopify-B2B` (מחוץ ל-Dropbox; .git חי בתוך Dropbox = סיכון).

**חוקה:** מסמכי `GT-B2B-Landing-Requirements-G0` ו-`GT-B2B-Master-Prompt-v3` **לא קיימים** בריפו/דיסק
(כנראה היו ה-brief המשיק לסשן הענן, לא קומטו). לפי הוראת טום עובדים ב"חוקה-נגזרת": דף נחיתה
**מהיר, יפה, מקצועי, עם תמונות המוצר שבפרויקט**. לא ממציאים DoD/קריטריונים.

**בדיקת זהות (repo `horizon/` מול theme חי 156232417521):**
- 6/8 קבצים זהים בית-בבית (live=LF, repo=CRLF, תוכן זהה): `b2b-order-form.css/js`, `b2b-hero.liquid`,
  `b2b-order-form.liquid`, `page.b2b-thank-you.json`, `layout/theme.liquid`.
- `page.b2b-landing.json` — **תוכן זהה** (38 מוצרים, 6 קבוצות, hero, sections זהים). ההבדל היחיד:
  `webhook_url` (ריפו מלא, live ריק) + באנר auto-generated של עורך ה-theme + whitespace. טום פתח בעורך
  אך **לא שינה תוכן**. הריפו = מקור אמת. דריפט-תוכן אמיתי: אין.
- `config/settings_data.json` — live ≠ repo. **live מנצח** (הגדרות theme גלובליות). נמשך ל-
  `.pull-pages/live_settings_data.json`. לא דוחפים repo→live; מעדכנים repo מ-live בעת הצורך.

**תקינות תוכן (Admin API על 38 ה-handles):**
- כל 38 ה-handles תקפים (productByHandle≠null), כולם ACTIVE.
- **7 מוצרים לא מפורסמים לערוץ Online Store** → לא מתרנדרים (31/38 מוצגים בפועל):
  Red Sangria 3.85L, White Sangria 3.85L, Bamboo Matcha Whisk, Bamboo Matcha Scoop,
  Matcha Whisk Stand, Matcha 600ml glass pot, Matcha bottle 500ml. **[טום] לפרסם לערוץ.**
- **17 מוצרים בלי featured image** (10 מוצגים כ-placeholder): Desert Infusion 1L, NAMASTEA 500,
  ODK×3, Maruei bags, Complete Kit, Ube, Frother + ה-7 הלא-מפורסמים. תמונות פרויקט קיימות רק לקו התה
  (`INPUT/photos/02_tea`: Desert Infusion, NAMASTEA 500 ועוד).

### טבלת פערים — מול היעד (מהיר/יפה/מקצועי + תמונות)

| תחום | פריט | מצב | קובץ/עדות |
|---|---|---|---|
| Flow | CONFIG דרך הגדרות סקשן (mode/webhook/success/min/whatsapp) | ✅ הושלם | `b2b-order-form.liquid` schema + JSON config |
| Flow | מודאל סיכום (focus-trap, Esc, אישור, demo-flag) | ✅ הושלם | `b2b-order-form.js` openModal |
| Flow | מצבי קצה (honeypot, מינימום, חיפוש-ריק, restore) | ✅ הושלם | js validateAll/applyFilter |
| Flow | עמוד תודה | ✅ הושלם | `page.b2b-thank-you.json` |
| Flow | demo/live + fallback וואטסאפ | ✅ הושלם (demo) | js submit |
| טופס | הקלדת כמות ישירה | ✅ הושלם | qty-input text+inputmode |
| טופס | חיפוש חי (שם+מק"ט, debounce, הסתרת קבוצות ריקות) | ✅ הושלם | js applyFilter |
| טופס | localStorage (סל + פרטי לקוח) | ✅ הושלם | js saveCart/restoreCart |
| טופס | שדה כתובת אספקה (עיר/רחוב/הערות) | ✅ הושלם | fieldset biz |
| ולידציה | ח.פ (9 ספרות), טלפון IL, אימייל, חובה | ✅ הושלם | js validators (ספרת ביקורת — בכוונה לא) |
| עיצוב | tabular-nums | ✅ הושלם | css `.num` |
| עיצוב | קפסולת סיכום דביקה | ✅ הושלם | css `.b2bof__bar` |
| עיצוב | גוף Assistant | ✅ הושלם | css/settings |
| עיצוב | **כותרות Frank Ruhl Libre** | ❌ לא מומש (כותרות = Rubik) | hero/css |
| תוכן | **תמונת מוצר ב-Hero** | ❌ חסר (גרדיאנט בלבד) | `b2b-hero.liquid` |
| תוכן | 7 מוצרים לא מפורסמים → לא מוצגים | ⚠️ חסום [טום: לפרסם] | Admin API |
| תוכן | 17 מוצרים בלי תמונה (10 placeholder) | ⚠️ חלקי (תמונות רק לקו התה) | Admin API |
| תקינות | **מע״מ — היה "כולל", המחירים ex-VAT** | ✅ תוקן (deploy ממתין) | liquid/js/css |
| לוקליזציה | באנר "Welcome to our store" (אנגלית) | ❌ חסר (עברית) | theme settings |
| לוקליזציה | פוטר "Join our email list" (אנגלית) | ❌ חסר (עברית) | theme settings |
| לוקליזציה | אין `locales/he.json` (מחרוזות מערכת EN) | ⚠️ חוב ידוע (RTL_DEBT) | לא חוסם נחיתה |
| G3 | Make + חשבונית ירוקה (סליקה) | ⏸️ חסום [טום: מפתחות GI] | סעיף G3 |
| Placeholders | whatsapp, min_order, mode→live | ⚠️ [טום] למלא | settings |
| קונסול | goodav + ERR_NAME_NOT_RESOLVED (אפליקציית צד-ג', לא הקוד שלנו) | ℹ️ רעש קיים | console |

### שינויים שבוצעו ועלו ל-Horizon (2026-06-11, מהמחשב)

**אישור מפורש מטום לחרוג מ"אין מוטציה על products" — לפעולות אדיטיביות בלבד:** פרסום לערוץ +
הוספת featured image. שום שינוי נתונים אחר במוצרים/קולקציות לא בוצע. MAIN לא נגענו. אין סליקה חיה.

1. **מע״מ (בקשת טום):** "כולל" → "אינם כוללים מע״מ · מע״מ יתווסף בחשבונית" — קפסולה דביקה,
   quick-view (JS), והערה חדשה במודאל הסיכום (`.b2bof__sum-vat`). אומת חי.
2. **Hero מפוצל עם תמונה אמיתית:** `b2b-hero.liquid` שוכתב ל-2 עמודות (טקסט+תמונה), value-props
   מתחת, `image_picker` + ברירת מחדל. assets: `gt-hero-energy.jpg/.webp` (קרף ENERGY מ-02_tea,
   4:5, webp 53KB, eager+fetchpriority). פונט כותרות נשאר Rubik (החלטת טום).
3. **פרסום 7 מוצרים** לערוץ Online Store (publishablePublish) — 38/38 מתרנדרים. ⚠️ צד-לוואי:
   גלויים גם בחנות הציבורית (ערוץ OS גלובלי).
4. **featured image ל-2 מוצרים** (התאמת SKU 100%): Desert Infusion (GT DESERT.png), NAMASTEA 500ml
   (GT NAMASTEA.png מתיקיית 1L). productCreateMedia → גלוי בכרטיס ובמוצר.
5. **Placeholder ממותג** (`.b2bof__ph`) במקום אייקון apparel — לכרטיסים ללא תמונה (~15).
6. **לוקליזציה לעברית:** באנר עליון + פוטר (newsletter + "Sign up") + יישור RTL.
   `header-group.json` + `footer-group.json` נלכדו לריפו ועלו (chrome גלובלי).

**QA סבב 1 (פונקציונלי+ויזואלי):** עבר. flow מלא נבדק חי: כמות→סכום (3×65=195)→טופס→ולידציה
(מוצר חסר / אישור חסר)→מודאל סיכום (כולל הערת מע״מ)→demo (אין חיוב, אין ניווט). RTL: dir=rtl,
lang=he, standards-mode. קונסול: אפס שגיאות מהקוד שלנו.

**תמונות חסרות — [טום] לספק (תיקיות SHOTS_NEEDED ריקות):** ODK ×3, Maruei bags, Complete Matcha Kit,
Ube, Frother, Measuring Cup + 5 אביזרי מאצ'ה + 2 סנגריה 3.85L. (אין packshot בפרויקט ל: Maruei
`GT-MAR-CER-18*22`, Ube `UBE-POWDER-1-KG`, בקבוק `GT-MAT-BTL-RU`.) עד אז — placeholder ממותג.

**[לבירור] מחירים בפומבי:** הדף מציג מחירי סיטונאות ב-URL ציבורי. כלל GT הכללי = "מחירים לא גלויים
ללא התחברות". לאשר שזה מכוון לדף הנחיתה הזה, או לשקול הגנה (סיסמת דף / לוגין / noindex).

### QA סבב 2 (אדוורסרי, multi-agent, 2026-06-11) — 13 ממצאים מאומתים · 10 תוקנו ועלו

**תוקן ואומת חי (10):**
- JS: `idempotencyKey` מתאפס אחרי הצלחה + ניקוי-סל (מונע נפילת dedupe בהזמנה חוזרת ב-live).
- JS: focus-trap ל-quick-view (aria-modal); נעילת body-scroll למודאל הסיכום + שחזור; איפוס
  payload-demo בפתיחה חוזרת; חיפוש סורק כעת את כל ה-`.b2bof__grid` (גם קבוצה ללא כותרת).
- Hero: תיקון fallback ל-`alt` (באג קדימות פילטרים ב-image_tag) דרך משתנה `hero_alt`.
- טופס: משפט המע״מ הקבוע הוצא מאזור ה-aria-live (`.b2bof__totals-live`) — פחות הכרזות ל-SR.
- CSS: ניגודיות מק"ט `--faint`→`--muted` (WCAG AA).
- עמוד תודה: הוסר כפתור וואטסאפ עם placeholder (`wa.me/...XXXX` — קישור שבור) + טקסט תלוי.

**נדחה ל-[טום]/G3 (3):**
- **`min_order_ils` ריק** → אין אכיפת מינימום. כלל GT הכללי = 800 ש"ח + מע״מ. להחליט אם הדף אוכף
  מינימום, ולמלא בעורך (הסכום ב-JS הוא ex-VAT — לקבוע 800 על בסיס ex-VAT או להתאים).
- **`webhook_url` מרונדר ל-HTML ציבורי** דרך config-script (כיום ריק ב-theme החי → לא חשוף).
  ב-G3: ה-Webhook ב-Make חייב לאמת secret/HMAC — ה-URL אפקטיבית פומבי. לא לסמוך על mode=demo.
- **`success_path` לא נקרא בקוד** (live עובר ל-`paymentUrl` מה-webhook). ב-G3: להעביר successUrl ל-Make.

### עדכון לפי תשובות טום (2026-06-11, סשן 2)
- **וואטסאפ 0543982444** → הוגדר `whatsapp=972543982444` (סקשן) + כפתור עמוד התודה הוחזר עם המספר
  האמיתי (`wa.me/972543982444`). ה-fallback בתקלת תשלום עובד. אומת חי.
- **מינימום 800 ₪ (ללא מע״מ)** → `min_order_ils=800` הוגדר ואומת חי: מתחת ל-800 → submit חסום + פס
  "עוד X למינימום"; מעל → פתוח. ה-JS בודק על בסיס ex-VAT — תואם להחלטת טום.
- **מחירים בפומבי** → אושר ע"י טום. נשאר גלוי, ה-flag נסגר.
- **Webhook (Make)** → `webhook_url` חובר לסקשן; **mode עדיין demo** (בטוח). ⚠️ לא להעביר ל-live עד
  שמפתחות חשבונית ירוקה בתרחיש 6137437 + Run-once. מומלץ secret/HMAC ב-Webhook (ה-URL פומבי ב-HTML).
- **תמונות — ספריות שאותרו (טום: "שמתי עוד מלא תמונות"):**
  - `Data Center GT/03_MARKETING_BRAND/תמונות בקבוקים חדשים.zip` — 20 cutout שקופים של בקבוקי התה
    (FRESH/CALM/DESERT/ENERGY/DETOX/REVIVE/NAMASTEA/CONSCIOUSNESS, 2 זוויות). איכותי, מתאים לכרטיסים.
  - `eddie work/gt b 2026 new/GT CATALOG/` — צילומי lifestyle לפי משקה (ice tea/lemonade/gazoz/chai/matcha).
  - `Eduardbakfar (temporary)/gteveryday-photo-download-1of1/` — 216 תמונות שיווק (highlights/menu/cocktails/giftboxes).
  - **חסר packshot ייעודי** ל: אביזרי מאצ'ה (מטרפה/כף/מעמד/כלי/בקבוק/כוס מדידה), ODK ×3, סנגריה 3.85L ×2.
    → טום לכוון/לספק, או להשתמש ב-cutouts לעקביות קו התה. עד אז — placeholder ממותג.

---


## מצב נוכחי

| פריט | מצב |
|---|---|
| Theme יעד | **Horizon** `gid://shopify/OnlineStoreTheme/156232417521` (UNPUBLISHED) |
| MAIN | `131669328113` — לא נגענו ולא ניגע |
| עמוד נחיתה | `/pages/b2b-landing` (Page id 132080042225, template `page.b2b-landing`) |
| עמוד תודה | `/pages/b2b-thank-you` (Page id 132080074993, template `page.b2b-thank-you`) |
| לינק preview | `https://gteveryday.com/pages/b2b-landing?preview_theme_id=156232417521` |
| ⚠️ דומיין | myshopify האמיתי = `greenteaeveryday.myshopify.com` · ראשי חי = `gteveryday.com`. הברीף נקב ב-`gteveryday.myshopify.com` שהוא **שגוי** (חנות לא-זמינה) — אל תשתמש בו ללינקים. |
| מצב סליקה | **demo** — אין חיווט חי עד G3 |

הערה: שני העמודים פורסמו (isPublished=true) כדי שה-preview יעבוד, אבל הם לא מקושרים
משום תפריט, וה-body שלהם ריק — בתבנית של MAIN הם עמוד ריק. סיכון לקוח: זניח.

## תכנית עיצוב (מעבר א')

- **פלטה:** ירוק עמוק `#457439` (מותג, hover ‎`#38602e`) · נייר חם `#FAFAF7` (רקע הטופס)
  · ענברי `#C8742E` ל-CTA הסופי בלבד ("המשך לתשלום") · דיו `#1F2A1D` · קו `#E5E7E2`.
- **טיפוגרפיה:** כותרות **Frank Ruhl Libre** 500/700 (סריף עברי, editorial) · גוף **Assistant**.
  Google Fonts עם preconnect + display=swap, רק משקלים בשימוש. הוחלף גם בהגדרות
  ה-theme‏ (Inter→Assistant) כי ל-Inter אין גליפים עבריים.
- **האלמנט הבלתי-נשכח:** קפסולת הסיכום הדביקה — ירוקה כהה, צפה מעל התוכן, מספרים
  חיים ב-tabular-nums, ה-CTA הענברי יושב בתוכה. כל שאר הדף שקט ונקי.
- **מה הדף הזה לא יהיה:** לא קטלוג, לא מגזין, לא "עוד חנות שופיפיי" — כלי הזמנה
  שמסעדן גומר בו הזמנה חוזרת בדקה, ביד אחת, בטלפון.
- **ביקורת עצמית (גרינטי-ספציפי):** רקע הנייר החם + נקודות הירוק בכותרות הקבוצות
  מרמזים על עלי תה על נייר אריזה; האייקונים inline SVG בקו דק (עלה/קומקום/משאית).
  בלי סטוק, בלי גרדיאנטים.
- **פונט כותרות — החלטה:** Frank Ruhl Libre אומץ. ל-fallback אושר IBM Plex Sans Hebrew;
  יוחלף רק אם הסריף יתנגש בצילומי המוצרים בבדיקה ויזואלית של טום (אני לא יכול לראות
  את ה-preview — ראו "מגבלת אימות" למטה).

## החלטות ארכיטקטורה

1. **3 קבצים** במקום section מונוליטי: `sections/b2b-order-form.liquid` +
   `assets/b2b-order-form.css` + `assets/b2b-order-form.js` (config עובר ב-JSON
   script tag). קריא, קל לעדכון, ותואם את סגנון Horizon.
2. **CONFIG דרך הגדרות הסקשן** (Theme Editor) — `mode`, `webhook_url`,
   `success_path`, `min_order_ils`, `whatsapp`. G3 = החלפת mode ל-live + הדבקת webhook.
3. **חיפוש חי** מסנן לפי שם+SKU עם debounce 150ms; קבוצות בלי תוצאות מוסתרות.
4. **ניווט משפחות** — צ'יפים דביקים מתחת לכותרת הטופס: תמציות · סנגריה וסמודי ·
   מאצ'ה ואביזרים (קבוצות עם `nav_label`). הלייבלים סטו מ"קוקטיילים/חומרי גלם"
   של הברייף כי הם לא משקפים את הקטלוג שנבחר ב-G1 — שמות אמת עדיפים.
5. **ולידציית ח.פ: אורך+ספרות בלבד (9)** — אלגוריתם ספרת ביקורת לא מומש בכוונה
   (אסור להמציא). אפשר להוסיף בהמשך אם טום יספק ספק מאומת.
6. **דפי העמודים פורסמו** כדי שה-preview יעבוד — ראו הערה למעלה.
7. **settings_data.json** הוחלף ב-upsert (פונטים בלבד); העתק מלא בריפו תחת
   `horizon/config/`. אם טום ישנה הגדרות בעורך — הקובץ בחנות מנצח, לעדכן את הריפו.

## חוזה ה-Make / חשבונית ירוקה (ל-G3 — תיעוד בלבד)

הסצנריו שטום יבנה ב-Make: **Webhook** (מקבל את ה-payload שלמטה) → יצירת מסמך/דף
תשלום בחשבונית ירוקה עם השורות → **Webhook Response** עם `{"paymentUrl": "..."}`.

Payload שנשלח (POST JSON, header ‏`Content-Type: application/json`):

```json
{
  "source": "b2b-landing",
  "idempotencyKey": "<uuid-v4 — קבוע לאורך נסיונות חוזרים של אותה הזמנה>",
  "createdAt": "<ISO-8601>",
  "items": [{"sku": "", "title": "", "qty": 0, "unitPriceILS": 0, "lineTotalILS": 0}],
  "totalILS": 0,
  "customer": {
    "businessName": "", "companyId": "", "contactName": "",
    "phone": "", "email": "", "city": "", "street": "", "notes": ""
  }
}
```

מיפוי מול חשבונית ירוקה — **לא ננחש שמות שדות של ה-API שלהם**. מה שה-payload
מספק: שורות (sku/title/qty/unitPrice/lineTotal), סכום כולל, פרטי לקוח מלאים כולל
ח.פ וכתובת. ההתאמה לשדות מורנינג תיעשה בתוך הסצנריו ב-Make מול התיעוד הרשמי שלהם.

תשובה מצופה: ‏200 עם `{"paymentUrl": "https://..."}` → הדפדפן מועבר לשם.
חזרה מהסליקה: להגדיר במורנינג redirect ל-`https://gteveryday.com/pages/b2b-thank-you`.

## ריכוז placeholders (מה שטום צריך למלא)

| מפתח | היכן | ערך נוכחי |
|---|---|---|
| `whatsapp` | הגדרות הסקשן + עמוד התודה (כפתור) | `9725XXXXXXXX` |
| `min_order_ils` | הגדרות הסקשן | ריק (= ללא מינימום) |
| `webhook_url` | הגדרות הסקשן | ריק (demo) |
| `mode` | הגדרות הסקשן | `demo` |
| טלפון/כתובת בעמוד התודה | template | — |

## מגבלת אימות (כשל סביבתי מתועד)

ה-network policy של סביבת הריצה חוסם את כל דומייני Shopify — `fetch` לעמוד ה-preview
בלתי אפשרי מכאן (נוסה: Shopify CLI ✗, גישת HTTP ישירה ✗, MCP מספק Admin API בלבד ✗).
לכן אימות הרינדור בפועל (קונסול, CLS, ויזואליה) נשאר לטום בלינק ה-preview.
האימות שבוצע: קריאת הקבצים בחזרה מה-theme, ולידציית JSON/Liquid/Schema מקומית,
ו-walkthrough ידני של כל זרימות ה-JS.

## יומן

- T1 בוצע (baseline Vodoma בריפו, commit 9320525) — נתיב Vodoma נזנח בהחלטת טום.
- Prestige (DEMO) נחסם ע"י Shopify ל-API — הוחלט Horizon.
- 3 העלאות Horizon: section, template+layout(RTL), settings(פונטים) — הצליחו.
- page.b2b-thank-you הועלה; שני Pages נוצרו (החריגים המאושרים היחידים).

## יומן QA (סבבים)

**סבב 1 (קוד, סטטי):** אומתו checksums מול ה-theme — CSS/JS/layout תואמים בית-בבית;
הסקשן אומת בקריאה מלאה (הבדל יחיד: תו חץ בהערת Liquid — חסר השפעה).
נמצאו ותוקנו: (1) ריפוד פיזי בשדה החיפוש שהתנגש עם מיקום האייקון ב-RTL →
הוחלף ל-padding-inline-end; (2) ה-toolbar הדביק נתפס מתחת ל-header של Horizon →
top:var(--header-height). תוקן והועלה.

**סבב 2 (walkthrough לוגי):** זרימות demo/live, שחזור סל, חיפוש-ללא-תוצאות, מינימום
הזמנה, honeypot, מלכודת פוקוס ו-Esc במודאל — נבדקו מול הקוד שורה-שורה; אין הפניות
לאלמנטים חסרים (כל הסלקטורים ב-JS קיימים במרקאפ). בדיקת דפדפן אמיתית — אצל טום
(ראו "מגבלת אימות").

**ביצועים:** CSS ‏11KB, ‏JS ‏17KB (לא ממוזער, קריא בכוונה) — נטען רק בדף הנחיתה,
script defer, תמונות lazy + width/height + aspect-ratio (אפס CLS צפוי), פונטים
display=swap + preconnect. אין ספריות חיצוניות, אין קוד מת.

## G3 — Make.com + חשבונית ירוקה (חקירה + תוכנית בנייה)

**גישת Make (אומת):** מחובר כ-Tom Witt · org `6913249` ("My Organization", eu1) ·
team `1240098` ("My Team") · תכנית Teams (premium apps, credentialRequests=on).
→ יש הרשאה מלאה לבנות תרחישים.

**קונקטור:** אין אפליקציית "חשבונית ירוקה/morning" מובנית ב-Make. נבנה במודולי HTTP
גנריים (Make: HTTP "Make a request"). (קיים קונקטור Tranzila לסליקה ישראלית — לא נדרש כאן.)

**חוזה ה-API של חשבונית ירוקה (morning) — לאימות מול ה-API החי בזמן הבנייה, לא להמציא:**
- Base: `https://api.greeninvoice.co.il/api/v1`
- Auth: `POST /account/token` body `{ "id": "<KEY_ID>", "secret": "<KEY_SECRET>" }`
  → `{ "token": "<JWT>", "expires": <unix> }`. אח"כ `Authorization: Bearer <token>`.
- דף תשלום: `POST /payments/form` (מייצר דף סליקה מתארח ומחזיר `url`). שדות עיקריים:
  `description`, `type` (סוג מסמך שיופק אחרי תשלום), `lang:"he"`, `currency:"ILS"`,
  `vatType`, `amount`, `maxPayments`, `client{ name, emails[], taxId, address, city,
  country:"IL", phone, add:true }`, `income[{ description, quantity, price,
  currency:"ILS", vatType, catalogNum }]`, `remarks`, `successUrl`, `failureUrl`, `notifyUrl`.
  → תגובה: `{ "errorCode":0, "url":"https://...", "id":"..." }` — ה-`url` הוא דף הסליקה.
  ⚠️ Apiary (`greeninvoice.docs.apiary.io`) חוסם fetch אוטומטי; השדות לעיל מבוססי-ידע
  ומקורות פתוחים — יש לאמת מול הסביבה החיה של חשבונית ירוקה בזמן הבנייה ב-Make.
  מקור רשמי: https://greeninvoice.docs.apiary.io/

**תרחיש Make מתוכנן (מקצה לקצה):**
1. Custom Webhook (trigger) — מקבל את ה-payload של הטופס.
2. HTTP → `POST /account/token` (id+secret מ-connection/data store) → token.
3. HTTP → `POST /payments/form` עם מיפוי: items→income, customer→client, totalILS→amount,
   successUrl=`https://gteveryday.com/pages/b2b-thank-you`.
4. Webhook Response → `{ "paymentUrl": "{{url מהשלב הקודם}}" }`.
ואז בצד ה-theme: להדביק את ה-Webhook URL בהגדרת הסקשן ולהחליף `mode`→`live`.

**חוסם יחיד (סוד שרק טום נותן):** מפתחות API של חשבונית ירוקה (KEY_ID + KEY_SECRET)
מההגדרות → כלי מפתחים → מפתחות API. בלעדיהם אי אפשר לבדוק/להפעיל את התרחיש,
ואסור ליצור מסמכים אמיתיים. את הסודות מזינים ישירות ב-Make (לא בצ'אט, לא בריפו).

## G3 — שלד Make שנבנה בפועל ✅ (כבוי עד מפתחות)

- **Webhook** (gateway-webhook) id `3210551` · URL:
  `https://hook.eu1.make.com/vc6pf7f4m6c1mndnddpxmqslqddovhb6`
- **Scenario** id `6137437` — "GT B2B → Green Invoice payment", team 1240098, **isActive=false**.
  זרימה: Webhook(1) → HTTP `POST /account/token`(2) → HTTP `POST /payments/form` Bearer(3)
  → Webhook Response `{paymentUrl: {{3.data.url}}}`(4).
- צד theme: `assets/b2b-order-form.js` שולח כעת גם `income[]` ו-`client{}` בפורמט GI
  (passthrough), בנוסף ל-items/customer. `webhook_url` הוגדר בתבנית בריפו; `mode` עדיין `demo`.
  ⚠️ ה-theme החי טרם עודכן עם webhook_url/mode=live — זה חלק מסיום G3.

### סיום G3 (אחרי שטום יוצר מפתחות API בחשבונית ירוקה):
1. ב-Make, תרחיש 6137437, מודול 2 (token): להחליף `__PASTE_GI_KEY_ID__` ו-
   `__PASTE_GI_KEY_SECRET__` במפתחות האמיתיים (או לחבר Data Store/connection).
2. להריץ "Run once" + לשלוח הזמנת בדיקה מהדף → לאמת שמודול 3 מחזיר `url`,
   ולתקן שמות שדות של `/payments/form` מול השגיאות שה-API יחזיר (type/vatType/income).
3. להפעיל את התרחיש (scheduling: immediately/on-demand).
4. בעורך ה-theme (סקשן B2B Order Form): לוודא `webhook_url` =
   `https://hook.eu1.make.com/vc6pf7f4m6c1mndnddpxmqslqddovhb6` ולהחליף `mode`→`live`.
5. בחשבונית ירוקה: להגדיר אמצעי סליקה פעיל, ו-redirect הצלחה ל-/pages/b2b-thank-you.

⚠️ **מע״מ (2026-06-11, טום):** המחירים בקטלוג **אינם כוללים מע״מ**. הטקסטים בדף תוקנו ("אינם
כוללים מע״מ · מע״מ יתווסף בחשבונית"). ב-G3: השדה `income[].vatType` (וגם `vatType` של
`/payments/form`) בקוד שולח כרגע `0` — זה **ניחוש** שיש לאמת מול ה-API החי של חשבונית ירוקה כך
שישקף מחיר ללא מע״מ (מע״מ מתווסף). אסור להניח את ה-enum; לאמת בריצת הבדיקה. כמו כן: ה-`amount`
הנשלח הוא סכום ה-ex-VAT; ודאו שחשבונית ירוקה מוסיפה מע״מ ולא מתייחסת אליו ככולל.
