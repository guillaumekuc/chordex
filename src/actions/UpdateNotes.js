import debugLog from '../utils/debugLog.js';

export default class UpdateNotes {
  static execute(store, value) {
    if (!store.selected) {
      debugLog("No CR selected, cannot update notes");
      return;
    }

    store.selected.notes = value;
    debugLog("Updated notes for CR:", store.selected.label, "Notes:", value);
  }
}
