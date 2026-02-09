# Chordex

## About

A Chord Relationship (CR) shows how one chord relates to another by highlighting the interval between them and their qualities that give each CR its unique emotional color. This taxonomy catalogs all 192 possible tertian triad CRs.
Direct application of a music theory framework taught by [Jjay Berthume](https://www.youtube.com/watch?v=kt5_LPC8epM)

## Live

[https://guillaumekuc.github.io/chordex/](https://guillaumekuc.github.io/chordex/)

## References

- [How to Spice Up Your Harmony! :D [Harmonic Relativity] Part 1 - Basics](https://www.youtube.com/watch?v=kt5_LPC8epM) - Original music theory framework by Jjay Berthume
- [Pokédex!](https://www.pokemon.com/fr/pokedex)

## Features

**Core Capabilities:**
- **192 Chord Relationships**: All possible tertian triad combinations (4 qualities × 12 intervals × 4 target qualities)
- **Interactive Exploration**: Browse, search, and filter through all chord relationships with advanced search operators and multiple filter options
- **Audio**: Play individual chord relationships or full progressions with automatic voice leading and smooth inversions
- **Visualisation**: Interactive keyboard visualizations with multiple layouts showing chord relationships in real-time
- **Defaults tags**: Automatic tagging system categorizes relationships by scale types, with affect tags based on emotional characteristics using the VAD (Valence-Arousal-Dominance) model
- **Chord Progression Generator**: Generate musical chord progressions from selected Chord Relationships enforcing connectivity constraints.
- **Personalization**: Add custom tags, notes, and aliases to relationships, with full data persistence and import/export capabilities
- **Extended Scales**: Optional extended scales mode expands from 21 base scales to 112 total scales through fifths offset modulations
- **Metadata**: Inspector panel provides detailed information about common tones, scale associations, and relationship properties

### Detailed Features

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
- **Affect Tags**: Emotion-based tags for Chord Relationships (relative notation for moves between chords)
  - **Purpose**: Required to navigate the 192 relationships efficiently and make the system usable out of the box
  - **Derivation**: Sourced from global consensus using LLMs and Agent Skills architecture to avoid subjective bias
  - **Research Method**: Used Perplexity Deep Research to systematically search for affect information across multiple notation formats (absolute notation, natural-language descriptions, Roman numeral analysis, etc.)
  - **Coverage**: Tags attributed to approximately 1/3 of the 192 relationships; the remainder are under-determined due to lack of online discussion, suggesting roughly 2/3 of harmonic space is under-explored or non-pertinent in practice
  - **Taxonomy**: Based on the Valence–Arousal–Dominance (VAD) model with three axes: valence (pleasure/displeasure), arousal (activation), dominance (control/submission)
  - **Eight Affect Labels**: Anger/Defiance, Calm/Safe, Content/Assured, Excited/Uplifted, Grim/Control, Joy/Triumph, Sadness/Melancholy, Fear/Tension
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

# Preview production build locally
npm run preview
```

## Deployment

Deployment to GitHub Pages is automated via GitHub Actions. The workflow (`.github/workflows/deploy.yml`) automatically:
- Triggers on push to the `master` branch
- Builds the project using `npm run build`
- Deploys the `dist` directory to GitHub Pages using `peaceiris/actions-gh-pages@v3`

No manual deployment command is needed - simply push to `master` to deploy.



## Documentation

- **README.md**: This file - project overview and features

