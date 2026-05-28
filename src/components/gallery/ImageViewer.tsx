"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import type { PhotoMetadata } from "@/lib/types";

interface ImageViewerProps {
  photo: PhotoMetadata;
  photos: PhotoMetadata[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function ImageViewer({ photo, photos, currentIndex, onClose, onNavigate }: ImageViewerProps) {
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft" && hasPrev) onNavigate(currentIndex - 1);
    if (e.key === "ArrowRight" && hasNext) onNavigate(currentIndex + 1);
  }, [onClose, hasPrev, hasNext, currentIndex, onNavigate]);

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  let touchStartX = 0;
  const onTouchStart = (e: React.TouchEvent) => { touchStartX = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 60) {
      if (dx > 0 && hasPrev) onNavigate(currentIndex - 1);
      if (dx < 0 && hasNext) onNavigate(currentIndex + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 glass shrink-0">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full border border-gold-700/40 flex items-center justify-center text-gold-300 text-lg"
        >
          ✕
        </button>
        <span className="text-gold-500 font-body text-sm">
          {currentIndex + 1} / {photos.length}
        </span>
        <div className="w-10" />
      </div>

      {/* Image */}
      <div
        className="flex-1 relative"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Image
          key={photo.id}
          src={photo.url}
          alt=""
          fill
          className="object-contain"
          sizes="100vw"
          priority
        />

        {hasPrev && (
          <button
            onClick={() => onNavigate(currentIndex - 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass border border-gold-700/40 flex items-center justify-center text-gold-300 text-2xl"
          >
            ›
          </button>
        )}
        {hasNext && (
          <button
            onClick={() => onNavigate(currentIndex + 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass border border-gold-700/40 flex items-center justify-center text-gold-300 text-2xl"
          >
            ‹
          </button>
        )}
      </div>

      {/* Uploader name */}
      {photo.uploaderName && (
        <div className="glass shrink-0 px-4 py-3 text-center">
          <span className="text-gold-500 font-body text-sm">📷 {photo.uploaderName}</span>
        </div>
      )}
    </div>
  );
}
