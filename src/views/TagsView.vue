<template>
  <div class="tags-view" v-if="data">
    <header class="header" style="animation: fadeUp 0.8s ease both">
      <div class="section__title">Tags & Licenses</div>
      <h1 class="page-title">Montana Hunting Tags</h1>
      <p class="page-sub">Deadlines, costs, and how to apply</p>
    </header>

    <section class="section" style="animation: fadeUp 0.8s ease 0.1s both">
      <div class="section__title">Upcoming Deadlines</div>
      <div class="card-grid">
        <div class="card" v-for="t in data" :key="t.id">
          <div class="card__header">
            <span class="badge" :class="{ 'badge--red': daysUntil(t.deadline) < 30, 'badge--gold': daysUntil(t.deadline) >= 30 }">
              {{ daysUntil(t.deadline) }}d
            </span>
            <span class="card__type">{{ t.type === 'drawing' ? 'DRAWING' : 'OTC' }}</span>
          </div>
          <div class="card__name">{{ t.name }}</div>
          <div class="card__deadline">Apply by {{ formatDate(t.deadline) }}</div>
          <div class="card__costs">
            <span>Resident: {{ t.resident_cost }}</span>
            <span>Non-res: {{ t.nonresident_cost }}</span>
          </div>
          <div class="card__notes" v-if="t.notes">{{ t.notes }}</div>
        </div>
      </div>
    </section>

    <section class="section" style="animation: fadeUp 0.8s ease 0.2s both">
      <div class="section__title">How to Apply</div>
      <div class="steps-card">
        <div class="step" v-for="(step, i) in steps" :key="i">
          <div class="step__num">{{ i + 1 }}</div>
          <div class="step__info">
            <div class="step__title">{{ step.title }}</div>
            <div class="step__desc">{{ step.desc }}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" style="animation: fadeUp 0.8s ease 0.3s both">
      <div class="section__title">Resident vs Non-Resident</div>
      <div class="list-card">
        <div class="list-item">
          <div class="list-item__info">
            <div class="list-item__name">General Deer/Elk (Sportsman)</div>
            <div class="list-item__meta">Includes deer, elk, upland birds, fishing</div>
          </div>
          <div class="list-item__costs"><span class="cost-res">$23</span> / <span class="cost-nonres">$1,027</span></div>
        </div>
        <div class="list-item">
          <div class="list-item__info">
            <div class="list-item__name">Deer Combo</div>
            <div class="list-item__meta">One deer tag (either species)</div>
          </div>
          <div class="list-item__costs"><span class="cost-res">$20</span> / <span class="cost-nonres">$527</span></div>
        </div>
        <div class="list-item">
          <div class="list-item__info">
            <div class="list-item__name">Elk Tag Only</div>
            <div class="list-item__meta">Single elk license</div>
          </div>
          <div class="list-item__costs"><span class="cost-res">$20</span> / <span class="cost-nonres">$877</span></div>
        </div>
        <div class="list-item">
          <div class="list-item__info">
            <div class="list-item__name">Black Bear</div>
            <div class="list-item__meta">Spring or fall season</div>
          </div>
          <div class="list-item__costs"><span class="cost-res">$19</span> / <span class="cost-nonres">$350</span></div>
        </div>
      </div>
    </section>

    <section class="section" style="animation: fadeUp 0.8s ease 0.4s both">
      <div class="section__title">Resources</div>
      <div class="list-card">
        <a href="https://fwp.mt.gov" target="_blank" class="list-item">
          <div class="list-item__info">
            <div class="list-item__name">Montana FWP</div>
            <div class="list-item__meta">fwp.mt.gov — Official regulations and license sales</div>
          </div>
          <span class="link-arrow">→</span>
        </a>
        <a href="https://fwp.mt.gov/hunt/regulations" target="_blank" class="list-item">
          <div class="list-item__info">
            <div class="list-item__name">Hunting Regulations</div>
            <div class="list-item__meta">Current season regulations and special rules</div>
          </div>
          <span class="link-arrow">→</span>
        </a>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useApi } from '../composables/useApi.js'

const { data } = useApi('/api/tags')

const steps = [
  { title: 'Create an FWP Account', desc: 'Visit fwp.mt.gov and create an account. You\'ll need your ALS number.' },
  { title: 'Buy a Conservation License', desc: 'Required before purchasing any hunting license. $8 resident / $10 non-resident.' },
  { title: 'Purchase Your License', desc: 'Buy general deer/elk OTC starting March 1, or apply for special permits by deadlines.' },
  { title: 'Complete Hunter Education', desc: 'Required for first-time hunters. Online and in-person courses available.' },
  { title: 'Get Your Tag', desc: 'Print your license and tags. Carry them while hunting. Tag game immediately upon harvest.' },
]

function formatDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function daysUntil(d) {
  return Math.max(0, Math.ceil((new Date(d) - new Date()) / 86400000))
}
</script>

<style scoped>
.tags-view { padding-top: 40px; }
@media (min-width: 768px) { .tags-view { padding-top: 20px; } }

.header { margin-bottom: 24px; }
.page-title { font-size: 1.8rem; font-weight: 700; letter-spacing: -0.02em; }
.page-sub { color: var(--text-secondary); font-size: 0.9rem; margin-top: 8px; }
.section { margin-bottom: 24px; }
.section__title { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-dim); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
.section__title::after { content: ''; flex: 1; height: 1px; background: var(--border); }

.card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
.card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 18px 20px; transition: background 0.2s; }
.card:hover { background: var(--bg-card-hover); }
.card__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.card__type { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; color: var(--text-dim); letter-spacing: 0.1em; }
.card__name { font-weight: 600; font-size: 0.95rem; margin-bottom: 6px; }
.card__deadline { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: var(--text-secondary); margin-bottom: 8px; }
.card__costs { display: flex; gap: 16px; font-size: 0.75rem; color: var(--text-dim); font-family: 'JetBrains Mono', monospace; }
.card__notes { font-size: 0.75rem; color: var(--text-dim); margin-top: 8px; }

.badge { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; font-weight: 600; padding: 3px 8px; border-radius: 6px; }
.badge--gold { color: var(--accent-gold); background: rgba(229, 160, 13, 0.1); }
.badge--red { color: var(--accent-red); background: rgba(239, 68, 68, 0.1); }

.steps-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
.step { display: flex; gap: 16px; padding: 16px 20px; border-bottom: 1px solid var(--border); align-items: flex-start; }
.step:last-child { border-bottom: none; }
.step__num { width: 28px; height: 28px; border-radius: 8px; background: rgba(229, 160, 13, 0.1); color: var(--accent-gold); display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; font-weight: 600; flex-shrink: 0; }
.step__title { font-weight: 600; font-size: 0.9rem; margin-bottom: 4px; }
.step__desc { font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; }

.list-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
.list-item { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-bottom: 1px solid var(--border); transition: background 0.2s; }
.list-item:last-child { border-bottom: none; }
.list-item:hover { background: var(--bg-card-hover); }
.list-item__name { font-size: 0.85rem; font-weight: 500; }
.list-item__meta { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: var(--text-dim); margin-top: 2px; }
.list-item__costs { font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; white-space: nowrap; }
.cost-res { color: var(--accent-green); }
.cost-nonres { color: var(--accent-gold); }
.link-arrow { color: var(--accent-gold); font-size: 1.2rem; }
</style>
