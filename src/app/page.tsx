import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-between bg-dark overflow-hidden relative px-6">
      <div className="absolute -top-32 -right-32 w-72 h-72 rounded-full bg-gold-500/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl pointer-events-none" />

      <div className="w-full flex justify-center pt-14">
        <div className="flex items-center gap-3">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-gold-500/60" />
          <span className="text-gold-500 text-xl">✦</span>
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-gold-500/60" />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
        {/* Couple photo */}
        <div className="w-44 h-44 rounded-full overflow-hidden border-2 border-gold-500/40 shadow-2xl shadow-gold-500/10 animate-[float_3s_ease-in-out_infinite]">
          <Image
            src="/image.png"
            alt="هيثم وأميرة"
            width={176}
            height={176}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        <div className="space-y-2">
          <p className="text-gold-500 font-body text-sm tracking-widest">عرس</p>
          <h1 className="text-gold-gradient font-display text-5xl font-bold leading-tight">
            هيثم وأميرة
          </h1>
        </div>

        <div className="flex items-center gap-3 w-full max-w-xs">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-gold-500/60" />
          <div className="w-2 h-2 rotate-45 bg-gold-500/60" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gold-500/40 to-gold-500/60" />
        </div>

        <p className="text-gold-500 font-body text-base max-w-xs leading-relaxed">
          حطوا صوركم وشوفوا صور الجميع 📸
        </p>
      </div>

      <div className="w-full max-w-sm pb-14 space-y-3">
        <Link
          href="/gallery"
          className="btn-gold w-full py-5 rounded-2xl text-xl font-body font-bold flex items-center justify-center gap-3 text-dark no-underline"
        >
          شوف الصور 🖼️
        </Link>
        <p className="text-center text-gold-700 text-xs font-body">
          بلا تسجيل · بلا حساب
        </p>
      </div>
    </div>
  );
}
