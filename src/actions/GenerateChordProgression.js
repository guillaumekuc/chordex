import Triads from '../theory/Triads.js';

export default class GenerateChordProgression {

	static execute(store) {
		const selection=store.selected;
		const chordsCount= store.generator.slots; //number
		const results=[];



		//forward direction, fill from first chord to last chord
		let rootQuality=null;
		for (let i=0; i < chordsCount; i++){
			const newChord=pickRandomCRFromSelection(selection, rootQuality);
			if (newChord === null) {
				console.log('invalid selection');
				break;
			}
			results.push(newChord);
			
			rootQuality=newChord.targetQuality;
		}

		store.generator.progression = results;
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
