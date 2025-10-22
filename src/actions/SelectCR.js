import debugLog from '../utils/debugLog.js';

export default class SelectCR {
  static execute(store, entry) {
    if (store.selected?.uid === entry.uid) {
      // Deselect if clicking the same CR
      entry.selected = false;
      store.selected = null;
      debugLog("CR deselected:", entry.label, "UID:", entry.uid);
    } else {
      // Deselect previous selection if exists
      if (store.selected) {
        store.selected.selected = false;
      }
      // Select new CR
      entry.selected = true;
      store.selected = entry;
      debugLog("CR selected:", entry.label, "UID:", entry.uid);
    }
  }

  static deselect(store) {
    if (store.selected) {
      store.selected.selected = false;
      debugLog("CR deselected:", store.selected.label, "UID:", store.selected.uid);
      store.selected = null;
    }
  }
}
