# Chordex

## About

A Chord Relationship (CR) shows how one chord relates to another by highlighting the interval between them and their qualities that give each CR its unique emotional color. This taxonomy catalogs all 192 possible tertian triad CRs.

## Live

[https://guillaumekuc.github.io/chordex/](https://guillaumekuc.github.io/chordex/)

## References

- [Pokédex!](https://www.pokemon.com/fr/pokedex)

## Features

### Implemented Features

- **Audio Playback**: Web Audio API
- **Advanced Search**: Text search with operators (+, -, |, ,, "")
  - **Tag search**: Search for tags directly in query (e.g., `#favorite`)
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
- **Multi-select Support**: Select multiple chord relationships for batch operations
- **Custom Tags**: Add/remove custom tags to chord relationships (searchable with `#tag` syntax)
- **Personal Notes**: Add custom notes to any chord relationship
- **Aliases**: Create custom aliases for chord relationships
- **Tooltips**: Contextual tooltips for unused chord relationships in progressions
- **Data Persistence**: Local storage with VueUse
- **Import/Export**: JSON import/export functionality
- **Theme Support**: Auto, light, and dark themes (automatic theme switching, UI selector removed)
- **Shuffle**: Randomize chord relationship display
- **Configuration**: Customizable root, inversion, and keyboard settings
- **Extended Scales**: Optional extended scales mode with fifths offset modulation (off by default, help available)
- **Help/Didactics**: Built-in help for extended scales and keyboard layouts
- **Chord Progression Generator**: Generate musical chord progressions from selected chord relationships
  - **Configurable slots**: Set the number of chords in the progression
  - **Root note selection**: Choose the starting root note
  - **Connectivity analysis**: Visual feedback on which chord relationships can connect
  - **Smart filtering**: Automatically identifies unaccessible and dead-end relationships
- **Selection Footer**: Dynamic footer that appears when 2+ items are selected
  - **Selection counter**: Shows number of selected chord relationships
  - **Quick filter toggle**: Toggle selected filter directly from footer
  - **Quick generator access**: Direct access to Chord Progression Generator
- **ScrollLine Component**: Horizontal scrolling component for card footer information display

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
├── actions/         # Business logic (Search, Play, Import/Export, GenerateChordProgression, ResetFilters, etc.)
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
│   ├── HorizontalScrollLine.vue # Alternative scroll line variant
│   ├── Modal.vue               # Reusable modal component
│   ├── Tooltip.vue             # Tooltip component
│   ├── ExtendedScalesHelp.vue  # Help for extended scales
│   ├── KeyboardLayoutHelp.vue  # Help for keyboard layouts
│   └── ...                     # Other UI components
├── config/          # Keyboard layouts and keymaps
├── store/           # Pinia state management
├── theory/          # Music theory modules (Chords, Scales, Intervals, ChordProgressions)
├── utils/           # Utilities (SearchParser, DebugLog, ThemeSwitcher)
└── styles/          # CSS variables and theming
```

## Documentation

- **README.md**: This file - project overview and features
- **STYLEGUIDE.md**: Code style guide for the codebase
