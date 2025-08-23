<template>
  <article class="cr-filter">


    <header class="cr-filter-header">
      <h3>Search CRs</h3>
      <div class="search-container">
        <form class="search-form" role="search" @submit.prevent="onSubmit">
          <input
          id="search"
          class="search-input"
          type="search"
          :value="searchQuery"
          @input="onSearchInput($event.target.value)"
          placeholder="Search by label, interval, quality…"
          />
            <button class="search-btn" type="submit" aria-label="Submit search">
              OK
            </button>

        </form>
      </div>
    </header>


    <main>
      <details class="cr-advanced-search">
        <summary>Advanced Search</summary>
        <section>Root Chord Type</section>
        <section>Scale</section>
        <li>
        Common Tones
        <input type="number" min=0 max=3></li>
      </details>
    </main> 

  </article>
</template>

<style>
  .cr-advanced-search{
    margin-bottom:unset;
  }

</style>