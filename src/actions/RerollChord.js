import Triads from '../theory/Triads.js';
import * as Common from '../theory/common.js';

export default class RerollChord {
	static execute(store, index) {
		const filteredSelection = getFilteredSelection(store);
		const progression = store.generator.progression;
		
		if (!isValidInput(progression, index, filteredSelection)) {
			return;
		}
		
		// Calculate initial root pitch class for the rerolled index
		let currentRootPitchClass = calculateRootPitchClass(store.generator.root, progression, index);
		
		// Loop from the rerolled index to the end, using the same logic for all chords
		for (let i = index; i < progression.length; i++) {
			const rootQuality = getRootQualityForIndex(progression, i);
			const chordRelationship = pickRandomCRFromSelection(filteredSelection, rootQuality);
			
			if (!chordRelationship) {
				break;
			}
			
			// Create and update the chord at this index
			const chord = Triads.fromChordRelationship(currentRootPitchClass, chordRelationship);
			progression[i] = {
				chord: chord,
				chordRelationship: chordRelationship
			};
			
			// Calculate root pitch class for the next iteration
			currentRootPitchClass = Common.modulo12(currentRootPitchClass + chordRelationship.pitchClass);
		}
		
		// Trigger reactivity by reassigning the array
		store.generator.progression = [...progression];
	}
}

/**
 * Gets the filtered selection of valid chord relationships from the store
 * @param {Object} store - The Pinia store instance
 * @returns {Array|null} - Array of valid chord relationships or null
 */
function getFilteredSelection(store) {
	const analysisResult = store.selectionAnalysis;
	return analysisResult?.valids || null;
}

/**
 * Validates that the input parameters are valid for rerolling
 * @param {Array} progression - The current chord progression
 * @param {number} index - The index of the chord to reroll
 * @param {Array|null} filteredSelection - The filtered selection of valid chord relationships
 * @returns {boolean} - True if input is valid, false otherwise
 */
function isValidInput(progression, index, filteredSelection) {
	if (!progression || progression.length === 0) {
		return false;
	}
	
	if (index < 0 || index >= progression.length) {
		return false;
	}
	
	if (!Array.isArray(filteredSelection)) {
		return false;
	}
	
	return true;
}

/**
 * Gets the root quality required for the chord at the given index
 * @param {Array} progression - The current chord progression
 * @param {number} index - The index of the chord to reroll
 * @returns {string|null} - The root quality or null if it's the first chord
 */
function getRootQualityForIndex(progression, index) {
	if (index === 0) {
		return null;
	}
	return progression[index - 1].chordRelationship.targetQuality;
}

/**
 * Calculates the root pitch class for a chord at a specific index
 * @param {number} baseRoot - The base root note from generator config
 * @param {Array} progression - The current chord progression
 * @param {number} index - The index to calculate root pitch class for
 * @returns {number} - The calculated root pitch class
 */
function calculateRootPitchClass(baseRoot, progression, index) {
	let rootPitchClass = baseRoot % 12;
	
	for (let i = 0; i < index; i++) {
		const pitchClass = progression[i].chordRelationship.pitchClass;
		rootPitchClass = Common.modulo12(rootPitchClass + pitchClass);
	}
	
	return rootPitchClass;
}

/**
 * Picks a random chord relationship from the selection that matches the root quality
 * @param {Array} selection - Array of valid chord relationships
 * @param {string|null} rootQuality - The required root quality, or null for any
 * @returns {Object|null} - A random chord relationship or null if none found
 */
function pickRandomCRFromSelection(selection, rootQuality) {
	if (!isValidRootQuality(rootQuality)) {
		return null;
	}
	
	if (!Array.isArray(selection)) {
		return null;
	}
	
	const filtered = filterByRootQuality(selection, rootQuality);
	
	if (filtered.length === 0) {
		return null;
	}
	
	const randomIndex = Math.floor(Math.random() * filtered.length);
	return filtered[randomIndex];
}

/**
 * Checks if a root quality is valid
 * @param {string|null|undefined} rootQuality - The root quality to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidRootQuality(rootQuality) {
	if (rootQuality === null || rootQuality === undefined) {
		return true;
	}
	return Triads.types[rootQuality] !== undefined;
}

/**
 * Filters chord relationships by root quality
 * @param {Array} selection - Array of chord relationships
 * @param {string|null} rootQuality - The root quality to filter by, or null for all
 * @returns {Array} - Filtered array of chord relationships
 */
function filterByRootQuality(selection, rootQuality) {
	if (rootQuality === null || rootQuality === undefined) {
		return selection;
	}
	return selection.filter(item => item.rootQuality === rootQuality);
}
