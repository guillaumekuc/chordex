import debugLog from "../utils/debugLog.js";

export default class AddTag {
  static execute(store, value) {
    if (!store.selected) {
      debugLog("No CR selected, cannot add tag");
      return;
    }

    // Ensure tags array exists
    if (!store.selected.tags) {
      store.selected.tags = [];
    }

    const trimmedValue = value.trim();
    if (trimmedValue && !store.selected.tags.includes(trimmedValue)) {
      store.selected.tags.push(trimmedValue);
      debugLog("Added tag:", trimmedValue, "to CR:", store.selected.label);
    }
  }
}
