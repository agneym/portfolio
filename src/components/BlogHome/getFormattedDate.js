export function getFormattedDate(date) {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString();
}
