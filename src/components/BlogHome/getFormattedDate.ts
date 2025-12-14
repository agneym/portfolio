export function getFormattedDate(date: string) {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString();
}
