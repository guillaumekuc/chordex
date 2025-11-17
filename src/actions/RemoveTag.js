import debugLog from '../utils/debugLog.js';

export default class RemoveTag {
  static execute(store, value) {
    const selected = Array.isArray(store.selected) && store.selected.length > 0 
      ? store.selected[store.selected.length - 1] 
      : null;
    
    if (!selected) {
      debugLog("No CR selected, cannot remove tag");
      return;
    }

    if (!selected.tags) {
      selected.tags = [];
      return;
    }

    const trimmedValue = value.trim();
    const index = selected.tags.indexOf(trimmedValue);
    
    if (index !== -1) {
      selected.tags.splice(index, 1);
      debugLog("Removed tag:", trimmedValue, "from CR:", selected.label);
    } else {
      debugLog("Tag not found:", trimmedValue, "in CR:", selected.label);
    }
  }
}
