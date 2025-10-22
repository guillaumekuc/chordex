<template>
	<details class="configInspector">
		<summary><i class="fa fa-cog" aria-hidden="true"></i> Config</summary>
		
			<p>Keyboard layout: <button @click="switchLayout()">{{layout}}</button></p>
			<p>Root note: <button @click="UpdateRoot.execute(store, -1)"><</button><kbd>{{root}}</kbd><button @click="UpdateRoot.execute(store, 1)">></button></p>
			<p><button @click="exportJSON()">Export JSON</button><button @click="importJSON()">Import JSON</button></p>
		
	</details>
</template>

<script setup>
	  import { computed } from 'vue';
	  import { useStore } from '../store'; 
	  const store= useStore();

	  import Notes from "../theory/Notes.js"
	  import ExportJSON from "../actions/ExportJSON.js"
	  import ImportJSON from "../actions/ImportJSON.js"
	  import SwitchKeyboardLayout from "../actions/SwitchKeyboardLayout.js"
	  import UpdateRoot from "../actions/UpdateRoot.js"

	  const layout = computed(()=> {
	  	switch(store.config.keyboardLayout){
	  		case "x75":
		  		return "7/5 standard keyboard layout"
		  		break
  			case "x66":
	  			return "6/6 isomorphic keyboard layout"
	  			break
	  	}
	  })

	  const root = computed(()=> {
	  	const normalizedPc= store.config.root % 12;
	  	const note= Notes.fromPitchClass(normalizedPc);
	  	return note;
	  })


	  function switchLayout(){
	  	SwitchKeyboardLayout.execute(store);
	  }

	  function exportJSON() {
	  	ExportJSON.execute(store);
	  }

	  function importJSON() {
	  	ImportJSON.execute(store);
	  }




</script>

<style>
	.configInspector button {
		padding:5px 10px ;
		margin: 0px 5px !important;
	}

	.configInspector kbd {
		padding: 5px 10px;
		margin: 0px 5px !important;
	}

	.configInspector p {
		margin:10px 0px;
	}
</style>