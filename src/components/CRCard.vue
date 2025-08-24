<template>


  <article class="cr-card">
    <hgroup class="cr-hgroup">
      <small class="cr-uid" >{{ cr.uid }}</small>
      <h3 class="cr-label">{{ cr.label }}</h3>
    </hgroup>

    <footer class="cr-card-footer">
      <div class="cr-common-tones">  <kbd>{{`${cr.commonTones}`}}</kbd> common tones  </div>
      <div class="tags">
        <kbd
          v-for="(scale, s) in (crFilteredScales || [])"
        >
          <small>{{ scale }}</small>
        </kbd>
      </div>
    </footer>
  </article>
</template>

<script setup>
defineProps({
  cr: {
    type: Object,
    required: true
  },
  filteredScales: {
    type: Object,
    required:true
  }
});

</script>
<script>
export default {
  name: "CRCard",
  data() {
    return {
      
    };
  },
  computed: {
    crFilteredScales() {
      // Filter the cr.scales to only show scales that are in filteredScales
      return this.cr.scales.filter(scale => 
        this.filteredScales.some(fs => fs.label === scale)
      );
    }
  },
  methods: {
    
  },
  mounted() {

  },
};
</script>

<style scoped>

footer {
  font-size: 0.75rem;
}

.cr-hgroup {
  margin-bottom: unset;
}

.cr-hgroup > :not(:first-child):last-child {
  --pico-color: inherit;
  --pico-font-weight: inherit;
}
.cr-uid {
  font-size: 0.66rem;
  color: var(--pico-muted-color);
}
.cr-uid::before{
  content:"#";
}

.cr-common-tones {
  margin-bottom: 0.5rem;
}
.cr-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  margin: 0; /* parent grid gap controls spacing */
}

.cr-label {
  margin: 0 0 .5rem;
  font-size: 1rem;
  line-height: 1.25;
  text-overflow: ellipsis;
  color: var(--pico-color) !important;
}

.cr-card-footer {
  height: 100%;
  border-top: 1px solid var(--muted-border-color, color-mix(in oklab, currentColor 12%, transparent));
  display: flex;
  flex-direction: column;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: .35rem;
}

</style>
