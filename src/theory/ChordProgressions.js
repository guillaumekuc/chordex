import Triads from './Triads.js';
import * as Common from './common.js';

export default class ChordProgressions {

	static constructNotes(store, chordProgression) {
		if (!chordProgression || chordProgression.length === 0) {
			return chordProgression;
		}

		const baseRoot = store.generator.root;
		const progressionWithNotes = [];
		
		// Calculate root MIDI note for first chord
		let currentRootMidi = baseRoot;
		let previousChordNotes = null;

		for (let i = 0; i < chordProgression.length; i++) {
			const item = chordProgression[i];
			const chord = item.chord;
			const quality = chord.quality;
			
			// Get pitch classes for this chord quality
			const triadPitchClasses = Triads.types[quality].pitchClasses;
			
			// Find smoothest inversion if we have a previous chord
			let chordNotes;
			if (previousChordNotes !== null) {
				chordNotes = this.findSmoothestInversion(triadPitchClasses, currentRootMidi, previousChordNotes);
			} else {
				// First chord: use root position
				chordNotes = invert(triadPitchClasses, 0).map(pc => pc + currentRootMidi);
			}
			
			// Create new item with notes property
			const itemWithNotes = {
				...item,
				notes: chordNotes
			};
			
			progressionWithNotes.push(itemWithNotes);
			
			// Calculate root MIDI note for next chord
			if (i < chordProgression.length - 1) {
				const pitchClass = item.chordRelationship.pitchClass;
				// Add the pitch class interval to get the next root
				currentRootMidi = currentRootMidi + pitchClass;
				// Normalize to keep in reasonable MIDI range (0-127)
				if (currentRootMidi < 0) {
					currentRootMidi += 12 * Math.ceil(Math.abs(currentRootMidi) / 12);
				} else if (currentRootMidi > 127) {
					currentRootMidi -= 12 * Math.floor((currentRootMidi - 127) / 12);
				}
			}
			
			previousChordNotes = chordNotes;
		}
		
		return progressionWithNotes;
	}

	/**
	 * Finds the smoothest inversion for a chord based on previous chord notes
	 * @param {Array} triadPitchClasses - Pitch classes for the triad (e.g., [0, 4, 7])
	 * @param {number} rootMidi - Root MIDI note
	 * @param {Array} previousNotes - MIDI notes of previous chord
	 * @returns {Array} - MIDI notes for smoothest inversion
	 */
	static findSmoothestInversion(triadPitchClasses, rootMidi, previousNotes) {
		const inversions = {};
		const inversionsNearest = {};

		// Generate all 3 inversions
		for (let i = 0; i < 3; i++) {
			const invertedPitchClasses = invert(triadPitchClasses, i);
			inversions[i] = invertedPitchClasses.map(pc => pc + rootMidi);
			inversionsNearest[i] = inversions[i].map((pitchClass, index) => {
				return nearestPitch(previousNotes[index], pitchClass);
			});
		}

		// Find smoothest (least total distance)
		const smoothest = pickSmoothest(previousNotes, inversionsNearest);
		return smoothest.target;
	}

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

/**
 * Picks the inversion with the least total distance from previous chord
 */
function pickSmoothest(previousNotes, inversionsNearest) {
	const results = [];
	Object.values(inversionsNearest).forEach(inv => {
		const diffs = inv.map((note, index) => {
			return Math.abs(previousNotes[index] - note);
		});
		const sum = diffs.reduce((accumulator, current) => {
			return accumulator + current;
		}, 0);
		results.push({ target: inv, diffs: diffs, sum: sum });
	});

	const smoothest = results.reduce((best, current) => {
		return current.sum < best.sum ? current : best;
	});

	return smoothest;
}

/**
 * Finds nearest pitch in same octave range
 */
function nearestPitch(target, pc) {
	return pc + 12 * Math.round((target - pc) / 12);
}

/**
 * Inverts pitch classes
 */
function invert(pitchClasses, n) {
	const m = (n + pitchClasses.length) % pitchClasses.length;
	if (m === 0) {
		return pitchClasses.slice();
	}
	const shifted = pitchClasses.map((_pitchClass, index) => {
		return pitchClasses[(index + n + pitchClasses.length) % pitchClasses.length];
	});
	const normalized = shifted.map((pitchClass, index) => {
		if (index < pitchClasses.length - m) {
			return pitchClass - 12;
		} else {
			return pitchClass;
		}
	});
	return normalized;
}

