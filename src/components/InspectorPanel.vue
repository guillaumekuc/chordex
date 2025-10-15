<template>
	<article v-if="store.selected" id="InspectorPanel">
      	<small class="cr-uid" >{{ store.selected?.uid }}</small>
      	<h3 class="cr-label">{{ store.selected?.label }}</h3>
      	<details name="tags" open>
	      <summary>Tags</summary>
	      <input type="text" placeholder="+ Add a tag and press Enter" />
      	</details>

      	<details name="userNotes" open>
      		<summary>Notes</summary>
      		<textarea
      		  name="userNotes"
      		  placeholder="Write some notes about this Chord Relationship"
      		  aria-label="User notes"
      		></textarea>
      	</details>


      	OK
	</article>
</template>

<script setup>

	import { useStore } from "../store";
	const store= useStore();
</script>

<style>
	#InspectorPanel {
	}

	.cr-uid {
	  font-size: 0.66rem;
	  color: var(--pico-muted-color);
	}
	.cr-uid::before{
	  content:"#";
	}

</style>