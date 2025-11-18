# Chordex

## About

A Chord Relationship (CR) shows how one chord relates to another by highlighting the interval between them and their qualities that give each CR its unique emotional color. This taxonomy catalogs all 192 possible tertian triad CRs.

## Live

[https://guillaumekuc.github.io/chordex/](https://guillaumekuc.github.io/chordex/)

## References

- [Pokédex!](https://www.pokemon.com/fr/pokedex)

## Features

### Implemented Features

- **Audio Playback**: Web Audio API with automatic voice leading
  - **Individual CR playback**: Play root chord followed by target chord
  - **Progression playback**: Play full chord progressions with configurable tempo (default 120 BPM)
  - **Smooth voice leading**: Automatically selects best inversions to minimize voice movement
- **Advanced Search**: Text search with operators (+, -, |, ,, "")
  - **Operators**: `+` (must include), `-` (exclude), `|` (OR), `,` (separator), `""` (exact phrase)
  - **Tag search**: Search for tags directly in query (e.g., `#favorite`)
  - **Unicode support**: Automatic normalization and scale notation conversion (b/# → ♭/♯)
  - **Filter by Root**: Filter chord relationships by root chord quality
  - **Filter by Interval**: Filter by interval between root and target
  - **Filter by Target**: Filter by target chord quality
  - **Filter by Scales**: Filter by associated scales
  - **Filter by Common Tones**: Filter by number of common tones (0-3)
  - **Filter by Fifths Level**: Filter by fifths offset when extended scales are enabled
  - **Selected Filter**: Show only selected chord relationships
  - **Reset Filters**: Quick reset of all search filters
- **Keyboard Viz**: Visual chord relationship representations
  - **Multiple layouts**: Standard 7/5 piano layout OR Isomorphic 6/6 piano layout
  - **Display options**: Toggle keyboard mapping labels and note names
  - **Animation**: Visual animation showing passive (root), overlap, and active (target) chord tones
  - **Interactive**: Hover and selection states trigger keyboard animation
- **Multi-select Support**: Select multiple chord relationships for batch operations
- **Automatic Tagging**: System automatically tags chord relationships:
  - **diatonic**: CRs from Major scale modes (base level)
  - **harmonic-minor**: CRs from Harmonic Minor scale modes
  - **melodic-minor**: CRs from Melodic Minor scale modes
  - **lighter/darker**: Based on fifths offset modulation (Major-derived scales)
  - **ambiguous**: CRs with both lighter and darker modulations
- **Custom Tags**: Add/remove custom tags to chord relationships (searchable with `#tag` syntax)
- **Personal Notes**: Add custom notes to any chord relationship
- **Aliases**: Create custom aliases for chord relationships
- **Reset Metadata**: Clear all custom tags, notes, and aliases (restores automatic tags)
- **Tooltips**: Contextual tooltips for unused chord relationships in progressions
- **Data Persistence**: Local storage with VueUse
- **Import/Export**: JSON import/export functionality
- **Theme Support**: Auto, light, and dark themes (automatic theme switching, UI selector removed)
- **Shuffle**: Randomize chord relationship display
- **Configuration**: Customizable root, inversion, and keyboard settings
  - **Root note**: Adjustable starting note with octave range constraints
  - **Inversion**: Set default inversion for chord playback
  - **Keyboard settings**: Layout, color scheme, and display options
- **Extended Scales**: Optional extended scales mode with fifths offset modulation (off by default, help available)
  - **21 base scales**: 7 modes × 3 parent scales (Major, Harmonic Minor, Melodic Minor)
  - **91 extended scales**: Major scale modes modulated by fifths offsets (-6 to +6)
  - **Total**: 112 scales when extended mode enabled
- **Help/Didactics**: Built-in help for extended scales and keyboard layouts
- **Chord Progression Generator**: Generate musical chord progressions from selected chord relationships
  - **Configurable slots**: Set the number of chords in the progression
  - **Root note selection**: Choose the starting root note (adjustable with step controls)
  - **Tempo control**: Set playback tempo in BPM (default 120)
  - **Reroll chords**: Regenerate chords from any position in the progression (regenerates all subsequent chords)
  - **Connectivity analysis**: Visual feedback on which chord relationships can connect
  - **Smart filtering**: Automatically identifies unaccessible and dead-end relationships
  - **Smooth voice leading**: Automatically selects best inversions for each chord
- **Selection Footer**: Dynamic footer that appears when 2+ items are selected
  - **Selection counter**: Shows number of selected chord relationships
  - **Quick filter toggle**: Toggle selected filter directly from footer
  - **Quick generator access**: Direct access to Chord Progression Generator
- **ScrollLine Component**: Horizontal scrolling component for card footer information display
- **Inspector Panel**: Detailed view of selected chord relationship
  - **Common tones**: Displays number of shared tones between root and target chords (0-3)
  - **Scale associations**: Shows all scales containing this chord relationship
  - **Metadata editing**: Manage aliases, tags, and notes in dedicated panel
  - **Sticky positioning**: Panel stays visible while scrolling

## Stack

- **Frontend**: Vue.js 3.5.19 with Composition API
- **Build Tool**: Vite 7.1.3
- **Styling**: Pico.css 2.1.1
- **State**: Pinia 3.0.3
- **Storage**: VueUse 13.9.0
- **Icons**: Font Awesome
- **Deployment**: GitHub Pages

## Development

```bash
# Development server
npm run dev

# Production build
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Architecture

```text
src/
├── actions/         # Business logic
│   ├── Search.js                # Search and filtering
│   ├── PlayCR.js                # Individual CR playback
│   ├── PlayChordProgression.js  # Progression playback
│   ├── GenerateChordProgression.js # Progression generation
│   ├── RerollChord.js           # Chord rerolling in progressions
│   ├── ResetFilters.js          # Filter reset
│   ├── ResetMetadata.js         # Metadata reset
│   └── ...                      # Other actions (Select, Tag, Alias, etc.)
├── audio/           # AudioEngine with memory management
├── components/      # Vue components
│   ├── CRCard.vue              # Chord relationship card display
│   ├── CRSearch.vue            # Search interface with advanced filters
│   ├── Keyboard.vue            # Visual keyboard representation
│   ├── InspectorPanel.vue      # Side panel for detailed CR inspection
│   ├── ConfigInspector.vue     # Configuration panel
│   ├── ChordProgressionModal.vue # Chord progression generator modal
│   ├── Footer.vue              # Selection footer with quick actions
│   ├── FilterSection.vue       # Reusable filter component
│   ├── CommonTonesFilterSection.vue # Common tones filter
│   ├── FifthsLevelFilterSection.vue # Fifths level filter
│   ├── ScrollLine.vue          # Horizontal scrolling component
│   ├── Key.vue                 # Individual piano key component
│   ├── SearchInput.vue         # Search input component
│   ├── Modal.vue               # Reusable modal component
│   ├── Tooltip.vue             # Tooltip component
│   ├── ExtendedScalesHelp.vue  # Help for extended scales
│   ├── KeyboardLayoutHelp.vue  # Help for keyboard layouts
│   └── ...                     # Other UI components
├── config/          # Keyboard layouts and keymaps
│   ├── keymap.js                # MIDI to keyboard key mappings
│   ├── keyboardRowPatterns.js  # Upper/lower row patterns
│   └── keyboardColorPatterns.js # White/black key patterns
├── store/           # Pinia state management
├── theory/          # Music theory modules
│   ├── ChordRelationships.js  # CR generation and management (192 CRs)
│   ├── ChordProgressions.js   # Progression generation with voice leading
│   ├── Intervals.js            # Interval utilities and notation
│   ├── Scales.js              # Scale generation and modulation
│   ├── Triads.js              # Triad type definitions
│   ├── Notes.js               # Note name utilities
│   └── common.js              # Common math utilities
├── utils/           # Utilities
│   ├── SearchParser.js         # Advanced search query parsing
│   ├── AutoTagger.js           # Automatic tag assignment
│   ├── Animation.js            # Keyboard animation controller
│   └── minimal-theme-switcher.js # Theme management
└── styles/          # CSS variables and theming
```

## Music Theory Details

- **192 Chord Relationships**: All possible tertian triad combinations (4 qualities × 12 intervals × 4 target qualities)
- **Common Tones**: Calculated for each CR (0-3 shared tones between root and target chords)
- **Voice Leading**: Automatic selection of smoothest inversions based on minimal voice movement
- **Scale Mapping**: Each CR is mapped to all scales containing that chord relationship
- **Root Priority**: When multiple triads share a root in a scale, Major > minor > diminished > Augmented

## Documentation

- **README.md**: This file - project overview and features

