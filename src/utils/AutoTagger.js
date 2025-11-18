import Scales from "../theory/Scales.js";
import debugLog from "./debugLog.js";

/**
 * AutoTagger utility
 * Automatically assigns tags to chord relationships based on various criteria
 * Run after chord relationships are initialized and mapped to scales
 */
export default class AutoTagger {

	/**
	 * Main entry point - runs all tagging sub-methods
	 * @param {Object} store - The Pinia store instance
	 */
	static execute(store) {
		debugLog('AutoTagger: Starting automatic tagging...');
		
		this.addDiatonicTags(store);
		this.addHarmonicMinorTags(store);
		this.addMelodicMinorTags(store);
		this.addLighterDarkerTags(store);
		
		debugLog('AutoTagger: Automatic tagging complete');
	}

	/**
	 * Adds "diatonic" tag to chord relationships attached to scales
	 * that are direct modes of the Major scale (at base level, fifthsOffset = 0)
	 * @param {Object} store - The Pinia store instance
	 */
	static addDiatonicTags(store) {
		// Create a Set of the 7 direct mode labels from the Major scale
		// These are the base level modes (fifthsOffset = 0), not the modulated versions
		const diatonicScaleLabels = new Set();
		for (const mode of Scales.parents.major.modes) {
			diatonicScaleLabels.add(mode.label);
		}

		// Create a map of scale labels to scale objects for quick lookup
		const scaleMap = new Map();
		for (const scale of Scales.all) {
			scaleMap.set(scale.label, scale);
		}

		let taggedCount = 0;

		// Get chord relationships - handle both .value (ref) and direct access
		const chordRelationships = store.chordRelationships?.value ?? store.chordRelationships;
		
		// Ensure it's an array
		if (!Array.isArray(chordRelationships)) {
			debugLog('AutoTagger: chordRelationships is not an array, skipping tagging');
			return;
		}

		// Work with the store's chord relationships (which are persisted)
		for (const cr of chordRelationships) {
			// Initialize tags array if null
			if (!cr.tags) {
				cr.tags = [];
			}

			// Check if this CR is attached to any diatonic scales (direct Major modes at base level)
			if (Array.isArray(cr.scales) && cr.scales.length > 0) {
				const hasDiatonicScale = cr.scales.some(scaleLabel => {
					const scale = scaleMap.get(scaleLabel);
					// Check if it's one of the 7 direct modes AND at base level (fifthsOffset = 0)
					return scale && 
					       diatonicScaleLabels.has(scale.label) && 
					       scale.fifthsOffset === 0;
				});

				if (hasDiatonicScale && !cr.tags.includes('diatonic')) {
					cr.tags.push('diatonic');
					taggedCount++;
				}
			}
		}

		debugLog(`AutoTagger: Added "diatonic" tag to ${taggedCount} chord relationships`);
	}

	/**
	 * Adds "harmonic-minor" tag to chord relationships attached to scales
	 * that are direct modes of the Harmonic Minor scale (at base level, fifthsOffset = 0)
	 * @param {Object} store - The Pinia store instance
	 */
	static addHarmonicMinorTags(store) {
		// Create a Set of the 7 direct mode labels from the Harmonic Minor scale
		// These are the base level modes (fifthsOffset = 0), not the modulated versions
		const harmonicMinorScaleLabels = new Set();
		for (const mode of Scales.parents.harmonicMinor.modes) {
			harmonicMinorScaleLabels.add(mode.label);
		}

		// Create a map of scale labels to scale objects for quick lookup
		const scaleMap = new Map();
		for (const scale of Scales.all) {
			scaleMap.set(scale.label, scale);
		}

		let taggedCount = 0;

		// Get chord relationships - handle both .value (ref) and direct access
		const chordRelationships = store.chordRelationships?.value ?? store.chordRelationships;
		
		// Ensure it's an array
		if (!Array.isArray(chordRelationships)) {
			debugLog('AutoTagger: chordRelationships is not an array, skipping harmonic minor tagging');
			return;
		}

		// Work with the store's chord relationships (which are persisted)
		for (const cr of chordRelationships) {
			// Initialize tags array if null
			if (!cr.tags) {
				cr.tags = [];
			}

			// Check if this CR is attached to any harmonic minor scales (direct Harmonic Minor modes at base level)
			if (Array.isArray(cr.scales) && cr.scales.length > 0) {
				const hasHarmonicMinorScale = cr.scales.some(scaleLabel => {
					const scale = scaleMap.get(scaleLabel);
					// Check if it's one of the 7 direct modes AND at base level (fifthsOffset = 0)
					return scale && 
					       harmonicMinorScaleLabels.has(scale.label) && 
					       scale.fifthsOffset === 0;
				});

				if (hasHarmonicMinorScale && !cr.tags.includes('harmonic-minor')) {
					cr.tags.push('harmonic-minor');
					taggedCount++;
				}
			}
		}

		debugLog(`AutoTagger: Added "harmonic-minor" tag to ${taggedCount} chord relationships`);
	}

