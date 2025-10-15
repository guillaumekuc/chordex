<template>
  <article
    @click="selectCR(cr)"
    class="cr-card"
    :class="cr.selected ? 'selected' : null"
  >
    <hgroup class="cr-hgroup">
      <div class="left">
        <small class="cr-uid">{{ cr.uid }}</small>
        <h3 class="cr-label">{{ cr.label }}</h3>
      </div>
      <div class="right">
        <button @click.stop="playCR(cr, 72, 2)"><i class="fa-solid fa-play"></i></button>
      </div>
    </hgroup>

    <footer class="cr-card-footer">
      <div class="cr-common-tones">
        <kbd>{{ `${cr.commonTones}` }}</kbd> common tones
      </div>

      <div class="tags">
        <kbd v-for="(scale, s) in crFilteredScales" :key="s">
          <small>{{ scale }}</small>
        </kbd>
      </div>
    </footer>
  </article>
</template>

<script setup>
import { computed } from "vue";
import Triads from "../theory/Triads.js";
import { useStore } from "../store";

defineOptions({ name: "CRCard" });

const props = defineProps({
  cr: {
    type: Object,
    required: true
  },
  // Expecting an array of objects like [{ label: "Ionian" }, ...]
  filteredScales: {
    type: Array,
    required: true
  }
});

const store = useStore();

const crFilteredScales = computed(function () {
  const inputScales = Array.isArray(props.cr?.scales) ? props.cr.scales : [];
  const filterList = Array.isArray(props.filteredScales) ? props.filteredScales : [];
  return inputScales.filter(function (scale) {
    return filterList.some(function (fs) {
      return fs.label === scale;
    });
  });
});

function selectCR(entry) {
  if (store.selected?.uid === entry.uid) {
    entry.selected = false;
    store.selected = null;
  } else {
    if (store.selected) {
      store.selected.selected = false;
    }
    entry.selected = true;
    store.selected = entry;
  }
  console.log("selectCR", entry.uid);
}

function playCR(cr, root, inv) {
  if (typeof root !== "number") {
    root = 60;
  }
  if (typeof inv !== "number") {
    inv = 0;
  }

  const rootChord = {};
  const targetChord = {};

  console.log("Root quality:", cr.rootQuality);

  rootChord.notes = getRootChordNotes(cr, root, inv);
  targetChord.notes = getTargetChordNotes(cr, root, rootChord);

  playSequence(rootChord.notes, targetChord.notes, 1000);

  console.log("Notes:", rootChord.notes);

  async function playSequence(rootChordNotes, targetChordNotes, timeMs) {
    await wait(0);
    store.audio.playNotes(rootChordNotes);
    await wait(timeMs);
    store.audio.playNotes(targetChordNotes);
  }

  function getTargetChordNotes(cr, root, rootChord) {
    console.log("getTargetChordNotes");
    console.log("cr:", cr);

    const targetRoot = cr.pitchClass + root;
    const triadPitchClasses = Triads.types[cr.targetQuality].pitchClasses;

    const triadInversions = {};
    const triadInversionsNearest = {};

    for (let i = 0; i < 3; i++) {
      triadInversions[i] = invert(triadPitchClasses, i).map(function (pc) {
        return pc + targetRoot;
      });
      triadInversionsNearest[i] = triadInversions[i].map(function (pc, index) {
        return nearestPitch(rootChord.notes[index], pc);
      });
    }

    const smoothest = pickSmoothest(rootChord.notes, triadInversionsNearest).target;
    return smoothest;
  }

  function pickSmoothest(rootChordNotes, targetChordInversions) {
    const results = [];
    Object.values(targetChordInversions).forEach(function (inv) {
      const diffs = inv.map(function (note, i) {
        return Math.abs(rootChordNotes[i] - note);
      });
      const sum = diffs.reduce(function (x, y) {
        return x + y;
      });
      results.push({ root: rootChordNotes, target: inv, diffs: diffs, sum: sum });
    });

    const smoothest = results.reduce(function (best, current) {
      return current.sum < best.sum ? current : best;
    });

    console.log("smoothest sum:", smoothest.sum);
    return smoothest;
  }

  function nearestPitch(target, pc) {
    return pc + 12 * Math.round((target - pc) / 12);
  }

  function wait(timeMs) {
    return new Promise(function (resolve) {
      setTimeout(resolve, timeMs);
    });
  }

  function getRootChordNotes(cr, root, inv) {
    const triadPitchClasses = Triads.types[cr.rootQuality].pitchClasses;
    const notes = invert(triadPitchClasses, inv).map(function (pc) {
      return pc + root;
    });
    return notes;
  }

  function invert(pitchClasses, n) {
    const m = (n + pitchClasses.length) % pitchClasses.length;
    if (m === 0) {
      return pitchClasses.slice();
    }
    const shifted = pitchClasses.map(function (_pc, index) {
      return pitchClasses[(index + n + pitchClasses.length) % pitchClasses.length];
    });
    const normalized = shifted.map(function (pc, index) {
      if (index < pitchClasses.length - m) {
        return pc - 12;
      } else {
        return pc;
      }
    });
    return normalized;
  }
}
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

button:hover {
  color: white;
}

.cr-hgroup {
  display: flex;
  direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: unset;
}

.cr-hgroup.left > :not(:first-child):last-child {
  --pico-color: inherit;
  --pico-font-weight: inherit;
}

.cr-uid {
  font-size: 0.66rem;
  color: var(--pico-muted-color);
}

.cr-uid::before {
  content: "#";
}

.cr-common-tones {
  margin-bottom: 0.5rem;
}

.cr-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  margin: 0;
}

.cr-card.selected {
  outline: 2px solid red;
}

.cr-label {
  margin: 0 0 0.5rem;
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
  gap: 0.35rem;
}
</style>
