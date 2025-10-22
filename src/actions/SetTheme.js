import themeSwitcher from '../utils/minimal-theme-switcher.js';
import debugLog from '../utils/debugLog.js';

export default class SetTheme {
  static execute(store, theme) {
    // Validate theme value
    const validThemes = ['auto', 'light', 'dark'];
    if (!validThemes.includes(theme)) {
      debugLog("Invalid theme:", theme, "Valid themes are:", validThemes);
      return;
    }

    // Set the theme using the theme switcher utility
    themeSwitcher.scheme = theme;
    
    // Update the store config
    store.config.currentTheme = theme;
    
    debugLog("Theme set to:", theme);
  }
}
