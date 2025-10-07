<template>


  <article class="cr-card">
    <hgroup class="cr-hgroup">
      <div class="left">
      <small class="cr-uid" >{{ cr.uid }}</small>
      <h3 class="cr-label">{{ cr.label }}</h3>
      </div>
      <div class="right">
        <button @click="playCR(cr)"><i class="fa-solid fa-play"></i></button>
      </div>
    </hgroup>

    <footer class="cr-card-footer">
      <div class="cr-common-tones">  <kbd>{{`${cr.commonTones}`}}</kbd> common tones  </div>
      <div class="tags">
        <kbd
          v-for="(scale, s) in (crFilteredScales || [])"
        >
          <small>{{ scale }}</small>
        </kbd>
      </div>
    </footer>
  </article>
</template>

<script setup>

import Triads from "../theory/Triads.js"

defineProps({
  cr: {
    type: Object,
    required: true
  },
  filteredScales: {
    type: Object,
    required:true
  }
});

function playCR(cr){
  const root=60;
  const inv=0; //which inversion to use
  console.log(cr.rootQuality);
  console.log(Triads.types[cr.rootQuality].pitchClasses);
  const triadPitchClasses=Triads.types[cr.rootQuality].pitchClasses;
  const inversions=[];
  inversions[0]=invert(triadPitchClasses, 0);
  inversions[1]=invert(triadPitchClasses, 1);
  inversions[2]=invert(triadPitchClasses, 2);
  inversions[3]=invert(triadPitchClasses, 3);
  console.log(inversions[0], inversions[1], inversions[2], inversions[3], inversions[4]);
  const notes= inversions[inv].map(pc => pc + root);
  console.log(notes);


  
  function invert(pitchClasses, n){
    const m= (n + pitchClasses.length) % pitchClasses.length;
    if (m === 0) return pitchClasses.slice();
      const shifted= pitchClasses.map((pc, index) => pitchClasses[(index + n + pitchClasses.length) % pitchClasses.length]);
      
      const normalized= shifted.map((pc, index) => {
        if(index < pitchClasses.length - m){
          return (pc - 12);
        } else {
          return pc
        }
      })
      return normalized;
  }




}

</script>
<script>
export default {
  name: "CRCard",
  data() {
    return {
      
    };
  },
  computed: {
    crFilteredScales() {
      // Filter the cr.scales to only show scales that are in filteredScales
      return this.cr.scales.filter(scale => 
        this.filteredScales.some(fs => fs.label === scale)
      );
    }
  },
  methods: {

    
  },
  mounted() {

  },
};
</script>

<style scoped>

footer {
  font-size: 0.75rem;
}

button {
  --pico-color: inherit;
  background: none;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  border: 0px;
  border-radius: 50%;
  color: var(--pico-color);
}

button:hover{
  color: white;
}
.cr-hgroup {
  display:flex;
  direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: unset;
}

.cr-hgroup.left> :not(:first-child):last-child {
  --pico-color: inherit;
  --pico-font-weight: inherit;
}
.cr-uid {
  font-size: 0.66rem;
  color: var(--pico-muted-color);
}
.cr-uid::before{
  content:"#";
}

.cr-common-tones {
  margin-bottom: 0.5rem;
}
.cr-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  margin: 0; /* parent grid gap controls spacing */
}

.cr-label {
  margin: 0 0 .5rem;
  font-size: 1rem;
  line-height: 1.25;
  text-overflow: ellipsis;
  color: var(--pico-color) !important;
}

.cr-card-footer {
  height: 100%;
  border-top: 1px solid var(--muted-border-color, color-mix(in oklab, currentColor 12%, transparent));
  display: flex;
  flex-direction: column;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: .35rem;
}

</style>
