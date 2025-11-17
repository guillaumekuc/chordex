import Triads from '../theory/Triads.js';

export default class GenerateChordProgression {

	static execute(store) {
		const selection=store.selected;
		const filteredSelection = analyzeSelection(selection);
		const chordsCount= store.generator.slots; //number
		const results=[];

		if (filteredSelection === null) {
			console.log('invalid selection');
			return;
		}

		//forward direction, fill from first chord to last chord
		let rootQuality=null;
		for (let i=0; i < chordsCount; i++){
			const newChord=pickRandomCRFromSelection(filteredSelection, rootQuality);
			if (newChord === null) {
				console.log('invalid selection');
				break;
			}
			results.push(newChord);
			
			rootQuality=newChord.targetQuality;
		}

		store.generator.progression = results;
		console.log(results);

		function analyzeSelection(selection){
			if (!Array.isArray(selection) || selection.length === 0) {
				return null;
			}

			const leadsToNowhere=[];
			const unaccessible=[];
			const valids=[];

			//goal = to figure out before hand if we need more CR.

			const rootQualities = new Set();
			const targetQualities = new Set();

			for (const cr of selection) {
				if (cr && cr.rootQuality) {
					rootQualities.add(cr.rootQuality);
				}
				if (cr && cr.targetQuality) {
					targetQualities.add(cr.targetQuality);
				}
			}

			for (const cr of selection) {
				if (cr && cr.rootQuality && !targetQualities.has(cr.rootQuality)) {
					unaccessible.push(cr);
				}
			}

			for (const cr of selection) {
				if (cr && cr.targetQuality && !rootQualities.has(cr.targetQuality)) {
					leadsToNowhere.push(cr);
				}
			}
			for (const cr of selection) {
				const isUnaccessible = unaccessible.some(u => u.uid === cr.uid);
				const leadsNowhere = leadsToNowhere.some(l => l.uid === cr.uid);
				if (!isUnaccessible && !leadsNowhere) {
					valids.push(cr);
				}
			}

			if (leadsToNowhere.length > 0) {
				console.log('CRs that lead to nowhere:', leadsToNowhere.map(cr => cr.label || cr.uid));
			}
			if (unaccessible.length > 0) {
				console.log('Unaccessible CRs:', unaccessible.map(cr => cr.label || cr.uid));
			}
			if (valids.length === 0) {
				return null;
			}
			return valids;
		}

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
