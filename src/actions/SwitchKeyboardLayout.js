import debugLog from '../utils/debugLog.js';

export default class SwitchKeyboardLayout {
  static execute(store) {
    const currentLayout = store.config.keyboardLayout;
    
    switch (currentLayout) {
      case "x75":
        store.config.keyboardLayout = "x66";
        store.config.keyboardColors = "x66";
        debugLog("Switched to 6/6 isomorphic keyboard layout");
        break;
      case "x66":
        store.config.keyboardLayout = "x75";
        store.config.keyboardColors = "x75";
        debugLog("Switched to 7/5 standard keyboard layout");
        break;
      default:
        // Default to x75 if unknown layout
        store.config.keyboardLayout = "x75";
        store.config.keyboardColors = "x75";
        debugLog("Unknown layout, defaulted to 7/5 standard keyboard layout");
        break;
    }
  }
}
