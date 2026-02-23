<template>
  <div class="detail" v-if="data">
    <header class="header" style="animation: fadeUp 0.8s ease both">
      <router-link to="/species" class="back">← All Species</router-link>
      <span class="badge" :class="'badge--' + data.category">{{ categoryLabel(data.category) }}</span>
      <h1 class="page-title">{{ data.name }}</h1>
      <p class="page-sub">{{ data.typical_weight }}</p>
    </header>

    <div class="info-grid" style="animation: fadeUp 0.8s ease 0.1s both">
      <div class="info-card">
        <div class="info-card__label">Description</div>
        <div class="info-card__text">{{ data.description }}</div>
      </div>
      <div class="info-card">
        <div class="info-card__label">Habitat</div>
        <div class="info-card__text">{{ data.habitat }}</div>
      </div>
      <div class="info-card">
        <div class="info-card__label">Best Areas — Western MT</div>
        <div class="info-card__text">{{ data.best_areas_western_mt }}</div>
      </div>
      <div class="info-card">
        <div class="info-card__label">Hunting Tips</div>
        <div class="info-card__text">{{ data.hunting_tips }}</div>
      </div>
      <div class="info-card">
        <div class="info-card__label">Recommended Calibers</div>
        <div class="info-card__text">{{ data.recommended_calibers }}</div>
      </div>
    </div>

    <section class="section" style="animation: fadeUp 0.8s ease 0.2s both" v-if="data.seasons?.length">
      <div class="section__title">Related Seasons</div>
      <div class="list-card">
        <div class="list-item" v-for="s in data.seasons" :key="s.id">
          <div class="list-item__info">
            <div class="list-item__name">{{ s.name }}</div>
            <div class="list-item__meta">{{ s.weapon_type }} · {{ formatDate(s.start_date) }} — {{ formatDate(s.end_date) }}</div>
          </div>
          <span class="badge" :class="statusClass(s)">{{ status(s) }}</span>
        </div>
      </div>
    </section>

    <section class="section" style="animation: fadeUp 0.8s ease 0.3s both" v-if="data.spots?.length">
      <div class="section__title">Where to Hunt</div>
      <div class="list-card">
        <router-link :to="'/spots/' + s.id" class="list-item" v-for="s in data.spots" :key="s.id">
          <div class="list-item__info">
            <div class="list-item__name">{{ s.name }}</div>
            <div class="list-item__meta">{{ s.hunting_districts }} · {{ s.difficulty }}</div>
          </div>
          <span class="link-arrow">→</span>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '../composables/useApi.js'

const route = useRoute()
const { data, refresh } = useApi(`/api/species/${route.params.id}`)
watch(() => route.params.id, () => { if (route.params.id) refresh() })

function categoryLabel(c) { return { big_game: 'Big Game', bird: 'Bird', predator: 'Predator', waterfowl: 'Waterfowl' }[c] || c }
function formatDate(d) { return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }
function status(s) { const now = new Date().toISOString().split('T')[0]; if (s.start_date <= now && s.end_date >= now) return 'OPEN'; if (s.start_date > now) return 'UPCOMING'; return 'CLOSED' }
function statusClass(s) { const st = status(s); return { 'badge--green': st === 'OPEN', 'badge--gold': st === 'UPCOMING', 'badge--dim': st === 'CLOSED' } }
</script>

<style scoped>
.detail { padding-top: 40px; }
@media (min-width: 768px) { .detail { padding-top: 20px; } }

.back { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: var(--text-dim); letter-spacing: 0.1em; display: inline-block; margin-bottom: 16px; transition: color 0.2s; }
.back:hover { color: var(--accent-gold); }
.header { margin-bottom: 24px; }
.page-title { font-size: 1.8rem; font-weight: 700; letter-spacing: -0.02em; margin-top: 8px; }
.page-sub { color: var(--text-secondary); font-size: 0.9rem; margin-top: 4px; font-family: 'JetBrains Mono', monospace; }

.info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 12px; margin-bottom: 24px; }
.info-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 18px 20px; }
.info-card__label { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text-dim); margin-bottom: 8px; }
.info-card__text { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; }

.section { margin-bottom: 24px; }
.section__title { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-dim); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
.section__title::after { content: ''; flex: 1; height: 1px; background: var(--border); }
.list-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
.list-item { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-bottom: 1px solid var(--border); transition: background 0.2s; }
.list-item:last-child { border-bottom: none; }
.list-item:hover { background: var(--bg-card-hover); }
.list-item__name { font-size: 0.85rem; font-weight: 500; }
.list-item__meta { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: var(--text-dim); margin-top: 2px; }
.link-arrow { color: var(--accent-gold); font-size: 1.2rem; }

.badge { font-family: 'JetBrains Mono', monospace; font-size: 0.55rem; font-weight: 500; letter-spacing: 0.1em; padding: 3px 8px; border-radius: 6px; text-transform: uppercase; }
.badge--big_game { color: var(--accent-gold); background: rgba(229, 160, 13, 0.1); }
.badge--bird { color: var(--accent-cyan); background: rgba(63, 193, 240, 0.1); }
.badge--predator { color: var(--accent-red); background: rgba(239, 68, 68, 0.1); }
.badge--waterfowl { color: var(--accent-green); background: rgba(34, 197, 94, 0.1); }
.badge--green { color: var(--accent-green); background: rgba(34, 197, 94, 0.1); }
.badge--gold { color: var(--accent-gold); background: rgba(229, 160, 13, 0.1); }
.badge--dim { color: var(--text-dim); background: rgba(61, 65, 85, 0.2); }
</style>
