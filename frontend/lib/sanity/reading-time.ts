const WORDS_PER_MINUTE = 200;

export function calculateReadingTime(content: string | unknown): number {
  const text = typeof content === 'string' ? content : extractText(content);
  const wordCount = text.trim() ? text.trim().split(/\s+/u).length : 0;

  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

function extractText(value: unknown): string {
  if (!value) return '';

  if (Array.isArray(value)) {
    return value.map(extractText).join(' ');
  }

  if (typeof value !== 'object') return '';

  const record = value as Record<string, unknown>;

  if (record._type === 'span' && typeof record.text === 'string') {
    return record.text;
  }

  if (record._type === 'table') {
    return [record.headers, record.rows].map(extractText).join(' ');
  }

  if (record._type === 'articleImage' && typeof record.caption === 'string') {
    return record.caption;
  }

  return extractText(record.children ?? record.cells);
}

