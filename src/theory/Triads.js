import * as Common from "./common.js";
import Notes from "./Notes.js";

export default class Triads {

	static types = {
	  M: {pitchClasses: [0, 4, 7], rootPriority: 1, symbol: ""},
	  m: {pitchClasses: [0, 3, 7], rootPriority: 2, symbol: "m"},
	  d: {pitchClasses: [0, 3, 6], rootPriority: 3, symbol: "<sup>o</sup>"},
	  A: {pitchClasses: [0, 4, 8], rootPriority: 4, symbol: "+"}
	}

	static fromScale(scale){
		const triads = [];

		for (let i = 0; i < scale.pitchClasses.length; i++) {
			for (let j = 0; j < scale.pitchClasses.length; j++) {
			  
			  if (i===j){ continue}

			  for (let k = 0; k < scale.pitchClasses.length; k++) {
			  	if (k === i || k === j) { continue }
			    const triadPitchClasses = [scale.pitchClasses[i], scale.pitchClasses[j], scale.pitchClasses[k]];
			    
			    // Normalize to root (0-based)
			    const intervalSet = triadPitchClasses.map(pitchClass => Common.modulo12(pitchClass - triadPitchClasses[0]))

			    // Find matching quality with the interval pattern
			    const match = Object.entries(this.types).find(
			      ([qualityName, triad]) =>
			        triad.pitchClasses.length === intervalSet.length &&
			        triad.pitchClasses.every((intervalValue, index) => intervalValue === intervalSet[index])
			    );

			    if (match) {
			      const [qualityName] = match;
			      triads.push({
			        rootPitchClass: triadPitchClasses[0],
			        quality: qualityName,
			      });
			    }

			  } // end for k
			} // end for j
		}// end for i

		return triads;		
	}

	static fromChordRelationship(rootPitchClass, chordRelationship) {
		const quality = chordRelationship.rootQuality;
		const rootNote = Notes.fromPitchClass(rootPitchClass);
		const symbol = this.types[quality].symbol;
		const label = rootNote + symbol;
		
		return {
			rootNote: rootNote,
			quality: quality,
			label: label
		};
	}

}