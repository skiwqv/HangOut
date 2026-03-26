export function autoResize(event: Event) {
  const target = event.target as HTMLTextAreaElement;
  // Сначала сбрасываем высоту
  target.style.height = 'auto';
  // Затем задаем высоту равную реальной высоте контента внутри
  target.style.height = `${target.scrollHeight}px`;
}