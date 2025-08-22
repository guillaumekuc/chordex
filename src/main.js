import Intervals from "./theory/Intervals.js";
import Scales from "./theory/Scales.js";
import ChordRelationships from "./theory/ChordRelationships.js";
import * as Common from "./theory/common.js";

(function () {

const DEBUG=false;

console.log(Scales.all);
ChordRelationships.mapScales(Scales.all);
console.log(ChordRelationships.all);


function debugLog(...value) {
	if(DEBUG===true){
		console.log(...value);
	}
	
}

})();