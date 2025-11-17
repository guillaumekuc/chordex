import Triads from './Triads.js';

export default class ChordProgressions {

	static analyzeSelectionConnectivity(selection) {
		if (!Array.isArray(selection) || selection.length === 0) {
			return {
				valids: null,
				unaccessible: [],
				leadsToNowhere: []
			};
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
			return {
				valids: null,
				unaccessible: unaccessible,
				leadsToNowhere: leadsToNowhere
			};
		}
		return {
			valids: valids,
			unaccessible: unaccessible,
			leadsToNowhere: leadsToNowhere
		};
	}
}

