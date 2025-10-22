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
- **Keyboard Viz**: Visual chord relationship representations
  - **Multiple layouts**: Standard 7/5 piano layout OR Isomorphic 6/6 piano layout
- **Custom Tags**: Add/remove custom tags to chord relationships
- **Personal Notes**: Add custom notes to any chord relationship
- **Aliases**: Create custom aliases for chord relationships
- **Data Persistence**: Local storage with VueUse
- **Import/Export**: JSON import/export functionality
- **Theme Support**: Auto, light, and dark themes
- **Shuffle**: Randomize chord relationship display
- **Configuration**: Customizable root, inversion, and keyboard settings

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
├── actions/         # Business logic (Search, Play, Import/Export, etc.)
├── audio/           # AudioEngine with memory management
├── components/      # Vue components (CRCard, Keyboard, Search, etc.)
├── config/          # Keyboard layouts and keymaps
├── store/           # Pinia state management
├── theory/          # Music theory modules (Chords, Scales, Intervals)
├── utils/           # Utilities (SearchParser, DebugLog, ThemeSwitcher)
└── styles/          # CSS variables and theming
```
