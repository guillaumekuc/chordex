import Triads from "./Triads.js";
import Intervals from "./Intervals.js";
import ChordRelationships from "./ChordRelationships.js";
import * as Common from "./common.js";

export default class Scales {

	static parents = {};
	static all=[];

	static {
		this.parents.major={label: "Major", pitchClasses: [0, 2, 4, 5, 7, 9, 11]};
		this.parents.harmonicMinor={label: "Harmonic Minor", pitchClasses: [0, 2, 3, 5, 7, 8, 11]};
		this.parents.melodicMinor={label: "Melodic Minor", pitchClasses: [0, 2, 3, 5, 7, 9, 11]};
		this.parents.majorPentatonic={label: "Major Pentatonic", pitchClasses: [0, 2, 4, 7, 9]};

		//modes
		this.parents.major.modes=[
			{label: "Ionian", degree: 1},
			{label: "Dorian", degree: 2},
			{label: "Phrygian", degree: 3},
			{label: "Lydian", degree: 4},
			{label: "Mixolydian", degree: 5},
			{label: "Aeolian", degree: 6},
			{label: "Locrian", degree: 7},
		];
		this.parents.harmonicMinor.modes=[
			{label: "Harmonic Minor", degree: 1},
			{label: "Locrian ♯6", degree: 2},           
			{label: "Ionian Augmented", degree: 3},    
			{label: "Dorian ♯4", degree: 4},          
			{label: "Phrygian Dominant", degree: 5},    
			{label: "Lydian ♯2", degree: 6},       
			{label: "Ultralocrian", degree: 7}, 
		];
		this.parents.melodicMinor.modes=[
			{label: "Melodic Minor", degree: 1},             
			{label: "Dorian ♭2", degree: 2},                 
			{label: "Lydian Augmented", degree: 3},          
			{label: "Lydian Dominant", degree: 4},           
			{label: "Mixolydian ♭6", degree: 5},             
			{label: "Locrian ♯2", degree: 6},                
			{label: "Altered Scale", degree: 7},
		];
		this.parents.majorPentatonic.modes=[
			{label: "Major Pentatonic", degree: 1},
			{label: "Suspended Pentatonic", degree: 2},
			{label: "Pentatonic Mode III", degree: 3},
			{label: "Pentatonic Mode IV", degree: 4},
			{label: "Minor Pentatonic", degree: 5},
		]

		for (let parentScale of Object.values(this.parents)){
			for (let mode of parentScale.modes) {
				mode.pitchClasses=this.getModePitchClasses(mode.degree, parentScale);
				mode.parent=parentScale.label;
				this.all.push(mode);
			}
		}

		for (let scale of this.all){
			scale.chordRelationships=ChordRelationships.fromScale(scale);
		}
			
	}

	static getModePitchClasses(modeDegree, parentScale){
		const root=parentScale.pitchClasses[modeDegree-1];
		const scaleLength=parentScale.pitchClasses.length;
		const modePitchClasses=[];
		for (let i = 0; i < scaleLength; i++) {
			const pitchClass= Common.modulo12(parentScale.pitchClasses[i] - root);
			modePitchClasses.push(pitchClass);
		}
		modePitchClasses.sort((a, b) => a - b); 
		return modePitchClasses;
	}
	
}