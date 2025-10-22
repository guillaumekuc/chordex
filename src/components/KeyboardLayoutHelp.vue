<template>
  <div class="keyboard-layout-help">
    <h4>7/5 Standard Piano Layout</h4>
    <p>
      Traditional piano layout with 7 white and 5 black keys per octave. Familiar to pianists but 
      <strong>obscures intervals</strong> - fingering for same chords and chord movements are not consistent.
    </p>
    
    <h4>6/6 Isomorphic Layout</h4>
    <p>
      Strict alternating of white and black keys where adjacent keys are always one semitone apart.
      <strong>Consistency is king</strong> - chord shapes are always the same (with mirrored versions starting from white or black), 
      and chord relationship moves are similarly consistent.
    </p>
    
    <p>
      <strong>For Chord Relationships:</strong> The 6/6 layout is actually better for relative harmonic thinking, 
      but 7/5 is the default for familiarity. Chord shapes and movements are consistent on 6/6, 
      making it ideal for exploring chord relationships.
    </p>
  </div>
</template>

<script setup>
// No props or logic needed
</script>

<style scoped>
.keyboard-layout-help {
  line-height: 1.6;
}

.keyboard-layout-help p {
  margin: 1rem 0;
}

.keyboard-layout-help h4 {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--pico-primary);
}

.keyboard-layout-help ul {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.keyboard-layout-help li {
  margin: 0.25rem 0;
}

.keyboard-layout-help strong {
  color: var(--pico-primary);
}

.keyboard-layout-help .note {
  background-color: var(--pico-muted-background);
  border-left: 4px solid var(--pico-primary);
  padding: 1rem;
  margin: 1.5rem 0;
  border-radius: 4px;
  font-style: italic;
}
</style>
