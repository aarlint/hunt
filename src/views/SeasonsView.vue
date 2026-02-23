<template>
  <div class="seasons-view" v-if="data">
    <header class="header" style="animation: fadeUp 0.8s ease both">
      <div class="section__title">Seasons</div>
      <h1 class="page-title">2025–2026 Montana Seasons</h1>
    </header>

    <div class="filters" style="animation: fadeUp 0.8s ease 0.1s both">
      <button v-for="f in filters" :key="f.value" class="pill" :class="{ active: filter === f.value }" @click="filter = f.value">{{ f.label }}</button>
    </div>

    <div class="card-grid" style="animation: fadeUp 0.8s ease 0.2s both">
      <div class="card" v-for="s in filtered" :key="s.id">
        <div class="card__header">
          <span class="badge" :class="badgeClass(s)">{{ status(s) }}</span>
          <span class="card__weapon">{{ s.weapon_type }}</span>
        </div>
        <div class="card__name">{{ s.name }}</div>
        <div class="card__meta">{{ s.species_name }}</div>
        <div class="card__dates">{{ formatDate(s.start_date) }} — {{ formatDate(s.end_date) }}</div>
        <div class="card__notes" v-if="s.notes">{{ s.notes }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useApi } from '../composables/useApi.js'

const { data } = useApi('/api/seasons')
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

function status(s) {
  const now = new Date().toISOString().split('T')[0]
  if (s.start_date <= now && s.end_date >= now) return 'OPEN'
  if (s.start_date > now) return 'UPCOMING'
  return 'CLOSED'
}

function badgeClass(s) {
  const st = status(s)
  return { 'badge--green': st === 'OPEN', 'badge--gold': st === 'UPCOMING', 'badge--dim': st === 'CLOSED' }
}

function formatDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<style scoped>
.seasons-view { padding-top: 40px; }
@media (min-width: 768px) { .seasons-view { padding-top: 20px; } }

.header { margin-bottom: 24px; }
.page-title { font-size: 1.8rem; font-weight: 700; letter-spacing: -0.02em; }
.section__title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.section__title::after { content: ''; flex: 1; height: 1px; background: var(--border); }

.filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
.pill {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}
.pill:hover { border-color: var(--border-hover); color: var(--text-primary); }
.pill.active { border-color: var(--accent-gold); color: var(--accent-gold); background: rgba(229, 160, 13, 0.08); }

.card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 12px; }
.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 18px 20px;
  transition: background 0.2s, border-color 0.2s;
}
.card:hover { background: var(--bg-card-hover); border-color: var(--border-hover); }
.card__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.card__weapon { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; color: var(--text-dim); letter-spacing: 0.1em; text-transform: uppercase; }
.card__name { font-weight: 600; font-size: 0.95rem; margin-bottom: 4px; }
.card__meta { font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 6px; }
.card__dates { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: var(--text-dim); }
.card__notes { font-size: 0.75rem; color: var(--text-dim); margin-top: 8px; font-style: italic; }

.badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  padding: 3px 8px;
  border-radius: 6px;
}
.badge--green { color: var(--accent-green); background: rgba(34, 197, 94, 0.1); }
.badge--gold { color: var(--accent-gold); background: rgba(229, 160, 13, 0.1); }
.badge--dim { color: var(--text-dim); background: rgba(61, 65, 85, 0.2); }
</style>
