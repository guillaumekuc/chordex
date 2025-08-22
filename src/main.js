import Intervals from "./theory/Intervals.js";
import Scales from "./theory/Scales.js";
import * as Common from "./theory/common.js";

(function () {

const DEBUG=false;

const test = Intervals.normalize(7);

let chordRelationships = initChordRelationships(); 
const scales=Scales.all;
console.log(scales);

attachScaleLabelsToChordRelationships(chordRelationships, scales);

console.log(chordRelationships);



function attachScaleLabelsToChordRelationships(chordRelationships, scales) {
  debugLog('attachScaleLabelsToChordRelationships');

  // Ensure every CR has a .scales array
  for (const cr of chordRelationships) {
    if (!Array.isArray(cr.scales)) { 
    	cr.scales = []; 
    };
  }

  // Index CRs by a stable key: rootQuality | integer | targetQuality
  const index = new Map();
  for (const cr of chordRelationships) {
    const key = chordRelationshipKey(cr.rootQuality, cr.integer, cr.targetQuality);
    index.set(key, cr);
  }

  // Walk all scales → their CRs → attach the scale label to the matching global CR
  for (const scale of scales) {
    if (!Array.isArray(scale.chordRelationships)) { continue; }

    const scaleLabel = `${scale.label}`;

    for (const scaleCR of scale.chordRelationships) {
      if (scaleCR.rootQuality == null || scaleCR.targetQuality == null || !Number.isInteger(scaleCR.pitchClass)) continue;

      const key = chordRelationshipKey(scaleCR.rootQuality, scaleCR.pitchClass, scaleCR.targetQuality);
      const globalCR = index.get(key);
      if (!globalCR) continue;

      if (!globalCR.scales.includes(scaleLabel)) {
        globalCR.scales.push(scaleLabel);
      }
    }
  }

  return chordRelationships;
}

function chordRelationshipKey(rootQuality, integer, targetQuality) {
  return `${rootQuality}|${Common.modulo12(integer)}|${targetQuality}`;
}

function initChordRelationships() {
	const chordRelationships=[];
	const chordQualities = ["M", "m", "d", "A"];
	const integerIntervals = [];

	for (let i = 0; i < 12; i++) {
	  integerIntervals.push(i);
	};

	for (let rootQuality of chordQualities) {
	    for (let integer of integerIntervals) {
	      	for (let targetQuality of chordQualities) {
	      		const interval= Intervals.toName(integer);
	      		const roman= Intervals.toRoman(integer);
	      		const label= `${rootQuality} ${roman} ${targetQuality}`;
	        	chordRelationships.push({label, rootQuality, targetQuality, interval, integer, roman});
	      	}
	    }
	}

	return chordRelationships;
}

function debugLog(...value) {
	if(DEBUG===true){
		console.log(...value);
	}
	
}

})();