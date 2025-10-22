<template>
  <div class="extended-scales-help">
    <p>
      <strong>Extended Scales</strong> add diatonic scales (Major scale modes) that modulate between chord changes. 
      They help find scalar movements that work across both root and target chords.
    </p>
    
    <h4>How It Works</h4>
    <p>
      A Dorian scale might fit your root chord perfectly, but when the chord changes to the target, 
      that same Dorian might not work anymore. <strong>Modulate the scale</strong> to make it fit both chords.
    </p>
    
    <h4>Example</h4>
    <p>
      Start with Dorian, modulate up the circle of fifths two steps [+2] → <strong>Dorian[+2]</strong>. 
      For some CRs, this movement would fit both your root and target chords.
    </p>
    
    <h4>When to Use</h4>
    <p>
      <strong>Disabled:</strong> Simpler approach with only basic scales (level [0]).<br>
      <strong>Enabled:</strong> Access to modulated diatonic scales like Dorian[+2], Phrygian[-1], etc. 
      More dynamic but adds complexity.
    </p>
    
    <p class="note">
      <strong>Note:</strong> Extended scales are more complex and not strictly needed for basic chord relationships use cases.
    </p>
  </div>
</template>

<script setup>
// No props or logic needed
</script>

<style scoped>
.extended-scales-help {
  line-height: 1.6;
}

.extended-scales-help p {
  margin: 1rem 0;
}

.extended-scales-help strong {
  color: var(--pico-primary);
}

.extended-scales-help .note {
  background-color: var(--pico-muted-background);
  border-left: 4px solid var(--pico-primary);
  padding: 1rem;
  margin: 1.5rem 0;
  border-radius: 4px;
  font-style: italic;
}
</style>
