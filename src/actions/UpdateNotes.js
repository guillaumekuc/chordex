import debugLog from '../utils/debugLog.js';

export default class UpdateNotes {
  static execute(store, value) {
    const selected = Array.isArray(store.selected) && store.selected.length > 0 
      ? store.selected[store.selected.length - 1] 
      : null;
    
    if (!selected) {
      debugLog("No CR selected, cannot update notes");
      return;
    }

    selected.notes = value;
    debugLog("Updated notes for CR:", selected.label, "Notes:", value);
  }
}
