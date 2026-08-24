export const ENE_WHATSAPP_NUMBER = '923063999363';

export function buildWhatsAppUrl(message?: string): string {
  const url = `https://wa.me/${ENE_WHATSAPP_NUMBER}`;
  return message ? `${url}?text=${encodeURIComponent(message)}` : url;
}
