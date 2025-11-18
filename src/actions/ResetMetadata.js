import AutoTagger from "../utils/AutoTagger.js";
import debugLog from "../utils/debugLog.js";

/**
 * ResetMetadata action
 * Removes all tags, notes, and aliases from all chord relationships
 * and reruns AutoTagger to restore automatic tags
 */
export default class ResetMetadata {
  static execute(store) {
    debugLog('ResetMetadata: Starting metadata reset...');

    let resetCount = 0;

    // Get chord relationships - handle both .value (ref) and direct access
    const chordRelationships = store.chordRelationships?.value ?? store.chordRelationships;
    
    // Ensure it's an array
    if (!Array.isArray(chordRelationships)) {
      debugLog('ResetMetadata: chordRelationships is not an array, cannot reset');
      return;
    }

    // Clear tags, notes, and aliases from all chord relationships
    for (const cr of chordRelationships) {
      let wasReset = false;

      // Clear tags (but keep the array structure for AutoTagger to work with)
      if (Array.isArray(cr.tags) && cr.tags.length > 0) {
        cr.tags = [];
        wasReset = true;
      } else if (cr.tags !== null) {
        cr.tags = null;
        wasReset = true;
      }

      // Clear notes
      if (cr.notes !== null && cr.notes !== undefined && cr.notes !== '') {
        cr.notes = null;
        wasReset = true;
      }

      // Clear aliases
      if (Array.isArray(cr.aliases) && cr.aliases.length > 0) {
        cr.aliases = null;
        wasReset = true;
      } else if (cr.aliases !== null) {
        cr.aliases = null;
        wasReset = true;
      }

      if (wasReset) {
        resetCount++;
      }
    }

    debugLog(`ResetMetadata: Reset metadata for ${resetCount} chord relationships`);

    // Rerun AutoTagger to restore automatic tags
    AutoTagger.execute(store);

    debugLog('ResetMetadata: Metadata reset complete');
  }
}

