import Intervals from "./theory/Intervals.js";
import Scales from "./theory/Scales.js"

(function () {

const DEBUG=false;

const test = Intervals.normalize(7);


const triadsDictionary = {
  M: {integers: [0, 4, 7], rootPriority: 1},
  m: {integers: [0, 3, 7], rootPriority: 2},
  d: {integers: [0, 3, 6], rootPriority: 3},
  A: {integers: [0, 4, 8], rootPriority: 4},
  //Q: [0, 5, 10], //Quartal triads
  //'Q+': [0, 5, 11],
  //'+Q': [0, 6, 11]
};


let chordRelationships = initChordRelationships(); 
const scales=generateScalesDictionary();

attachScaleLabelsToChordRelationships(chordRelationships, scales);

console.log(chordRelationships);



function attachScaleLabelsToChordRelationships(chordRelationships, scales) {
  debugLog('attachScaleLabelsToChordRelationships');

  // Ensure every CR has a .scales array
  for (const cr of chordRelationships) {
    if (!Array.isArray(cr.scales)) cr.scales = [];
  }

  // Index CRs by a stable key: rootQuality | integer | targetQuality
  const index = new Map();
  for (const cr of chordRelationships) {
    const key = chordRelationshipKey(cr.rootQuality, cr.integer, cr.targetQuality);
    index.set(key, cr);
  }

  // Walk all scales → their CRs → attach the scale label to the matching global CR
  for (const scale of scales) {
    if (!Array.isArray(scale.chordRelationships)) continue;

    const scaleLabel = `${scale.label}`;

    for (const scaleCR of scale.chordRelationships) {
      if (scaleCR.rootQuality == null || scaleCR.targetQuality == null || !Number.isInteger(scaleCR.integer)) continue;

      const key = chordRelationshipKey(scaleCR.rootQuality, scaleCR.integer, scaleCR.targetQuality);
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
  return `${rootQuality}|${modulo12(integer)}|${targetQuality}`;
}


function generateScalesDictionary() {
	debugLog('generateScalesDictionary');

	const scales=[];
	const parentScales={};

	//integers
	parentScales.major={label: "Major", integers: [0, 2, 4, 5, 7, 9, 11]};
	parentScales.harmonicMinor={label: "Harmonic Minor", integers: [0, 2, 3, 5, 7, 8, 11]};
	parentScales.melodicMinor={label: "Melodic Minor", integers: [0, 2, 3, 5, 7, 9, 11]};
	parentScales.majorPentatonic={label: "Major Pentatonic", integers: [0, 2, 4, 7, 9]};

	//modes
	parentScales.major.modes=[
		{label: "Ionian", degree: 1},
		{label: "Dorian", degree: 2},
		{label: "Phrygian", degree: 3},
		{label: "Lydian", degree: 4},
		{label: "Mixolydian", degree: 5},
		{label: "Aeolian", degree: 6},
		{label: "Locrian", degree: 7},
	];
	parentScales.harmonicMinor.modes=[
		{label: "Harmonic Minor", degree: 1},
		{label: "Locrian ♯6", degree: 2},           
		{label: "Ionian Augmented", degree: 3},    
		{label: "Dorian ♯4", degree: 4},          
		{label: "Phrygian Dominant", degree: 5},    
		{label: "Lydian ♯2", degree: 6},       
		{label: "Ultralocrian", degree: 7}, 
	];
	parentScales.melodicMinor.modes=[
		{label: "Melodic Minor", degree: 1},             
		{label: "Dorian ♭2", degree: 2},                 
		{label: "Lydian Augmented", degree: 3},          
		{label: "Lydian Dominant", degree: 4},           
		{label: "Mixolydian ♭6", degree: 5},             
		{label: "Locrian ♯2", degree: 6},                
		{label: "Altered Scale", degree: 7},
	];
	parentScales.majorPentatonic.modes=[
		{label: "Major Pentatonic", degree: 1},
		{label: "Suspended Pentatonic", degree: 2},
		{label: "Pentatonic Mode III", degree: 3},
		{label: "Pentatonic Mode IV", degree: 4},
		{label: "Minor Pentatonic", degree: 5},
	]

	for (let parentScale of Object.values(parentScales)) {
		for (let mode of parentScale.modes) {
			mode.integers=getModeIntegersFromParentScale(mode.degree, parentScale);
			mode.parent=parentScale.label;
			scales.push(mode);
		}
	}

	for (let scale of scales){
		scale.chordRelationships=getCRsFromScale(scale);
	}
	return scales;
}


function getModeIntegersFromParentScale(degree, parent){
	//debugLog('getModeIntegersFromParentScale');

	const root=parent.integers[degree-1];
	const scaleLength=parent.integers.length; //scale length
	const modeIntegers=[];
	for (let i = 0; i < scaleLength; i++) {
		const integer= modulo12(parent.integers[i] - root);
		modeIntegers.push(integer);
	}
	modeIntegers.sort((a, b) => a - b); //ascending order
	return modeIntegers;
}

function getAllTriadsFromScale(scale, triadsDictionary) {
	debugLog('getAllTriadsFromScale');

  // Ensure unique, sorted pitch classes
  const triads = [];

  for (let i = 0; i < scale.integers.length; i++) {
    for (let j = 0; j < scale.integers.length; j++) {
      if (i===j){ continue}
      for (let k = 0; k < scale.integers.length; k++) {
      	if (k === i || k === j) { continue }
        const triadIntegers = [scale.integers[i], scale.integers[j], scale.integers[k]];
        

        // Normalize to intervals from the first pitch class as root (0-based)
        const intervalSet = triadIntegers
          .map(integer => modulo12(integer - triadIntegers[0]))
 
        

        // Find matching quality by value-equality with the interval pattern
        const match = Object.entries(triadsDictionary).find(
          ([qualityName, triad]) =>
            triad.integers.length === intervalSet.length &&
            triad.integers.every((intervalValue, index) => intervalValue === intervalSet[index])
        );

        if (match) {
          const [qualityName] = match;
          triads.push({
            integer: triadIntegers[0],
            quality: qualityName,
          });
        }
      }
    }
  }

  return triads;
}
function getCRsFromScale(scale){
	debugLog('getCRsFromScale');
	debugLog(scale.label);

	if (scale.integers.length < 3) {
		console.error("Minimum 3 notes to form triads");
		return
	} 

	const allTriads=getAllTriadsFromScale(scale, triadsDictionary);
	//console.log(allTriads);

	//determine root
	const rootChords = allTriads.filter(triad => triad.integer === 0);
	//console.log(rootChords);
	let rootChord;
	if (rootChords.length > 1) {
		let priority= {value: undefined, chord: undefined}
		for (let rootCandidate of rootChords) {
			const rootPriority=triadsDictionary[rootCandidate.quality].rootPriority;
			debugLog(rootPriority);
			if (priority.value===undefined || rootPriority < priority.value) {
				priority.value=rootPriority;
				priority.chord=rootCandidate;
			}
		}
		rootChord=priority.chord;

		//console.log(`${rootChords.length} roots found`);
	} else if (rootChords.length === 1) {
		//console.log('1 root found'); 
		rootChord=rootChords[0];
	} else {
		rootChord={integer: 0, quality: undefined}
	}


	const rootQuality= rootChord.quality;

	const results=[];
	
	const sl= allTriads.length //scale length

	for (let i = 0; i < sl; i++) {

	const targetChord=allTriads[i];
    
    const targetQuality = targetChord.quality;

    const integer = targetChord.integer; // distance to root as integer
    const interval = Intervals.toName(integer); // e.g. ♭3
    const roman = Intervals.toRoman(integer); // e.g. ♭III
    const label = `${rootQuality ?? "?"} ${roman} ${targetQuality ?? "?"}`;

    if (rootQuality != null && targetQuality != null && Number.isInteger(integer)){
	    results.push({
	      label,
	      rootQuality,
	      targetQuality,
	      interval,
	      integer,
	      roman
	    });	
    }
    
  }

  return results;

} 

function normalizeTriad(integerSet) {
	debugLog('NormalizeTriad');

	const root=integerSet[0];
	const third=integerSet[1];
	const fifth=integerSet[2];
	const relativeIntervals = [
		modulo12(root - root), //0
		modulo12(third - root),
		modulo12(fifth - root)
	];
	relativeIntervals.sort((a, b) => a - b); //ascending order
	return relativeIntervals;
}

function modulo12(number) {
	const n=12;
	return ((number % n) + n) % n;
}

function modulo(number, n){
	return ((number % n) + n) % n;
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