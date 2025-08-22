import * as Common from "./common.js";

export default class Triads {

	static types = {
	  M: {pitchClasses: [0, 4, 7], rootPriority: 1},
	  m: {pitchClasses: [0, 3, 7], rootPriority: 2},
	  d: {pitchClasses: [0, 3, 6], rootPriority: 3},
	  A: {pitchClasses: [0, 4, 8], rootPriority: 4}
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

}