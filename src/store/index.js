import { defineStore } from 'pinia'
import ChordRelationships from '../theory/ChordRelationships'

export const useStore = defineStore('main', {
  state: () => ({
  	chordRelationships: null,
    selected: null,
    audio: null,
    activeFilters:null,
    filtered:null,
    instruments: {},
    config: {
      octaveStart: 4,
      octaveEnd: 5,
      keymap: 'x66',
    },
  }),
})
