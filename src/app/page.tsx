import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-between bg-dark overflow-hidden relative px-6">
      {/* Decorative blobs */}
      <div className="absolute -top-32 -right-32 w-72 h-72 rounded-full bg-gold-500/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl pointer-events-none" />

      {/* Top ornament */}
      <div className="w-full flex justify-center pt-16">
        <div className="flex items-center gap-3">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-gold-500/60" />
          <span className="text-gold-500 text-xl">✦</span>
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-gold-500/60" />
        </div>
      </div>

      {/* Center content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 text-center">
        {/* Ring icon */}
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/10 border-2 border-gold-500/30 flex items-center justify-center animate-[float_3s_ease-in-out_infinite]">
          <span className="text-5xl">💍</span>
        </div>

        {/* Names */}
        <div className="space-y-2">
          <p className="text-gold-500 font-body text-sm tracking-widest">حفل زفاف</p>
          <h1 className="text-gold-gradient font-display text-5xl font-bold leading-tight">
            هيثم وأميرة
          </h1>
          <p className="text-gold-400 font-body text-base mt-2">
            شاركونا لحظاتكم الجميلة 📷
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full max-w-xs">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-gold-500/60" />
          <div className="w-2 h-2 rotate-45 bg-gold-500/60" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gold-500/40 to-gold-500/60" />
        </div>

        <p className="text-gold-600 font-body text-sm max-w-xs leading-relaxed">
          ارفعوا صوركم وشاهدوا صور جميع الضيوف من هذه الليلة الرائعة
        </p>
      </div>

      {/* CTA */}
      <div className="w-full max-w-sm pb-16 space-y-3">
        <Link
          href="/gallery"
          className="btn-gold w-full py-5 rounded-2xl text-xl font-body font-bold flex items-center justify-center gap-3 text-dark no-underline"
        >
          <span>🖼️</span>
          <span>دخول المعرض</span>
        </Link>
        <p className="text-center text-gold-700 text-xs font-body">
          بدون تسجيل · بدون حساب
        </p>
      </div>
    </div>
  );
}
