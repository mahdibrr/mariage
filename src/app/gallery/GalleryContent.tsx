"use client";

import { useState } from "react";
import MasonryGallery from "@/components/gallery/MasonryGallery";
import UploadModal from "@/components/gallery/UploadModal";

export default function GalleryContent() {
  const [showUpload, setShowUpload] = useState(false);
  const [galleryKey, setGalleryKey] = useState(0);

  return (
    <>
      <MasonryGallery key={galleryKey} />

      {/* FAB */}
      <button
        onClick={() => setShowUpload(true)}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-6 py-4 rounded-full btn-gold shadow-xl shadow-gold-500/20 font-body font-bold text-dark text-base"
        aria-label="رفع صور"
      >
        <span className="text-xl">📷</span>
        <span>أضف صورة</span>
      </button>

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUploaded={() => setGalleryKey((k) => k + 1)}
        />
      )}
    </>
  );
}
