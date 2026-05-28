"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import ImageViewer from "./ImageViewer";
import type { PhotoMetadata } from "@/lib/types";

export default function MasonryGallery() {
  const [photos, setPhotos] = useState<PhotoMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const fetchPhotos = useCallback(async (reset = false, currentCursor?: string) => {
    const params = new URLSearchParams({ limit: "30" });
    if (currentCursor && !reset) params.set("cursor", currentCursor);
    const res = await fetch(`/api/photos?${params}`);
    if (!res.ok) return;
    const data = await res.json();
    setPhotos((prev) => (reset ? data.photos : [...prev, ...data.photos]));
    setCursor(data.nextCursor);
    setHasMore(Boolean(data.nextCursor));
  }, []);

  useEffect(() => {
    setLoading(true);
    setPhotos([]);
    fetchPhotos(true).finally(() => setLoading(false));
  }, [fetchPhotos]);

  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !loadingMore && hasMore && cursor) {
        setLoadingMore(true);
        fetchPhotos(false, cursor).finally(() => setLoadingMore(false));
      }
    }, { threshold: 0.1 });
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [fetchPhotos, hasMore, loadingMore, cursor]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 rounded-full border-2 border-gold-800 border-t-gold-400 animate-spin" />
      </div>
    );
  }

  if (!photos.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 px-6 text-center">
        <div className="text-7xl opacity-20">📷</div>
        <p className="text-gold-500 font-display text-xl font-bold">مازالش كان صور</p>
        <p className="text-gold-700 font-body text-sm">كون لول واحد يحط صورة! 🎉</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="masonry-grid px-2 pt-3">
        {photos.map((photo, idx) => (
          <PhotoCard key={photo.id} photo={photo} onClick={() => setViewerIndex(idx)} />
        ))}
      </div>

      <div ref={sentinelRef} className="flex justify-center py-6">
        {loadingMore && (
          <div className="w-6 h-6 rounded-full border-2 border-gold-800 border-t-gold-400 animate-spin" />
        )}
      </div>

      {viewerIndex !== null && photos[viewerIndex] && (
        <ImageViewer
          photo={photos[viewerIndex]}
          photos={photos}
          currentIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
          onNavigate={setViewerIndex}
        />
      )}
    </div>
  );
}

function PhotoCard({ photo, onClick }: { photo: PhotoMetadata; onClick: () => void }) {
  const [loaded, setLoaded] = useState(false);
  const ratio = photo.aspectRatio ?? (photo.height / photo.width);

  return (
    <div
      className="masonry-item relative rounded-xl overflow-hidden cursor-pointer group"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      aria-label="عرض الصورة"
    >
      <div className="relative w-full" style={{ paddingBottom: `${Math.max(0.6, Math.min(ratio, 1.8)) * 100}%` }}>
        {!loaded && <div className="absolute inset-0 skeleton rounded-xl" />}
        <Image
          src={photo.url}
          alt=""
          fill
          className={`object-cover transition-all duration-500 group-hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"}`}
          sizes="(max-width: 768px) 50vw, 33vw"
          onLoad={() => setLoaded(true)}
        />
      </div>
    </div>
  );
}
