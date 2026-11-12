"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Star } from "lucide-react";
import { uploadImage } from "@/lib/admin/upload";
import { showToast } from "@/lib/admin/toast";

export default function ImageUploader({
  images,
  onChange,
  multiple = true,
  compact = false,
}: {
  images: string[];
  onChange: (images: string[]) => void;
  multiple?: boolean;
  compact?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    const fileList = multiple ? Array.from(files) : [files[0]];
    const uploaded: string[] = [];

    for (const file of fileList) {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadImage(formData);
      if (result.ok) {
        uploaded.push(result.url);
      } else {
        showToast(result.error, "error");
      }
    }

    onChange(multiple ? [...images, ...uploaded] : uploaded);
    setUploading(false);
  };

  const removeAt = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  const makePrimary = (idx: number) => {
    const next = [...images];
    const [item] = next.splice(idx, 1);
    next.unshift(item);
    onChange(next);
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-ink-faint hover:border-primary hover:text-primary"
        title="Upload image"
      >
        {uploading ? (
          <span className="text-[10px]">…</span>
        ) : (
          <Upload size={14} />
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </button>
    );
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed py-8 text-center transition-colors ${
          dragOver ? "border-primary bg-tint" : "border-line"
        }`}
      >
        <Upload size={22} className="text-ink-faint" />
        <p className="text-sm text-ink-soft">
          {uploading ? "Uploading…" : "Drag & drop, or click to upload"}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {images.map((src, idx) => (
            <div key={src} className="group relative aspect-square overflow-hidden rounded-lg bg-tint">
              <Image src={src} alt="" fill className="object-cover" />
              {idx === 0 && (
                <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                  Cover
                </span>
              )}
              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/0 opacity-0 transition-opacity group-hover:bg-black/40 group-hover:opacity-100">
                {idx !== 0 && (
                  <button
                    type="button"
                    onClick={() => makePrimary(idx)}
                    className="rounded-full bg-white p-1.5"
                    title="Set as cover"
                  >
                    <Star size={13} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeAt(idx)}
                  className="rounded-full bg-white p-1.5"
                  title="Remove"
                >
                  <X size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
