import * as Common from "./common.js";

export default class Notes {

	static letters = [
		"C",
		"Db", 
		"D",
		"Eb",
		"E",
		"F",
		"Gb",
		"G",
		"Ab",
		"A",
		"Bb",
		"B"
	]
	

	static fromPitchClass(pc){
		return this.letters[pc]
	}

}