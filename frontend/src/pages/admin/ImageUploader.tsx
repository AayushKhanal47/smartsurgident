import { useRef, useState } from "react";
import api from "../../api/client";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

// Handles the actual multipart upload to the backend, which forwards it to
// Cloudinary and returns a URL. Used anywhere an admin form needs to attach
// a photo — product images, brand logos, dealer photos.
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
      const res = await api.post<{ url: string }>("/upload", formData, {
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
      <p className="text-xs text-brand-muted">{label}</p>
      <div className="flex items-center gap-3">
        {value ? (
          <img src={value} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-slate-200" />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-brand-tint flex items-center justify-center text-brand-muted text-xs">
            None
          </div>
        )}
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            disabled={uploading}
            className="text-xs"
          />
          {uploading && <p className="text-xs text-brand-blue mt-1">Uploading...</p>}
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
      </div>
    </div>
  );
}
