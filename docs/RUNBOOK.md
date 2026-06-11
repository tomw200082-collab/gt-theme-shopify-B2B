# RUNBOOK — GT Everyday B2B Landing (Horizon)

עדכון אחרון: 2026-06-10 · ענף: `claude/gt-b2b-landing-page-le88xh`

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
