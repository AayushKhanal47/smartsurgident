import { useRef, useState } from "react";
import api from "../../api/client";

interface PdfUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

// Same replace-in-place behavior as ImageUploader: the upload button stays
// visible once a PDF is set, so picking a new file replaces the current one.
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
      <p className="text-xs font-medium text-brand-slate">{label}</p>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 shrink-0 rounded-xl bg-brand-tint flex items-center justify-center text-brand-primary text-xs font-semibold">
          PDF
        </div>
        <div className="flex flex-col items-start gap-1.5 min-w-0">
          <label className="inline-flex items-center gap-1.5 rounded-full bg-brand-tint px-3.5 py-1.5 text-xs font-medium text-brand-primary transition-colors hover:bg-brand-primary hover:text-white">
            {uploading ? "Uploading…" : value ? "Change PDF" : "Upload PDF"}
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
          {value && (
            <div className="flex items-center gap-3">
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-brand-primary hover:text-brand-navy truncate"
              >
                Open uploaded PDF
              </a>
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-xs font-medium text-red-500 hover:text-red-600"
              >
                Remove
              </button>
            </div>
          )}
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}
