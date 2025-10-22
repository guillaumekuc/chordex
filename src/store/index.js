
import { defineStore } from "pinia";
import { ref, reactive, computed } from "vue";
import { useStorage } from "@vueuse/core";

import ChordRelationships from "../theory/ChordRelationships";
import Search from "../actions/Search";

export const useStore = defineStore("main", function() {
    // Persisted state
    const chordRelationships = useStorage(
        "chordRelationships",
        structuredClone(ChordRelationships.all)
    );

    // UI state
    const selected = ref(null);
    const audio = ref(null);
    const shuffled = ref(null);

    // Complex objects
    const activeFilters = reactive(Search.defaultFilters());
    const instruments = reactive({});
    
    const config = reactive({
        octaveStart: 4,
        octaveEnd: 5,
        keymap: "x66",
        keyboardLayout: "x75",
        keyboardColors: "x75",
        root: 64,
        inversion: 0,
        currentTheme: "auto",
        extendedScales: false
    });

    const filtered = computed(() => {
        const searchResults = Search.execute(chordRelationships.value, activeFilters);
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
