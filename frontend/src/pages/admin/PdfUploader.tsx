import { useRef, useState } from "react";
import api from "../../api/client";

interface PdfUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function PdfUploader({ value, onChange, label = "PDF file" }: PdfUploaderProps) {
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
      formData.append("pdf", file);
      const res = await api.post<{ url: string }>("/upload/pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(res.data.url);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(message || "PDF upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-brand-muted">{label}</p>
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-xl bg-brand-tint flex items-center justify-center text-brand-primary text-xs font-semibold">
          PDF
        </div>
        <div className="min-w-0">
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={uploading}
            className="text-xs"
          />
          {uploading && <p className="text-xs text-brand-primary mt-1">Uploading...</p>}
          {value && (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xs text-brand-primary font-medium mt-1 hover:text-brand-navy"
            >
              Open uploaded PDF
            </a>
          )}
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
      </div>
    </div>
  );
}
