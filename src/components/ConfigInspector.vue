<template>
	<details class="configInspector">
		<summary><i class="fa fa-cog" aria-hidden="true"></i> Config</summary>
		
			<p>Keyboard layout: <button @click="switchLayout()">{{layout}}</button></p>
			<p>Root note: <button @click="decrementRootPc()"><</button><kbd>{{root}}</kbd><button @click="incrementRootPc()">></button></p>
		
	</details>
</template>

<script setup>
	  import { computed } from 'vue';
	  import { useStore } from '../store'; 
	  const store= useStore();

	  import Notes from "../theory/Notes.js"

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
	  	switch(store.config.keyboardLayout){
	  		case "x75":
	  			store.config.keyboardLayout="x66";
	  			store.config.keyboardColors="x66";
	  			break
  			case "x66":
  				store.config.keyboardLayout="x75";
  				store.config.keyboardColors="x75";
  				break
	  	}
	  }

	  function incrementRootPc() {
	  		if (store.config.root < (store.config.octaveEnd + 1) * 12 - 1){
	  			store.config.root = store.config.root + 1;
	  		} else {
	  			store.config.root = (store.config.octaveStart + 1) * 12;
	  		}
	  	  	
	  }

  	  function decrementRootPc() {
	  		if (store.config.root > (store.config.octaveStart + 1) * 12){
	  			store.config.root = store.config.root - 1;
	  		} else {
	  			store.config.root = (store.config.octaveEnd + 1) * 12 - 1;
	  		}
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