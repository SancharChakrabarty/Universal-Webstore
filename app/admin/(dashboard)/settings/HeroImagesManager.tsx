"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import { showToast } from "@/lib/admin/toast";
import { addHeroImage, removeHeroImage } from "./actions";

type HeroImage = { id: string; image_url: string };

export default function HeroImagesManager({ initial }: { initial: HeroImage[] }) {
  const [images, setImages] = useState(initial);
  const [pending, startTransition] = useTransition();

  return (
    <div className="card p-6">
      <h3 className="font-display text-sm font-bold text-ink">Homepage Hero Carousel</h3>
      <p className="mt-1 text-sm text-ink-soft">
        Images shown in rotation on the homepage hero. Upload to add — order shown below is the
        rotation order.
      </p>

      <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((img) => (
          <div key={img.id} className="group relative aspect-square overflow-hidden rounded-lg bg-tint">
            <Image src={img.image_url} alt="" fill className="object-cover" />
            <button
              onClick={() =>
                startTransition(async () => {
                  const result = await removeHeroImage(img.id);
                  if (result.ok) {
                    setImages((imgs) => imgs.filter((i) => i.id !== img.id));
                    showToast("Hero image removed.");
                  } else {
                    showToast(result.error, "error");
                  }
                })
              }
              className="absolute right-1 top-1 rounded-full bg-white p-1.5 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X size={13} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <ImageUploader
          images={[]}
          onChange={(imgs) => {
            const url = imgs[0];
            if (!url) return;
            startTransition(async () => {
              const result = await addHeroImage(url);
              if (result.ok) {
                setImages((i) => [...i, { id: crypto.randomUUID(), image_url: url }]);
                showToast("Hero image added.");
              } else {
                showToast(result.error, "error");
              }
            });
          }}
          multiple={false}
        />
      </div>
    </div>
  );
}
