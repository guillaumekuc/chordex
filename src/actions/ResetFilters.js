import debugLog from '../utils/debugLog.js';

export default class ResetFilters {
  static execute(store) {
    // Reset search query
    store.activeFilters.query = "";
    
    // Reset all filter arrays
    store.activeFilters.root = [];
    store.activeFilters.intervals = [];
    store.activeFilters.target = [];
    store.activeFilters.scales = [];
    store.activeFilters.commonTones = [];
    store.activeFilters.fifthsOffsets = [0]; // Default to 0
    
    debugLog("Reset all search filters");
  }
}
