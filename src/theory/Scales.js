import Triads from "./Triads.js";
import Intervals from "./Intervals.js";
import ChordRelationships from "./ChordRelationships.js";
import * as Common from "./common.js";

export default class Scales {

	static parents = {};
	static all=[];

	static {
		for (let i=-6; i <= 6; i++){
			this[`${i}`]=[];
		} //init fifthOffsets


		this.parents.major={label: "Major", pitchClasses: [0, 2, 4, 5, 7, 9, 11]};
		this.parents.harmonicMinor={label: "Harmonic Minor", pitchClasses: [0, 2, 3, 5, 7, 8, 11]};
		this.parents.melodicMinor={label: "Melodic Minor", pitchClasses: [0, 2, 3, 5, 7, 9, 11]};
		//this.parents.majorPentatonic={label: "Major Pentatonic", pitchClasses: [0, 2, 4, 7, 9]};

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
		/*
		this.parents.majorPentatonic.modes=[
			{label: "Major Pentatonic", degree: 1},
			{label: "Suspended Pentatonic", degree: 2},
			{label: "Pentatonic Mode III", degree: 3},
			{label: "Pentatonic Mode IV", degree: 4},
			{label: "Minor Pentatonic", degree: 5},
		];
		*/

		for (let parentScale of Object.values(this.parents)){
			if (!parentScale.modes){
				continue;
			}
			for (let mode of parentScale.modes) {
				mode.pitchClasses=this.getModePitchClasses(mode.degree, parentScale);
				mode.parent=parentScale.label;
				mode.fifthsOffset=0; //used to indicate modulations around the circle of fifths. Here we compute scales at "floor level", no modulation yet.
				this['0'].push(mode);
				this.all.push(mode);
			}
		}

		//positive modulations
		for (let i=1; i <= 6; i++){
			for (let scale of this['0']){
				const modScale=this.modulateByFifths(scale, i);
				this[`${i}`].push(modScale);
				this.all.push(modScale);
			}
		}

		for (let i=-1; i >= -6; i--){
			for (let scale of this['0']){
				const modScale=this.modulateByFifths(scale, i);
				this[`${i}`].push(modScale);
				this.all.push(modScale);
			}
		}

		// Note: chordRelationships will be populated later in mapScales method
		// to avoid circular dependency
			
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

	static modulateByFifths(scale, steps){
		const alteredPitchClasses=[];
		for (let pitchClass of scale.pitchClasses){
			const alteredPitchClass = Intervals.add(pitchClass, steps * 7); //7 = Perfect Fifth
			alteredPitchClasses.push(alteredPitchClass);
		};
		if(!alteredPitchClasses.includes(0)){
		}
		alteredPitchClasses.sort((a, b) => a - b); 
		const alteredLabel = `${scale.label}[${steps}]`;
		const parent= scale.parent;
		const fifthsOffset = steps;
		const rootScale=scale; //scale at level 0 of Fifths rotation. Used to calculate root quality before modulation
		return {label: alteredLabel, pitchClasses: alteredPitchClasses, parent: parent, fifthsOffset: fifthsOffset, rootScale: scale };
	}
	
}