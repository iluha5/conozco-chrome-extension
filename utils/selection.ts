export const MAX_SELECTION_LENGTH = 100;

export function validateSelectionText(rawText: string): {
  valid: boolean;
  normalizedWord?: string;
} {
  const trimmed = rawText.trim();

  if (!trimmed) {
    return { valid: false };
  }

  if (trimmed.includes('\n') || trimmed.includes('\r')) {
    return { valid: false };
  }

  if (trimmed.length > MAX_SELECTION_LENGTH) {
    return { valid: false };
  }

  return {
    valid: true,
    normalizedWord: trimmed,
  };
}

export function getSelectedWord(selection: Selection): string | null {
  const rawText = selection.toString();
  const validation = validateSelectionText(rawText);

  if (!validation.valid || !validation.normalizedWord) {
    return null;
  }

  return validation.normalizedWord;
}

export function isSelectionInEditableField(selection: Selection): boolean {
  const anchorNode = selection.anchorNode;

  if (!anchorNode) {
    return false;
  }

  const element =
    anchorNode.nodeType === Node.ELEMENT_NODE ? (anchorNode as Element) : anchorNode.parentElement;

  if (!element) {
    return false;
  }

  return Boolean(
    element.closest('input, textarea, [contenteditable=""], [contenteditable="true"]'),
  );
}

export function getSelectionRect(selection: Selection): DOMRect | null {
  if (selection.rangeCount === 0) {
    return null;
  }

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  if (rect.width === 0 && rect.height === 0) {
    return null;
  }

  return rect;
}
