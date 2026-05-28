# 💍 منصة مشاركة صور الأعراس

منصة عربية فاخرة لمشاركة صور حفل الزفاف — Next.js 16 + Cloudflare R2 + Vercel

---

## 🚀 الإعداد السريع

### 1. إعداد Cloudflare R2

1. سجّل دخول إلى [Cloudflare Dashboard](https://dash.cloudflare.com)
2. انتقل إلى **R2 Object Storage** → **Create bucket** (مثلاً: `wedding-photos`)
3. فعّل الوصول العام: **Settings → Public Access → Allow Access**
4. احفظ رابط النطاق العام (مثلاً: `https://pub-xxx.r2.dev`)
5. أنشئ API Token: **My Profile → API Tokens → Create Token** (أذونات: `Object Read & Write`)
6. انسخ `Account ID` من صفحة R2 الرئيسية

### 2. إعداد CORS على الـ Bucket

في **Bucket → Settings → CORS Policy**، أضف:

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

### 3. المتغيرات البيئية

انسخ `.env.local.example` إلى `.env.local` واملأ القيم:

```env
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=wedding-photos
R2_PUBLIC_URL=https://pub-xxxxxxxx.r2.dev

NEXT_PUBLIC_WEDDING_COUPLE=أحمد ونور
NEXT_PUBLIC_WEDDING_DATE=١٥ يونيو ٢٠٢٦
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

ADMIN_SECRET=your_secure_admin_password
```

### 4. تشغيل محلي

```bash
npm install
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000)

---

## 📦 النشر على Vercel

```bash
npx vercel --prod
```

أو اربط مستودع GitHub بـ Vercel وأضف المتغيرات البيئية في **Settings → Environment Variables**.

---

## 🔑 لوحة الإدارة

للوصول إلى ميزات الإدارة (تثبيت الصور):

```
https://your-domain.vercel.app/gallery?admin=YOUR_ADMIN_SECRET
```

---

## 🗂 هيكل المشروع

```
src/
├── app/
│   ├── page.tsx              ← شاشة الترحيب
│   ├── gallery/              ← المعرض الرئيسي + رفع الصور
│   ├── timeline/             ← عرض الجدول الزمني
│   ├── memory-wall/          ← جدار الذكريات (التهاني)
│   ├── slideshow/            ← عرض شرائح للتلفزيون
│   └── api/                  ← مسارات API
│       ├── upload/presigned/ ← رابط رفع موقّع لـ R2
│       ├── upload/complete/  ← تسجيل metadata الصورة
│       ├── photos/           ← قائمة الصور مع pagination
│       ├── reactions/        ← التفاعلات (❤️ 😍 🎉 🔥)
│       ├── messages/         ← رسائل التهنئة
│       └── admin/pin/        ← تثبيت الصور المفضلة
├── components/
│   ├── welcome/              ← شاشة الترحيب + QR
│   ├── gallery/              ← Masonry + ImageViewer + Upload
│   ├── timeline/             ← عرض زمني مصنّف
│   ├── memory/               ← جدار التهاني
│   ├── slideshow/            ← عرض الشرائح
│   ├── navigation/           ← شريط التنقل السفلي
│   └── ui/                   ← مكونات مشتركة
└── lib/
    ├── r2.ts                 ← عميل Cloudflare R2
    ├── types.ts              ← تعريفات TypeScript
    └── utils.ts              ← دوال مساعدة
```

---

## 🎨 المميزات

| الميزة | الوصف |
|--------|-------|
| 🖼️ معرض Masonry | تخطيط Pinterest بالتحميل الكسول |
| 📷 رفع مباشر | الكاميرا + المعرض + سحب وإفلات |
| ❤️ تفاعلات | ❤️ 😍 🎉 🔥 بدون حساب |
| 📅 جدول زمني | الاستقبال → الحفل → العشاء → الرقص |
| 💌 جدار الذكريات | تهاني الضيوف بالعربية |
| 📺 عرض شرائح | وضع تلفزيون للعرض في القاعة |
| 📱 QR Code | مسح واحد للدخول الفوري |
| 📌 مفضلة العروسين | تثبيت الصور من لوحة الإدارة |

---

## ⚡ الأداء

- رفع مباشر إلى R2 عبر Presigned URLs (بدون مرور بالسيرفر)
- تحميل كسول للصور مع Skeleton loading
- Infinite scroll مع Cursor-based pagination
- تفاعلات append-only (بدون race conditions)
