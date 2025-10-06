export function parseDate(str: string) {
  const date = new Date(str);
  if (isNaN(date.valueOf())) return undefined;
  return date;
}
