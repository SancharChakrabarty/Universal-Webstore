"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";

export default function TagInput({
  tags,
  onChange,
  placeholder,
  type = "text",
}: {
  tags: (string | number)[];
  onChange: (tags: (string | number)[]) => void;
  placeholder?: string;
  type?: "text" | "number";
}) {
  const [draft, setDraft] = useState("");

  const commit = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;

    const value = type === "number" ? Number(trimmed) : trimmed;
    if (type === "number" && Number.isNaN(value as number)) {
      setDraft("");
      return;
    }
    if (tags.includes(value)) {
      setDraft("");
      return;
    }
    onChange([...tags, value]);
    setDraft("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && draft === "" && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeAt = (idx: number) => onChange(tags.filter((_, i) => i !== idx));

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-line px-3 py-2 focus-within:border-primary">
      {tags.map((tag, idx) => (
        <span
          key={`${tag}-${idx}`}
          className="flex items-center gap-1 rounded-pill bg-tint px-2.5 py-1 text-xs font-medium text-primary"
        >
          {tag}
          {type === "number" ? "mg" : ""}
          <button type="button" onClick={() => removeAt(idx)} aria-label={`Remove ${tag}`}>
            <X size={11} />
          </button>
        </span>
      ))}
      <input
        type="text"
        inputMode={type === "number" ? "numeric" : "text"}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="min-w-[100px] flex-1 text-sm outline-none"
      />
    </div>
  );
}
