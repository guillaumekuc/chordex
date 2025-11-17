import debugLog from '../utils/debugLog.js';

export default class SelectCR {
  static execute(store, entry) {
    // Ensure selected is an array
    if (!Array.isArray(store.selected)) {
      store.selected = [];
    }

    // Find if entry is already in selection
    const index = store.selected.findIndex(cr => cr.uid === entry.uid);
    
    if (index !== -1) {
      // Remove from selection if already selected
      entry.selected = false;
      store.selected.splice(index, 1);
      debugLog("CR deselected:", entry.label, "UID:", entry.uid);
    } else {
      // Add to selection as last item
      entry.selected = true;
      store.selected.push(entry);
      debugLog("CR selected:", entry.label, "UID:", entry.uid);
    }
  }

  static deselect(store) {
    if (Array.isArray(store.selected) && store.selected.length > 0) {
      const lastSelected = store.selected[store.selected.length - 1];
      lastSelected.selected = false;
      debugLog("CR deselected:", lastSelected.label, "UID:", lastSelected.uid);
      store.selected.pop();
    }
  }
}
