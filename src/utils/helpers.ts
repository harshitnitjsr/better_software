export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString();
}

export function truncate(text: string, length = 50): string {
  return text.length > length ? text.slice(0, length) + "..." : text;
}