	/**
	 * Adds "melodic-minor" tag to chord relationships attached to scales
	 * that are direct modes of the Melodic Minor scale (at base level, fifthsOffset = 0)
	 * @param {Object} store - The Pinia store instance
	 */
	static addMelodicMinorTags(store) {
		// Create a Set of the 7 direct mode labels from the Melodic Minor scale
		// These are the base level modes (fifthsOffset = 0), not the modulated versions
		const melodicMinorScaleLabels = new Set();
		for (const mode of Scales.parents.melodicMinor.modes) {
			melodicMinorScaleLabels.add(mode.label);
		}

		// Create a map of scale labels to scale objects for quick lookup
		const scaleMap = new Map();
		for (const scale of Scales.all) {
			scaleMap.set(scale.label, scale);
		}

		let taggedCount = 0;

		// Get chord relationships - handle both .value (ref) and direct access
		const chordRelationships = store.chordRelationships?.value ?? store.chordRelationships;
		
		// Ensure it's an array
		if (!Array.isArray(chordRelationships)) {
			debugLog('AutoTagger: chordRelationships is not an array, skipping melodic minor tagging');
			return;
		}

		// Work with the store's chord relationships (which are persisted)
		for (const cr of chordRelationships) {
			// Initialize tags array if null
			if (!cr.tags) {
				cr.tags = [];
			}

			// Check if this CR is attached to any melodic minor scales (direct Melodic Minor modes at base level)
			if (Array.isArray(cr.scales) && cr.scales.length > 0) {
				const hasMelodicMinorScale = cr.scales.some(scaleLabel => {
					const scale = scaleMap.get(scaleLabel);
					// Check if it's one of the 7 direct modes AND at base level (fifthsOffset = 0)
					return scale && 
					       melodicMinorScaleLabels.has(scale.label) && 
					       scale.fifthsOffset === 0;
				});

				if (hasMelodicMinorScale && !cr.tags.includes('melodic-minor')) {
					cr.tags.push('melodic-minor');
					taggedCount++;
				}
			}
		}

		debugLog(`AutoTagger: Added "melodic-minor" tag to ${taggedCount} chord relationships`);
	}

	/**
	 * Adds "lighter" and "darker" tags to chord relationships based on their
	 * major-derived scales' fifths offsets
	 * @param {Object} store - The Pinia store instance
	 */
	static addLighterDarkerTags(store) {
		// Create a map of scale labels to scale objects for quick lookup
		const scaleMap = new Map();
		for (const scale of Scales.all) {
			scaleMap.set(scale.label, scale);
		}

		let lighterCount = 0;
		let darkerCount = 0;

		// Get chord relationships - handle both .value (ref) and direct access
		const chordRelationships = store.chordRelationships?.value ?? store.chordRelationships;
		
		// Ensure it's an array
		if (!Array.isArray(chordRelationships)) {
			debugLog('AutoTagger: chordRelationships is not an array, skipping lighter/darker tagging');
			return;
		}

		// Work with the store's chord relationships (which are persisted)
		for (const cr of chordRelationships) {
			// Initialize tags array if null
			if (!cr.tags) {
				cr.tags = [];
			}

			// Get all major-derived scales for this chord relationship
			if (Array.isArray(cr.scales) && cr.scales.length > 0) {
				const majorScales = cr.scales
					.map(scaleLabel => scaleMap.get(scaleLabel))
					.filter(scale => scale && scale.parent === 'Major');

				// Only proceed if there are major-derived scales
				if (majorScales.length > 0) {
					const fifthsOffsets = majorScales.map(scale => scale.fifthsOffset);
					const hasPlus6 = fifthsOffsets.includes(6);
					const hasMinus6 = fifthsOffsets.includes(-6);

					// Handle the +6/-6 equivalence (they're the same due to the looping circle of fifths)
					// For "lighter": if -6 is present, exclude it and check if all others are >= 0
					// (treating -6 as equivalent to +6 in a lighter context)
					let allLighter = false;
					if (hasMinus6) {
						const offsetsWithoutMinus6 = fifthsOffsets.filter(offset => offset !== -6);
						allLighter = offsetsWithoutMinus6.length > 0 && offsetsWithoutMinus6.every(offset => offset >= 0);
					} else {
						allLighter = fifthsOffsets.every(offset => offset >= 0);
					}

					// For "darker": if +6 is present, exclude it and check if all others are <= 0
					// (treating +6 as equivalent to -6 in a darker context)
					let allDarker = false;
					if (hasPlus6) {
						const offsetsWithoutPlus6 = fifthsOffsets.filter(offset => offset !== 6);
						allDarker = offsetsWithoutPlus6.length > 0 && offsetsWithoutPlus6.every(offset => offset <= 0);
					} else {
						allDarker = fifthsOffsets.every(offset => offset <= 0);
					}

					if (allLighter && !cr.tags.includes('lighter')) {
						cr.tags.push('lighter');
						lighterCount++;
					}

					if (allDarker && !cr.tags.includes('darker')) {
						cr.tags.push('darker');
						darkerCount++;
					}
				}
			}
		}

		debugLog(`AutoTagger: Added "lighter" tag to ${lighterCount} chord relationships`);
		debugLog(`AutoTagger: Added "darker" tag to ${darkerCount} chord relationships`);
	}
}

