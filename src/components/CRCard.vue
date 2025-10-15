<template>


  <article class="cr-card" >
    <hgroup class="cr-hgroup">
      <div class="left">
      <small class="cr-uid" >{{ cr.uid }}</small>
      <h3 class="cr-label">{{ cr.label }}</h3>
      </div>
      <div class="right">
        <button @click="playCR(cr, 72, 2)"><i class="fa-solid fa-play"></i></button>
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

import Triads from "../theory/Triads.js";
import { useStore } from "../store";

const store= useStore();



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

function playCR(cr, root, inv){
  root= root || 60;
  inv= inv || 0; //which inversion to use

  const rootChord={};
  const targetChord={};

  console.log("Root quality:", cr.rootQuality);

  rootChord.notes = getRootChordNotes(cr, root, inv);
  targetChord.notes = getTargetChordNotes(cr, root, rootChord);

  playCR(rootChord.notes, targetChord.notes, 1000);


  console.log("Notes:", rootChord.notes);
  async function playCR(rootChordNotes, targetChordNotes, timeMs) {
    await wait(0);
      store.audio.playNotes(rootChordNotes);
    await wait(1000);
      store.audio.playNotes(targetChordNotes);
  }

  function getTargetChordNotes(cr, root, rootChord){
    console.log(`getTargetChordNotes`);
    console.log(`cr:`);
    console.log(cr);

    //get the new root
    const targetRoot= cr.pitchClass + root;
    console.log(targetRoot);
    const triadPitchClasses=Triads.types[cr.targetQuality].pitchClasses;

    const triadInversions={};
    const triadInversionsNearest={};

    for (let i=0; i < 3; i++) {
      triadInversions[i]= invert(triadPitchClasses, i).map(pc => pc + targetRoot);
      triadInversionsNearest[i]= triadInversions[i].map((pc, i ) => nearestPitch(rootChord.notes[i], pc));
    };

     console.log(triadInversions);
     console.log(triadInversionsNearest);

     const smoothest=pickSmoothest(rootChord.notes, triadInversionsNearest).target;

     console.log(smoothest);

    return smoothest;

  }

  function pickSmoothest(rootChordNotes, targetChordInversions){
    const results=[];
    Object.values(targetChordInversions).forEach(inv => {
      const diffs = inv.map((note, i) => Math.abs(rootChordNotes[i] - note));   
      const sum = diffs.reduce((x, y) => x + y);
      results.push({root: rootChordNotes, target: inv, diffs: diffs, sum: sum});
    });

    const smoothest = results.reduce((best, current) => {
        return current.sum < best.sum ? current : best;
    });

    console.log(`smoothest sum: ${smoothest.sum}`);

    return smoothest;
  }

  function nearestPitch(target, pc) {
    return pc + 12 * Math.round((target - pc) / 12);
  }

  function wait(timeMs) {
    return new Promise(function(resolve) {
        setTimeout(resolve, timeMs);
    });
  }

  function getRootChordNotes(cr, root, inv){
    const triadPitchClasses=Triads.types[cr.rootQuality].pitchClasses;
    const notes = invert(triadPitchClasses, inv).map(pc => pc + root);
    return notes;
  }

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

.cr-card.selected {
  outline: 2px solid red;
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
