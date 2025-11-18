
import { defineStore } from "pinia";
import { ref, reactive, computed, watch } from "vue";
import { useStorage } from "@vueuse/core";

import ChordRelationships from "../theory/ChordRelationships";
import ChordProgressions from "../theory/ChordProgressions";
import Search from "../actions/Search";

export const useStore = defineStore("main", function() {
    // Persisted state
    const chordRelationships = useStorage(
        "chordRelationships",
        structuredClone(ChordRelationships.all)
    );

    // UI state
    const selected = ref([]);
    const audio = ref(null);
    const shuffled = ref(null);
    const animationPhase = ref(0); // 0: anim-passive, 1: anim-overlap, 2: anim-active

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
        currentTheme: "dark",
        extendedScales: false
    });

    const generator = reactive({
        slots: 8,
        root: 64,
        progression: [],
        showModal: false,
        unaccessible: [],
        leadsToNowhere: [],
    });

    const filtered = computed(() => {
        const searchResults = Search.execute(chordRelationships.value, activeFilters, selected.value);
        return shuffled.value || searchResults;
    });

    // Reactively analyze selection whenever it changes
    const selectionAnalysis = computed(() => {
        return ChordProgressions.analyzeSelectionConnectivity(selected.value);
    });

    // Extract all unique tags from all chord relationships
    const allTags = computed(() => {
        const tagSet = new Set();
        chordRelationships.value.forEach(cr => {
            if (Array.isArray(cr.tags) && cr.tags.length > 0) {
                cr.tags.forEach(tag => {
                    if (tag && tag.trim()) {
                        tagSet.add(tag.trim());
                    }
                });
            }
        });
        // Return sorted array of unique tags
        return Array.from(tagSet).sort();
    });

    // Watch selectionAnalysis and update generator state
    watch(selectionAnalysis, (analysis) => {
        generator.unaccessible = analysis.unaccessible || [];
        generator.leadsToNowhere = analysis.leadsToNowhere || [];
    }, { immediate: true });

    return {
        chordRelationships,
        selected,
        audio,
        activeFilters,
        filtered,
        instruments,
        config,
        shuffled,
        generator,
        selectionAnalysis,
        allTags,
        animationPhase
    };
});
