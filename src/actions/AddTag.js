import debugLog from "../utils/debugLog.js";

export default class AddTag {
  static execute(store, value) {
    const selected = Array.isArray(store.selected) && store.selected.length > 0 
      ? store.selected[store.selected.length - 1] 
      : null;
    
    if (!selected) {
      debugLog("No CR selected, cannot add tag");
      return;
    }

    // Ensure tags array exists
    if (!selected.tags) {
      selected.tags = [];
    }

    const trimmedValue = value.trim();
    if (trimmedValue && !selected.tags.includes(trimmedValue)) {
      selected.tags.push(trimmedValue);
      debugLog("Added tag:", trimmedValue, "to CR:", selected.label);
    }
  }
}
