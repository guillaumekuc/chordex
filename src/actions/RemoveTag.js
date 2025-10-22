import debugLog from '../utils/debugLog.js';

export default class RemoveTag {
  static execute(store, value) {
    if (!store.selected) {
      debugLog("No CR selected, cannot remove tag");
      return;
    }

    if (!store.selected.tags) {
      store.selected.tags = [];
      return;
    }

    const trimmedValue = value.trim();
    const index = store.selected.tags.indexOf(trimmedValue);
    
    if (index !== -1) {
      store.selected.tags.splice(index, 1);
      debugLog("Removed tag:", trimmedValue, "from CR:", store.selected.label);
    } else {
      debugLog("Tag not found:", trimmedValue, "in CR:", store.selected.label);
    }
  }
}
