import { useRef, useState } from "react";
import { HiOutlineTrash, HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi";
import api from "../../api/client";

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  max?: number;
}

// Uploads any number of images to Cloudinary (via /upload/image) and manages
// an ordered list of URLs. The first image is the primary/card image.
export default function MultiImageUploader({ value, onChange, label = "Images", max = 8 }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setError("");
    setUploading(true);
    const uploaded: string[] = [];
    try {
      for (const file of files.slice(0, max - value.length)) {
        const fd = new FormData();
        fd.append("image", file);
        const res = await api.post<{ url: string }>("/upload/image", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploaded.push(res.data.url);
      }
      onChange([...value, ...uploaded]);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(message || "Upload failed");
      if (uploaded.length) onChange([...value, ...uploaded]);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-brand-slate">{label}</p>
        <span className="text-[11px] text-brand-muted">{value.length}/{max}</span>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {value.map((url, i) => (
            <div key={url} className="group relative aspect-square rounded-lg overflow-hidden border border-brand-border">
              <img src={url} alt="" className="w-full h-full object-cover" />
              {i === 0 && (
                <span className="absolute top-1 left-1 bg-brand-primary text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
                  Main
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity">
                <button type="button" onClick={() => move(i, -1)} className="p-1 text-white disabled:opacity-30" disabled={i === 0} aria-label="Move left">
                  <HiOutlineArrowLeft className="text-xs" />
                </button>
                <button type="button" onClick={() => remove(i)} className="p-1 text-white" aria-label="Remove">
                  <HiOutlineTrash className="text-xs" />
                </button>
                <button type="button" onClick={() => move(i, 1)} className="p-1 text-white disabled:opacity-30" disabled={i === value.length - 1} aria-label="Move right">
                  <HiOutlineArrowRight className="text-xs" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {value.length < max && (
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFiles}
          disabled={uploading}
          className="text-xs text-brand-slate file:mr-3 file:rounded-full file:border-0 file:bg-brand-tint file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-brand-primary file:transition-colors hover:file:bg-brand-primary hover:file:text-white"
        />
      )}
      {uploading && <p className="text-xs text-brand-primary">Uploading…</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
