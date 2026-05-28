import { Suspense } from "react";
import Link from "next/link";
import GalleryContent from "./GalleryContent";

export default function GalleryPage() {
  return (
    <div className="min-h-dvh bg-dark">
      <header className="sticky top-0 z-30 glass border-b border-gold-800/30">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/" className="text-gold-500 text-2xl leading-none">‹</Link>
          <div className="text-center">
            <h1 className="text-gold-gradient font-display text-lg font-bold leading-none">
              هيثم وأميرة
            </h1>
            <p className="text-gold-600 text-xs font-body mt-0.5">صور العرس</p>
          </div>
          <div className="w-6" />
        </div>
      </header>

      <main className="pb-28">
        <Suspense fallback={
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-gold-800 border-t-gold-400 animate-spin" />
          </div>
        }>
          <GalleryContent />
        </Suspense>
      </main>
    </div>
  );
}
