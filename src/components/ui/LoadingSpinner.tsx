"use client";

export default function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeMap = { sm: "w-5 h-5", md: "w-8 h-8", lg: "w-12 h-12" };
  return (
    <div
      className={`${sizeMap[size]} rounded-full border-2 border-gold-800 border-t-gold-400 animate-spin`}
    />
  );
}

export function FullScreenLoader() {
  return (
    <div className="fixed inset-0 bg-dark/90 flex flex-col items-center justify-center z-50 gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-gold-300 font-body text-sm">جارٍ التحميل...</p>
    </div>
  );
}
