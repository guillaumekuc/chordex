import * as Common from "./common.js";

export default class Notes {

	static letters = [
		"C",
		"D♭", 
		"D",
		"E♭",
		"E",
		"F",
		"G♭",
		"G",
		"A♭",
		"A",
		"B♭",
		"B"
	]
	

	static fromPitchClass(pc){
		return this.letters[Common.modulo12(pc)]
	}

}