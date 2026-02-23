<template>
  <div class="species-view" v-if="data">
    <header class="header" style="animation: fadeUp 0.8s ease both">
      <div class="section__title">Species</div>
      <h1 class="page-title">Game Species</h1>
      <p class="page-sub">19 huntable species in Western Montana</p>
    </header>

    <div class="filters" style="animation: fadeUp 0.8s ease 0.1s both">
      <button v-for="f in filters" :key="f.value" class="pill" :class="{ active: filter === f.value }" @click="filter = f.value">{{ f.label }}</button>
    </div>

    <div class="card-grid" style="animation: fadeUp 0.8s ease 0.2s both">
      <router-link :to="'/species/' + s.id" class="card" v-for="s in filtered" :key="s.id">
        <span class="badge" :class="'badge--' + s.category">{{ categoryLabel(s.category) }}</span>
        <div class="card__name">{{ s.name }}</div>
        <div class="card__desc">{{ s.description?.slice(0, 100) }}...</div>
        <div class="card__meta">{{ s.typical_weight }}</div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useApi } from '../composables/useApi.js'

const { data } = useApi('/api/species')
const filter = ref('all')
const filters = [
  { label: 'All', value: 'all' },
  { label: 'Big Game', value: 'big_game' },
  { label: 'Birds', value: 'bird' },
  { label: 'Predators', value: 'predator' },
  { label: 'Waterfowl', value: 'waterfowl' },
]

const filtered = computed(() => {
  if (!data.value) return []
  if (filter.value === 'all') return data.value
  return data.value.filter(s => s.category === filter.value)
})

function categoryLabel(c) {
  return { big_game: 'Big Game', bird: 'Bird', predator: 'Predator', waterfowl: 'Waterfowl' }[c] || c
}
</script>

<style scoped>
.species-view { padding-top: 40px; }
@media (min-width: 768px) { .species-view { padding-top: 20px; } }

.header { margin-bottom: 24px; }
.page-title { font-size: 1.8rem; font-weight: 700; letter-spacing: -0.02em; }
.page-sub { color: var(--text-secondary); font-size: 0.9rem; margin-top: 8px; }
.section__title { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-dim); margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
.section__title::after { content: ''; flex: 1; height: 1px; background: var(--border); }

.filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
.pill { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border); background: var(--bg-card); color: var(--text-secondary); cursor: pointer; transition: all 0.2s; }
.pill:hover { border-color: var(--border-hover); color: var(--text-primary); }
.pill.active { border-color: var(--accent-gold); color: var(--accent-gold); background: rgba(229, 160, 13, 0.08); }

.card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; }
.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 18px 20px;
  transition: background 0.2s, border-color 0.2s;
  display: block;
}
.card:hover { background: var(--bg-card-hover); border-color: var(--border-hover); }
.card__name { font-weight: 600; font-size: 1rem; margin: 10px 0 6px; }
.card__desc { font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 8px; }
.card__meta { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: var(--text-dim); }

.badge { font-family: 'JetBrains Mono', monospace; font-size: 0.55rem; font-weight: 500; letter-spacing: 0.1em; padding: 3px 8px; border-radius: 6px; text-transform: uppercase; }
.badge--big_game { color: var(--accent-gold); background: rgba(229, 160, 13, 0.1); }
.badge--bird { color: var(--accent-cyan); background: rgba(63, 193, 240, 0.1); }
.badge--predator { color: var(--accent-red); background: rgba(239, 68, 68, 0.1); }
.badge--waterfowl { color: var(--accent-green); background: rgba(34, 197, 94, 0.1); }
</style>
