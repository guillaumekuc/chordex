
import { defineStore } from "pinia";
import { ref, reactive, computed } from "vue";
import { useStorage } from "@vueuse/core";

import ChordRelationships from "../theory/ChordRelationships";
import Search from "../actions/Search";

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
    var shuffled = ref(null);

    var config = reactive({
        octaveStart: 4,
        octaveEnd: 5,
        keymap: "x66",
        keyboardLayout: "x75",
        keyboardColors: "x75",
        root: 64,
        inversion: 0,
        currentTheme: "auto"
    });

    var filtered = computed(function() {
        const searchResults = Search.execute(chordRelationships.value, activeFilters.value);
        return shuffled.value || searchResults;
    });


    return {
        chordRelationships,
        selected,
        audio,
        activeFilters,
        filtered,
        instruments,
        config,
        shuffled
    };
});
