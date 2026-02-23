<template>
  <div class="detail" v-if="data">
    <header class="header" style="animation: fadeUp 0.8s ease both">
      <router-link to="/spots" class="back">← All Spots</router-link>
      <span class="badge" :class="diffBadge(data.difficulty)">{{ data.difficulty }}</span>
      <h1 class="page-title">{{ data.name }}</h1>
      <p class="page-districts">{{ data.hunting_districts }}</p>
      <p class="page-sub">{{ data.access_type }}</p>
    </header>

    <div class="info-grid" style="animation: fadeUp 0.8s ease 0.1s both">
      <div class="info-card">
        <div class="info-card__label">Description</div>
        <div class="info-card__text">{{ data.description }}</div>
      </div>
      <div class="info-card">
        <div class="info-card__label">Tips</div>
        <div class="info-card__text">{{ data.tips }}</div>
      </div>
    </div>

    <section class="section" style="animation: fadeUp 0.8s ease 0.2s both" v-if="data.species?.length">
      <div class="section__title">Species Available</div>
      <div class="species-grid">
        <router-link :to="'/species/' + s.id" class="species-chip" v-for="s in data.species" :key="s.id">
          <span class="species-chip__cat" :class="'cat--' + s.category"></span>
          <span>{{ s.name }}</span>
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
const { data, refresh } = useApi(`/api/spots/${route.params.id}`)
watch(() => route.params.id, () => { if (route.params.id) refresh() })

function diffBadge(d) { if (d === 'Easy') return 'badge--green'; if (d === 'Expert') return 'badge--red'; return 'badge--gold' }
</script>

<style scoped>
.detail { padding-top: 40px; }
@media (min-width: 768px) { .detail { padding-top: 20px; } }

.back { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: var(--text-dim); letter-spacing: 0.1em; display: inline-block; margin-bottom: 16px; transition: color 0.2s; }
.back:hover { color: var(--accent-gold); }
.header { margin-bottom: 24px; }
.page-title { font-size: 1.8rem; font-weight: 700; letter-spacing: -0.02em; margin-top: 8px; }
.page-districts { font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: var(--accent-cyan); margin-top: 6px; }
.page-sub { color: var(--text-secondary); font-size: 0.85rem; margin-top: 4px; }

.info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 12px; margin-bottom: 24px; }
.info-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 18px 20px; }
.info-card__label { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text-dim); margin-bottom: 8px; }
.info-card__text { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; }

.section { margin-bottom: 24px; }
.section__title { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-dim); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
.section__title::after { content: ''; flex: 1; height: 1px; background: var(--border); }

.species-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.species-chip { display: flex; align-items: center; gap: 8px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px; padding: 10px 16px; font-size: 0.85rem; transition: all 0.2s; }
.species-chip:hover { background: var(--bg-card-hover); border-color: var(--border-hover); }
.species-chip__cat { width: 8px; height: 8px; border-radius: 50%; }
.cat--big_game { background: var(--accent-gold); }
.cat--bird { background: var(--accent-cyan); }
.cat--predator { background: var(--accent-red); }
.cat--waterfowl { background: var(--accent-green); }

.badge { font-family: 'JetBrains Mono', monospace; font-size: 0.55rem; font-weight: 500; letter-spacing: 0.1em; padding: 3px 8px; border-radius: 6px; text-transform: uppercase; }
.badge--green { color: var(--accent-green); background: rgba(34, 197, 94, 0.1); }
.badge--gold { color: var(--accent-gold); background: rgba(229, 160, 13, 0.1); }
.badge--red { color: var(--accent-red); background: rgba(239, 68, 68, 0.1); }
</style>
