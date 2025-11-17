import debugLog from "../utils/debugLog.js";

export default class AddAlias {
  static execute(store, value) {
    const selected = Array.isArray(store.selected) && store.selected.length > 0 
      ? store.selected[store.selected.length - 1] 
      : null;
    
    if (!selected) {
      debugLog("No CR selected, cannot add alias");
      return;
    }

    // Ensure aliases array exists
    if (!selected.aliases) {
      selected.aliases = [];
    }

    const trimmedValue = value.trim();
    if (trimmedValue && !selected.aliases.includes(trimmedValue)) {
      selected.aliases.push(trimmedValue);
      debugLog("Added alias:", trimmedValue, "to CR:", selected.label);
    }
  }
}
