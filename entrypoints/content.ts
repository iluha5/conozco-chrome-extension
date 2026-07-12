import { FloatingAddButton } from '../utils/floating-button';
import { getSelectedWord, getSelectionRect, isSelectionInEditableField } from '../utils/selection';

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_idle',
  main() {
    const floatingButton = new FloatingAddButton();
    let selectedWord = '';

    function updateSelectionUi() {
      const selection = window.getSelection();

      if (!selection || selection.isCollapsed || isSelectionInEditableField(selection)) {
        floatingButton.hide();
        selectedWord = '';
        return;
      }

      const word = getSelectedWord(selection);
      const rect = getSelectionRect(selection);

      if (!word || !rect) {
        floatingButton.hide();
        selectedWord = '';
        return;
      }

      selectedWord = word;
      floatingButton.showAt(rect);
    }

    function handleMouseDown(event: MouseEvent) {
      if (!floatingButton.containsTarget(event)) {
        floatingButton.hide();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        floatingButton.hide();
        window.getSelection()?.removeAllRanges();
      }
    }

    function handleAddClick() {
      if (!selectedWord) {
        return;
      }

      void floatingButton.handleQuickAdd(selectedWord);
    }

    document.addEventListener('mouseup', updateSelectionUi);
    document.addEventListener('keyup', updateSelectionUi);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('scroll', () => floatingButton.hide(), true);

    floatingButton.setClickHandler(handleAddClick);
  },
});
