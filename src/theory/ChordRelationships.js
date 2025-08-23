import Triads from "./Triads.js";
import Intervals from "./Intervals.js";
import Scales from "./Scales.js";
import * as Common from "./common.js";

export default class ChordRelationships {

	static all=[];

	static {
		this.all=initChordRelationships();
		this.all.forEach(cr=> {
			cr.commonTones=this.getCommonTones(cr);
		});
	}

	static fromScale(scale) {
		if (!scale.pitchClasses || scale.pitchClasses.length < 3) {
			console.error("Minimum 3 notes to form triads");
			return [];
		}

		const triads=Triads.fromScale(scale);
		const rootChords= triads.filter(triad => triad.rootPitchClass === 0);
		let rootChord;

		if (rootChords.length > 1) {
			let priority= { 
				value: undefined, 
				chord: undefined
			}


			for (let rootCandidate of rootChords) {
				const rootPriority=Triads.types[rootCandidate.quality].rootPriority;

				if ( priority.value===undefined || rootPriority < priority.value) {
					priority.value = rootPriority;
					priority.chord = rootCandidate;
				}
			}

			rootChord = priority.chord;

		} else if (rootChords.length === 1) {

			rootChord=rootChords[0];

		} else {
			rootChord={ rootPitchClass: 0, quality: undefined}
		}

		const rootQuality= rootChord.quality;
		const results=[];

		for (let i = 0; i < triads.length; i++) {

			const targetChord = triads[i];
			const targetQuality = targetChord.quality;
			const pitchClass= targetChord.rootPitchClass;
			const interval = Intervals.toName(pitchClass);
			const roman = Intervals.toRoman(pitchClass);
			const label = `${rootQuality ?? "?"} ${roman} ${targetQuality ?? "?"}`;
		    if (rootQuality != null && targetQuality != null && Number.isInteger(pitchClass)){
			    results.push({
			      label,
			      rootQuality,
			      targetQuality,
			      interval,
			      pitchClass,
			      roman
			    });	
			}
		}

		return results;
		
	}

	static mapScales(scales){

		// Ensure every CR has an empty .scales array ready to be populated
		for (const chordRelationship of this.all) {
			chordRelationship.scales = []; 
		}

		// Index CRs by a stable key: rootQuality | integer | targetQuality
		const index = new Map();
		
		for (const chordRelationship of this.all) {
		  index.set(chordRelationship.label, chordRelationship);
		}

		// Walk all scales → their CRs → attach the scale label to the matching global CR
		for (const scale of scales) {
		  	if (!Array.isArray(scale.chordRelationships)) {
		   		continue; 
			}

		  	const scaleLabel = `${scale.label}`;

		  	for (const scaleCR of scale.chordRelationships) {

			    if (scaleCR.rootQuality == null || scaleCR.targetQuality == null || !Number.isInteger(scaleCR.pitchClass) ){
			    	continue;
			    };

			    const globalCR = index.get(scaleCR.label);
		    	if (!globalCR) { continue };

			    if (!globalCR.scales.includes(scaleLabel)) {
			      	globalCR.scales.push(scaleLabel);
			    }
		  	}
		}
	}

	static getCommonTones(cr) {
		const rootPitchClasses=Triads.types[cr.rootQuality].pitchClasses;
		const targetPitchClasses=Triads.types[cr.targetQuality].pitchClasses;
		const normalizedTargetPitchClasses=[];
		targetPitchClasses.forEach(targetPitchClass=> {
			const adjusted=Intervals.add(targetPitchClass, cr.pitchClass);
			normalizedTargetPitchClasses.push(adjusted);
		});
		let commonTonesCount = 0;
		rootPitchClasses.forEach(pitchClass => {
		  if (normalizedTargetPitchClasses.includes(pitchClass)) {
		    commonTonesCount++;
		  }
		});
		return commonTonesCount;
	}

}

function initChordRelationships(){
	const chordRelationships=[];
	const chordQualities=Object.keys(Triads.types);
	const pitchClasses=[];
	for (let i = 0; i < 12; i++) {
  		pitchClasses.push(i);
	};

	let uid=0; //unique identifier
	for (let rootQuality of chordQualities) {
	    for (let pitchClass of pitchClasses) {
	      	for (let targetQuality of chordQualities) {
	      		uid++;
	      		const interval= Intervals.toName(pitchClass);
	      		const roman= Intervals.toRoman(pitchClass);
	      		const label= `${rootQuality} ${roman} ${targetQuality}`;
	        	chordRelationships.push({label, uid: uid.toString().padStart(3, "0"), rootQuality, targetQuality, interval, pitchClass, roman});
	      	}
	    }
	}

	return chordRelationships;
}

