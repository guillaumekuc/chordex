import debugLog from '../utils/debugLog.js';
import Search from './Search.js';

export default class ResetFilters {
  static execute(store) {
    const defaultFilters = Search.defaultFilters(store);
    Object.assign(store.activeFilters, defaultFilters);
    debugLog("Reset all search filters");
  }
}
