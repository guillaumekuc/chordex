import debugLog from '../utils/debugLog.js';

export default class RemoveAlias {
  static execute(store, value) {
    const selected = Array.isArray(store.selected) && store.selected.length > 0 
      ? store.selected[store.selected.length - 1] 
      : null;
    
    if (!selected) {
      debugLog("No CR selected, cannot remove alias");
      return;
    }

    if (!selected.aliases) {
      selected.aliases = [];
      return;
    }

    const trimmedValue = value.trim();
    const index = selected.aliases.indexOf(trimmedValue);
    
    if (index !== -1) {
      selected.aliases.splice(index, 1);
      debugLog("Removed alias:", trimmedValue, "from CR:", selected.label);
    } else {
      debugLog("Alias not found:", trimmedValue, "in CR:", selected.label);
    }
  }
}
