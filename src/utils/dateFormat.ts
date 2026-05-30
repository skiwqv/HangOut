// dateFormatter.js

export function formatToHumanDate(dateString:string): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Некорректная дата';

  // 1. Получаем текущую дату
  const now = new Date();

  // 2. Отбрасываем время у обеих дат, чтобы сравнивать только календарные дни
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  // 3. Вычисляем разницу в днях
  const diffTime = targetDate - today;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  // Форматируем время (оно нам понадобится в любом случае: "17:59")
  const timeString = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit', 
    minute: '2-digit'
  }).format(date);

  // 4. Проверяем: вчера (-1), сегодня (0), завтра (1)
  if (diffDays >= -1 && diffDays <= 1) {
    // numeric: 'auto' заменяет "0 дней назад" на "сегодня"
    const rtf = new Intl.RelativeTimeFormat('ru-RU', { numeric: 'auto' });
    const relativeWord = rtf.format(diffDays, 'day'); 
    
    // Делаем первую букву заглавной (вчера -> Вчера)
    const capitalizedWord = relativeWord.charAt(0).toUpperCase() + relativeWord.slice(1);

    // Возвращаем формат: "Сегодня в 17:59"
    return `${capitalizedWord} в ${timeString}`;
  }

  // 5. Если это обычный день (например, 5 дней назад или в следующем году)
  const dateStringFormatted = new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);

  // Возвращаем формат: "31 марта 2026 г., 17:59"
  return `${dateStringFormatted}, ${timeString}`;
}