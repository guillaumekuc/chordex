
import { defineStore } from "pinia";
import { ref, reactive, computed } from "vue";
import { useStorage } from "@vueuse/core";

import ChordRelationships from "../theory/ChordRelationships";
import Search from "../actions/Search";
import Shuffle from "../actions/Shuffle";
import debugLog from "../utils/debugLog.js";

export const useStore = defineStore("main", function() {
    // Persisted state
    var chordRelationships = useStorage(
        "chordRelationships",
        structuredClone(ChordRelationships.all)
    );

    var selected = ref(null);
    var audio = ref(null);
    var activeFilters = ref(Search.defaultFilters());
    var instruments = ref({});
    var shuffledResults = ref(null);

    var config = reactive({
        octaveStart: 4,
        octaveEnd: 5,
        keymap: "x66",
        keyboardLayout: "x75",
        keyboardColors: "x75",
        root: 64,
        inversion: 0
    });

    var filtered = computed(function() {
        const searchResults = Search.execute(chordRelationships.value, activeFilters.value);
        return shuffledResults.value || searchResults;
    });

    function shuffle() {
        const searchResults = Search.execute(chordRelationships.value, activeFilters.value);
        debugLog('Shuffling', searchResults.length, 'filtered results');
        shuffledResults.value = Shuffle.execute(searchResults);
    }

    function resetShuffle() {
        debugLog('Resetting shuffle - returning to normal order');
        shuffledResults.value = null;
    }

    return {
        chordRelationships,
        selected,
        audio,
        activeFilters,
        filtered,
        instruments,
        config,
        shuffle,
        resetShuffle
    };
});
