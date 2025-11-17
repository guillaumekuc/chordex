import Triads from '../theory/Triads.js';
import * as Common from '../theory/common.js';

export default class GenerateChordProgression {

	static execute(store) {
		// Use the reactively computed analysis from the store
		const analysisResult = store.selectionAnalysis;
		const filteredSelection = analysisResult.valids;
		const chordsCount= store.generator.slots; //number
		
		// Clear progression array first to ensure fresh start
		store.generator.progression = [];
		
		if (filteredSelection === null) {
			console.log('invalid selection');
			return;
		}

		const results=[];
		//forward direction, fill from first chord to last chord
		let rootQuality=null;
		let currentRootPitchClass = store.generator.root % 12; // Start with root note from config
		
		for (let i=0; i < chordsCount; i++){
			const chordRelationship=pickRandomCRFromSelection(filteredSelection, rootQuality);
			if (chordRelationship === null) {
				console.log('invalid selection');
				break;
			}
			
			// Create chord object using helper method
			const chord = Triads.fromChordRelationship(currentRootPitchClass, chordRelationship);
			
			results.push({
				chord: chord,
				chordRelationship: chordRelationship
			});
			
			// Calculate next root pitch class: current root + interval (pitchClass) of the CR
			currentRootPitchClass = Common.modulo12(currentRootPitchClass + chordRelationship.pitchClass);
			rootQuality=chordRelationship.targetQuality;
		}

		// Assign new array to ensure Vue reactivity picks it up
		store.generator.progression = [...results];
		console.log(results);

		function pickRandomCRFromSelection(selection, rootQuality, targetQuality){
			if (rootQuality !== null && rootQuality !== undefined && !Triads.types[rootQuality]) {
				return null;
			}
			if (targetQuality !== null && targetQuality !== undefined && !Triads.types[targetQuality]) {
				return null;
			}
			if (!Array.isArray(selection)) {
				return null;
			}
			for (const item of selection) {
				if (typeof item !== 'object' || item === null) {
					return null;
				}
				if (!('rootQuality' in item) || !('targetQuality' in item) || !('pitchClass' in item)) {
					return null;
				}
			}

			let filtered = selection;
			if (rootQuality !== null && rootQuality !== undefined) {
				filtered = filtered.filter(item => item.rootQuality === rootQuality);
			}
			if (targetQuality !== null && targetQuality !== undefined) {
				filtered = filtered.filter(item => item.targetQuality === targetQuality);
			}

			if (filtered.length === 0) {
				return null;
			}

			const randomIndex = Math.floor(Math.random() * filtered.length);
			const randomItem = filtered[randomIndex];

			return randomItem;
		}
	}
	
}
