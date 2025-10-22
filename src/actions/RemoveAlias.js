import debugLog from '../utils/debugLog.js';

export default class RemoveAlias {
  static execute(store, value) {
    if (!store.selected) {
      debugLog("No CR selected, cannot remove alias");
      return;
    }

    if (!store.selected.aliases) {
      store.selected.aliases = [];
      return;
    }

    const trimmedValue = value.trim();
    const index = store.selected.aliases.indexOf(trimmedValue);
    
    if (index !== -1) {
      store.selected.aliases.splice(index, 1);
      debugLog("Removed alias:", trimmedValue, "from CR:", store.selected.label);
    } else {
      debugLog("Alias not found:", trimmedValue, "in CR:", store.selected.label);
    }
  }
}
