<template>
  <div class="spots-view" v-if="data">
    <header class="header" style="animation: fadeUp 0.8s ease both">
      <div class="section__title">Hunting Spots</div>
      <h1 class="page-title">Western Montana Areas</h1>
      <p class="page-sub">15 proven hunting areas across the region</p>
    </header>

    <div class="card-grid" style="animation: fadeUp 0.8s ease 0.1s both">
      <router-link :to="'/spots/' + s.id" class="card" v-for="s in data" :key="s.id">
        <div class="card__header">
          <span class="badge" :class="diffBadge(s.difficulty)">{{ s.difficulty }}</span>
          <span class="card__access">{{ s.access_type }}</span>
        </div>
        <div class="card__name">{{ s.name }}</div>
        <div class="card__districts">{{ s.hunting_districts }}</div>
        <div class="card__desc">{{ s.description?.slice(0, 120) }}...</div>
        <div class="card__species" v-if="s.species">
          <span class="species-tag" v-for="sp in s.species.slice(0, 4)" :key="sp.id">{{ sp.name }}</span>
          <span class="species-tag species-tag--more" v-if="s.species.length > 4">+{{ s.species.length - 4 }}</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useApi } from '../composables/useApi.js'
const { data } = useApi('/api/spots')

function diffBadge(d) {
  if (d === 'Easy') return 'badge--green'
  if (d === 'Expert') return 'badge--red'
  return 'badge--gold'
}
</script>

<style scoped>
.spots-view { padding-top: 40px; }
@media (min-width: 768px) { .spots-view { padding-top: 20px; } }

.header { margin-bottom: 24px; }
.page-title { font-size: 1.8rem; font-weight: 700; letter-spacing: -0.02em; }
.page-sub { color: var(--text-secondary); font-size: 0.9rem; margin-top: 8px; }
.section__title { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-dim); margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
.section__title::after { content: ''; flex: 1; height: 1px; background: var(--border); }

.card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 12px; }
.card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 18px 20px; transition: background 0.2s, border-color 0.2s; display: block; }
.card:hover { background: var(--bg-card-hover); border-color: var(--border-hover); }
.card__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.card__access { font-family: 'JetBrains Mono', monospace; font-size: 0.55rem; color: var(--text-dim); letter-spacing: 0.1em; text-transform: uppercase; }
.card__name { font-weight: 600; font-size: 1rem; margin-bottom: 4px; }
.card__districts { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: var(--accent-cyan); margin-bottom: 8px; }
.card__desc { font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 10px; }
.card__species { display: flex; flex-wrap: wrap; gap: 6px; }
.species-tag { font-family: 'JetBrains Mono', monospace; font-size: 0.55rem; padding: 2px 8px; border-radius: 4px; background: rgba(229, 160, 13, 0.08); color: var(--accent-gold); letter-spacing: 0.05em; }
.species-tag--more { background: rgba(63, 193, 240, 0.08); color: var(--accent-cyan); }

.badge { font-family: 'JetBrains Mono', monospace; font-size: 0.55rem; font-weight: 500; letter-spacing: 0.1em; padding: 3px 8px; border-radius: 6px; text-transform: uppercase; }
.badge--green { color: var(--accent-green); background: rgba(34, 197, 94, 0.1); }
.badge--gold { color: var(--accent-gold); background: rgba(229, 160, 13, 0.1); }
.badge--red { color: var(--accent-red); background: rgba(239, 68, 68, 0.1); }
</style>
