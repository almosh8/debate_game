export const getContrastColor = (hexColor: string): string => {
  // Удаляем # если есть
  const hex = hexColor.replace('#', '');
  
  // Конвертируем в RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Считаем яркость по формуле YIQ
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  
  // Возвращаем черный для светлых цветов, белый для темных
  return yiq >= 128 ? 'black' : 'white';
};