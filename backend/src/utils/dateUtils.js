export const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
}