import debugLog from '../utils/debugLog.js';

export default class AddAlias {
  static execute(store, value) {
    if (!store.selected) {
      debugLog("No CR selected, cannot add alias");
      return;
    }

    // Ensure aliases array exists
    if (!store.selected.aliases) {
      store.selected.aliases = [];
    }

    const trimmedValue = value.trim();
    if (trimmedValue && !store.selected.aliases.includes(trimmedValue)) {
      store.selected.aliases.push(trimmedValue);
      debugLog("Added alias:", trimmedValue, "to CR:", store.selected.label);
    }
  }

}
