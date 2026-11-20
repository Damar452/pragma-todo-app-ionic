/** Uppercases the first character of `text` using the rules of `locale`. */
export function capitalize(text: string, locale?: string): string {
  return text.charAt(0).toLocaleUpperCase(locale) + text.slice(1);
}
