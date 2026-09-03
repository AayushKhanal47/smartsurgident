// Centralized WhatsApp contact configuration — every component that opens a
// wa.me link (the floating button, Contact page, dealer profiles) reads from
// here instead of hardcoding a number, so the admin number only lives in one
// place. Set VITE_WHATSAPP_ADMIN_NUMBER in frontend/.env (see .env.example).
export const ADMIN_WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_ADMIN_NUMBER || "977980XXXXXXX";

export function buildWhatsAppLink(rawNumber: string, message: string): string {
  const digits = rawNumber.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
