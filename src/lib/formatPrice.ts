/**
 * Format price in Japanese Yen
 * @param price - Price in Yen
 * @returns Formatted string like "¥5,000万" or "¥1.5億"
 */
export const formatPrice = (price: number): string => {
  // 億 (oku) = 100,000,000 (100 million)
  // 万 (man) = 10,000 (10 thousand)
  
  if (price >= 100000000) {
    const oku = price / 100000000;
    if (oku >= 10) {
      return `¥${Math.round(oku)}億`;
    }
    return `¥${oku.toFixed(1)}億`;
  }
  
  if (price >= 10000) {
    const man = price / 10000;
    return `¥${Math.round(man).toLocaleString()}万`;
  }
  
  return `¥${price.toLocaleString()}`;
};

/**
 * Format date in Japanese locale
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
