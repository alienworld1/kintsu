export function generateWhatsAppLink(text: string, phone?: string): string {
  const encodedText = encodeURIComponent(text);
  
  if (phone) {
    // Clean phone number: remove non-digits
    const cleanPhone = phone.replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodedText}`;
  }
  
  return `https://wa.me/?text=${encodedText}`;
}
