"use client";

import { useState, useRef, useCallback, type ChangeEvent } from "react";

interface UploadModalProps {
  onClose: () => void;
  onUploaded: () => void;
}

interface FileItem {
  file: File;
  preview: string;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
}

export default function UploadModal({ onClose, onUploaded }: UploadModalProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploaderName, setUploaderName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((newFiles: File[]) => {
    const images = newFiles.filter((f) => f.type.startsWith("image/")).slice(0, 10);
    setFiles((prev) =>
      [
        ...prev,
        ...images.map((f) => ({
          file: f,
          preview: URL.createObjectURL(f),
          progress: 0,
          status: "pending" as const,
        })),
      ].slice(0, 10)
    );
  }, []);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files));
  };

  const removeFile = (i: number) => {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[i].preview);
      return prev.filter((_, idx) => idx !== i);
    });
  };

  const uploadAll = async () => {
    if (!files.length) return;
    setUploading(true);

    // Fetch Cloudinary config once
    const config = await fetch("/api/upload/presigned").then((r) => r.json());
    const { cloudName, uploadPreset, folder } = config;

    for (let i = 0; i < files.length; i++) {
      if (files[i].status === "done") continue;
      setFiles((p) => p.map((f, idx) => (idx === i ? { ...f, status: "uploading", progress: 5 } : f)));

      try {
        const formData = new FormData();
        formData.append("file", files[i].file);
        formData.append("upload_preset", uploadPreset);
        formData.append("folder", folder);
        if (uploaderName.trim()) {
          formData.append("context", `uploaderName=${uploaderName.trim().slice(0, 50)}`);
        }

        const result = await new Promise<{ public_id: string; secure_url: string }>(
          (resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.upload.onprogress = (e) => {
              if (e.lengthComputable) {
                setFiles((p) =>
                  p.map((f, idx) =>
                    idx === i ? { ...f, progress: Math.round((e.loaded / e.total) * 95) } : f
                  )
                );
              }
            };
            xhr.onload = () => {
              if (xhr.status < 400) resolve(JSON.parse(xhr.responseText));
              else reject(new Error(xhr.statusText));
            };
            xhr.onerror = reject;
            xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
            xhr.send(formData);
          }
        );

        void result; // URL is in Cloudinary, photos API fetches it
        setFiles((p) =>
          p.map((f, idx) => (idx === i ? { ...f, status: "done", progress: 100 } : f))
        );
      } catch {
        setFiles((p) =>
          p.map((f, idx) => (idx === i ? { ...f, status: "error", progress: 0 } : f))
        );
      }
    }

    setUploading(false);
    onUploaded();
    setTimeout(onClose, 600);
  };

  const doneCount = files.filter((f) => f.status === "done").length;
  const allDone = files.length > 0 && doneCount === files.length;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-dark">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4 border-b border-gold-800/30">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full border border-gold-700/40 flex items-center justify-center text-gold-400"
        >
          ✕
        </button>
        <h2 className="text-gold-200 font-display text-lg font-bold">رفع الصور</h2>
        <span className="text-gold-600 text-sm font-body">{files.length}/10</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Drop zone */}
        {files.length < 10 && (
          <div
            className={`upload-zone rounded-2xl p-10 flex flex-col items-center gap-4 cursor-pointer ${dragOver ? "drag-over" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(Array.from(e.dataTransfer.files)); }}
            onClick={() => fileRef.current?.click()}
          >
            <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-3xl">
              📷
            </div>
            <p className="text-gold-200 font-body font-semibold">اختر صوراً من معرضك</p>
            <div className="flex gap-3">
              <button
                onClick={(e) => { e.stopPropagation(); cameraRef.current?.click(); }}
                className="px-4 py-2 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-300 text-sm font-body flex items-center gap-2"
              >
                📸 الكاميرا
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
                className="px-4 py-2 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-300 text-sm font-body flex items-center gap-2"
              >
                🖼️ المعرض
              </button>
            </div>
          </div>
        )}

        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={onFileChange} />
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFileChange} />

        {/* Preview grid */}
        {files.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {files.map((item, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-dark-card">
                <img src={item.preview} alt="" className="w-full h-full object-cover" />
                {item.status === "uploading" && (
                  <div className="absolute inset-0 bg-dark/70 flex flex-col items-center justify-center gap-1">
                    <div className="w-8 h-8 rounded-full border-2 border-gold-800 border-t-gold-400 animate-spin" />
                    <span className="text-gold-300 text-xs font-bold">{item.progress}%</span>
                  </div>
                )}
                {item.status === "done" && (
                  <div className="absolute inset-0 bg-dark/50 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-dark text-xl font-bold">✓</div>
                  </div>
                )}
                {item.status === "pending" && (
                  <button
                    onClick={() => removeFile(i)}
                    className="absolute top-1 left-1 w-6 h-6 rounded-full bg-dark/80 text-white text-xs flex items-center justify-center"
                  >
                    ✕
                  </button>
                )}
                {item.status === "uploading" && (
                  <div className="absolute bottom-0 inset-x-0 h-1 bg-dark-card">
                    <div className="h-full bg-gold-400 transition-all duration-300" style={{ width: `${item.progress}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Name input */}
        {files.length > 0 && !allDone && (
          <input
            type="text"
            value={uploaderName}
            onChange={(e) => setUploaderName(e.target.value)}
            placeholder="اسمك (اختياري)"
            maxLength={50}
            className="w-full bg-dark-card border border-gold-800/40 rounded-xl px-4 py-3 text-gold-100 text-sm font-body placeholder:text-gold-700 focus:outline-none focus:border-gold-500/60 transition-colors"
          />
        )}
      </div>

      {/* Upload button */}
      {files.length > 0 && !allDone && (
        <div className="px-4 pb-8 pt-3 border-t border-gold-800/30">
          <button
            onClick={uploadAll}
            disabled={uploading}
            className="btn-gold w-full py-4 rounded-2xl text-base font-body font-bold disabled:opacity-50"
          >
            {uploading
              ? `جارٍ الرفع (${doneCount}/${files.length})...`
              : `رفع ${files.length} صورة ✨`}
          </button>
        </div>
      )}
    </div>
  );
}
