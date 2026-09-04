import { useRef, useState } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import api from "../../api/client";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

// Handles the actual multipart upload to the backend, which forwards it to
// Cloudinary and returns a URL. Used anywhere an admin form needs to attach
// a photo — product images, brand logos, dealer photos. The upload button
// stays visible after a value is set, so picking a new file always replaces
// the current one.
export default function ImageUploader({ value, onChange, label = "Image" }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await api.post<{ url: string }>("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(res.data.url);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(message || "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-brand-slate">{label}</p>
      <div className="flex items-center gap-4">
        <div className="group relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border border-brand-border bg-brand-tint">
          {value ? (
            <>
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onChange("")}
                className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                <HiOutlineTrash />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brand-muted text-[10px]">None</div>
          )}
        </div>
        <div className="flex flex-col items-start gap-1.5">
          <label className="inline-flex items-center gap-1.5 rounded-full bg-brand-tint px-3.5 py-1.5 text-xs font-medium text-brand-primary transition-colors hover:bg-brand-primary hover:text-white">
            {uploading ? "Uploading…" : value ? "Change image" : "Upload image"}
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}
