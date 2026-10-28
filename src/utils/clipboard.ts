export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  // 1. Try modern navigator.clipboard API
  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to fallback
    }
  }

  // 2. Fallback to hidden textarea execution
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}

export function calculateTextStats(text: string) {
  if (!text) {
    return { characters: 0, words: 0, readingTimeMinutes: 0 };
  }

  const characters = text.length;
  // Regex to match words in English, Urdu, or Roman Urdu
  const wordsArray = text.trim().split(/\s+/).filter(Boolean);
  const words = wordsArray.length;
  // Typical reading speed: ~200 words per minute
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

  return {
    characters,
    words,
    readingTimeMinutes,
  };
}
