import DOMPurify from 'dompurify';

/**
 * Sanitiza HTML para prevenir XSS
 * @param html - HTML a ser sanitizado
 * @returns HTML sanitizado e seguro
 */
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'code', 'pre', 'hr', 'div', 'span'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class', 'style'],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|ftp):\/\/|data:image\/)/i,
  });
};
