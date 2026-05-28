"use client";

import { useState, useRef, useCallback, useEffect, type ChangeEvent } from "react";

interface UploadModalProps {
  onClose: () => void;
  onUploaded: () => void;
}

interface FileItem {
  file: File;
  preview: string;
  progress: number;
  status: "uploading" | "done" | "error";
}

export default function UploadModal({ onClose, onUploaded }: UploadModalProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [configReady, setConfigReady] = useState(false);
  const configRef = useRef<{ cloudName: string; uploadPreset: string; folder: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  // Prefetch config on mount
  useEffect(() => {
    fetch("/api/upload/presigned")
      .then((r) => r.json())
      .then((cfg) => { configRef.current = cfg; setConfigReady(true); });
  }, []);

  const uploadFile = useCallback(async (item: FileItem, index: number) => {
    const cfg = configRef.current;
    if (!cfg) return;

    const formData = new FormData();
    formData.append("file", item.file);
    formData.append("upload_preset", cfg.uploadPreset);
    formData.append("folder", cfg.folder);

    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setFiles((p) => p.map((f, i) => i === index ? { ...f, progress: Math.round((e.loaded / e.total) * 100) } : f));
        }
      };
      xhr.onload = () => {
        if (xhr.status < 400) {
          setFiles((p) => p.map((f, i) => i === index ? { ...f, status: "done", progress: 100 } : f));
          resolve();
        } else {
          setFiles((p) => p.map((f, i) => i === index ? { ...f, status: "error" } : f));
          reject();
        }
      };
      xhr.onerror = () => {
        setFiles((p) => p.map((f, i) => i === index ? { ...f, status: "error" } : f));
        reject();
      };
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${cfg.cloudName}/image/upload`);
      xhr.send(formData);
    });
  }, []);

  const handleFiles = useCallback(async (newFiles: File[]) => {
    const images = newFiles.filter((f) => f.type.startsWith("image/")).slice(0, 20);
    if (!images.length) return;

    const items: FileItem[] = images.map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
      progress: 0,
      status: "uploading",
    }));

    setFiles((prev) => [...prev, ...items]);
    const startIndex = files.length; // offset for existing files

    // Upload all immediately in parallel
    await Promise.allSettled(items.map((item, i) => uploadFile(item, startIndex + i)));

    onUploaded();
    setTimeout(onClose, 1200);
  }, [files.length, uploadFile, onUploaded, onClose]);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(Array.from(e.target.files));
  };

  const doneCount = files.filter((f) => f.status === "done").length;
  const total = files.length;
  const allDone = total > 0 && doneCount === total;
  const isUploading = files.some((f) => f.status === "uploading");

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-dark">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4 border-b border-gold-800/30">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full border border-gold-700/40 flex items-center justify-center text-gold-400 text-lg"
        >
          ✕
        </button>
        <h2 className="text-gold-200 font-display text-lg font-bold">
          {isUploading ? `يحمّل... ${doneCount}/${total}` : allDone ? "تم ✨" : "حط صورك"}
        </h2>
        <div className="w-9" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-6">
        {/* Pick buttons — shown before and during upload */}
        {!allDone && (
          <div className="w-full space-y-3">
            <button
              onClick={() => cameraRef.current?.click()}
              disabled={!configReady}
              className="btn-gold w-full py-5 rounded-2xl text-xl font-body font-bold flex items-center justify-center gap-3 text-dark disabled:opacity-40"
            >
              <span className="text-2xl">📸</span>
              <span>صوّر دابا</span>
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={!configReady}
              className="w-full py-4 rounded-2xl border-2 border-gold-500/40 text-gold-300 font-body font-bold text-lg flex items-center justify-center gap-3 hover:border-gold-400 transition-colors disabled:opacity-40"
            >
              <span className="text-2xl">🖼️</span>
              <span>اختار من الصور</span>
            </button>
          </div>
        )}

        {/* Progress grid */}
        {files.length > 0 && (
          <div className="w-full grid grid-cols-3 gap-2">
            {files.map((item, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-dark-card">
                <img src={item.preview} alt="" className="w-full h-full object-cover" />
                {item.status === "uploading" && (
                  <>
                    <div className="absolute inset-0 bg-dark/60 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full border-2 border-gold-800 border-t-gold-400 animate-spin" />
                    </div>
                    <div className="absolute bottom-0 inset-x-0 h-1 bg-dark">
                      <div className="h-full bg-gold-400 transition-all duration-200" style={{ width: `${item.progress}%` }} />
                    </div>
                  </>
                )}
                {item.status === "done" && (
                  <div className="absolute inset-0 bg-dark/40 flex items-center justify-center">
                    <div className="w-9 h-9 rounded-full bg-gold-500 flex items-center justify-center text-dark text-lg font-bold">✓</div>
                  </div>
                )}
                {item.status === "error" && (
                  <div className="absolute inset-0 bg-red-900/60 flex items-center justify-center">
                    <span className="text-white text-2xl">✗</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {allDone && (
          <div className="text-center space-y-2">
            <p className="text-5xl">🎉</p>
            <p className="text-gold-200 font-display text-xl font-bold">برافو! تحملت الصور</p>
            <p className="text-gold-500 font-body text-sm">باش تلقاها في المعرض</p>
          </div>
        )}
      </div>

      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={onFileChange} />
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFileChange} />
    </div>
  );
}
