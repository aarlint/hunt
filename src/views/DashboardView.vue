<template>
  <div class="dashboard" v-if="data">
    <div class="ambient ambient--1"></div>
    <div class="ambient ambient--2"></div>

    <header class="header" style="animation: fadeUp 0.8s ease both">
      <div class="header__label">
        <span class="header__dot"></span> HUNT MONTANA
      </div>
      <h1 class="header__title">Hunt <span>Montana</span></h1>
      <p class="header__sub">Western Montana Hunting Guide — seasons, species, spots & tags</p>
    </header>

    <div class="stats" style="animation: fadeUp 0.8s ease 0.1s both">
      <div class="stat">
        <div class="stat__label">Open Seasons</div>
        <div class="stat__value" :style="{ color: data.openSeasons.length ? 'var(--accent-green)' : 'var(--text-dim)' }">{{ data.openSeasons.length }}</div>
      </div>
      <div class="stat">
        <div class="stat__label">Next Opens</div>
        <div class="stat__value" style="color: var(--accent-gold)">{{ data.daysToNext != null ? data.daysToNext + 'd' : '—' }}</div>
      </div>
      <div class="stat">
        <div class="stat__label">Species</div>
        <div class="stat__value">{{ data.speciesCount }}</div>
      </div>
      <div class="stat">
        <div class="stat__label">Spots</div>
        <div class="stat__value">{{ data.spotsCount }}</div>
      </div>
    </div>

    <section class="section" style="animation: fadeUp 0.8s ease 0.2s both" v-if="data.openSeasons.length">
      <div class="section__title">What's Open Now</div>
      <div class="card-grid">
        <div class="card" v-for="s in data.openSeasons" :key="s.id">
          <div class="card__header">
            <span class="badge badge--green">OPEN</span>
            <span class="card__weapon">{{ s.weapon_type }}</span>
          </div>
          <div class="card__name">{{ s.name }}</div>
          <div class="card__meta">{{ s.species_name }}</div>
          <div class="card__dates">{{ formatDate(s.start_date) }} — {{ formatDate(s.end_date) }}</div>
        </div>
      </div>
    </section>

    <section class="section" style="animation: fadeUp 0.8s ease 0.3s both" v-if="data.upcoming.length">
      <div class="section__title">Upcoming Seasons</div>
      <div class="list-card">
        <div class="list-item" v-for="s in data.upcoming" :key="s.id">
          <div class="list-item__info">
            <div class="list-item__name">{{ s.name }}</div>
            <div class="list-item__meta">{{ formatDate(s.start_date) }} — {{ s.weapon_type }}</div>
          </div>
          <div class="list-item__countdown">{{ daysUntil(s.start_date) }}d</div>
        </div>
      </div>
    </section>

    <section class="section" style="animation: fadeUp 0.8s ease 0.4s both" v-if="data.tags.length">
      <div class="section__title">Tag Deadlines</div>
      <div class="list-card">
        <div class="list-item" v-for="t in data.tags" :key="t.id">
          <div class="list-item__info">
            <div class="list-item__name">{{ t.name }}</div>
            <div class="list-item__meta">Apply by {{ formatDate(t.deadline) }}</div>
          </div>
          <div class="list-item__countdown" :class="{ urgent: daysUntil(t.deadline) < 30 }">{{ daysUntil(t.deadline) }}d</div>
        </div>
      </div>
    </section>

    <section class="section" style="animation: fadeUp 0.8s ease 0.5s both" v-if="data.tip">
      <div class="section__title">Monthly Tip</div>
      <div class="tip-card">
        <div class="tip-card__title">{{ data.tip.title }}</div>
        <div class="tip-card__content">{{ data.tip.content }}</div>
      </div>
    </section>
  </div>
  <div v-else class="loading">Loading...</div>
</template>

<script setup>
import { useApi } from '../composables/useApi.js'

const { data } = useApi('/api/dashboard')

function formatDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function daysUntil(d) {
  return Math.max(0, Math.ceil((new Date(d) - new Date()) / 86400000))
}
</script>

<style scoped>
.dashboard { padding-top: 40px; }

.ambient {
  position: fixed;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  filter: blur(150px);
  opacity: 0.07;
  pointer-events: none;
  z-index: 0;
}
.ambient--1 { top: -200px; left: -100px; background: var(--accent-gold); }
.ambient--2 { bottom: -200px; right: -100px; background: var(--accent-cyan); }

.header { margin-bottom: 40px; }
.header__label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.header__dot {
  width: 8px; height: 8px;
  background: var(--accent-green);
  border-radius: 50%;
  box-shadow: 0 0 8px #22c55e88;
  animation: pulse 2.5s ease-in-out infinite;
}
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

.header__title {
  font-size: clamp(2.2rem, 5vw, 3.2rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.1;
}
.header__title span { color: var(--text-dim); font-weight: 300; }
.header__sub {
  font-size: 1rem;
  color: var(--text-secondary);
  font-weight: 300;
  margin-top: 12px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 28px;
}
.stat {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.stat__label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-dim);
}
.stat__value {
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1;
}

.section { margin-bottom: 24px; }
.section__title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.section__title::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}
.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 18px 20px;
  transition: background 0.2s, border-color 0.2s;
}
.card:hover { background: var(--bg-card-hover); border-color: var(--border-hover); }
.card__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.card__weapon {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: var(--text-dim);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.card__name { font-weight: 600; font-size: 0.95rem; margin-bottom: 4px; }
.card__meta { font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 6px; }
.card__dates {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--text-dim);
}

.badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  padding: 3px 8px;
  border-radius: 6px;
}
.badge--green { color: var(--accent-green); background: rgba(34, 197, 94, 0.1); }

.list-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}
.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid var(--border);
  transition: background 0.2s;
}
.list-item:last-child { border-bottom: none; }
.list-item:hover { background: var(--bg-card-hover); }
.list-item__name { font-size: 0.85rem; font-weight: 500; }
.list-item__meta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--text-dim);
  margin-top: 2px;
}
.list-item__countdown {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--accent-gold);
}
.list-item__countdown.urgent { color: var(--accent-red); }

.tip-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
}
.tip-card__title { font-weight: 600; margin-bottom: 8px; }
.tip-card__content { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; }

.loading {
  padding: 100px 0;
  text-align: center;
  color: var(--text-dim);
  font-family: 'JetBrains Mono', monospace;
}

@media (min-width: 768px) {
  .dashboard { padding-top: 20px; }
}
</style>
