<template>
  <nav class="app-nav">
    <div class="app-nav__inner">
      <router-link to="/" class="app-nav__logo">
        <span class="app-nav__title">HUNT MONTANA</span>
        <span class="app-nav__tagline">Western MT Guide</span>
      </router-link>
      <div class="app-nav__links">
        <router-link to="/" class="app-nav__link" :class="{ active: $route.path === '/' }">
          <House :size="16" /> Dashboard
        </router-link>
        <router-link to="/seasons" class="app-nav__link" :class="{ active: $route.path === '/seasons' }">
          <Calendar :size="16" /> Seasons
        </router-link>
        <router-link to="/species" class="app-nav__link" :class="{ active: $route.path.startsWith('/species') }">
          <Target :size="16" /> Species
        </router-link>
        <router-link to="/tags" class="app-nav__link" :class="{ active: $route.path === '/tags' }">
          <Ticket :size="16" /> Tags
        </router-link>
        <router-link to="/spots" class="app-nav__link" :class="{ active: $route.path.startsWith('/spots') }">
          <MapPin :size="16" /> Spots
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { House, Calendar, Target, Ticket, MapPin } from 'lucide-vue-next'
</script>

<style scoped>
.app-nav {
  display: none;
}

@media (min-width: 768px) {
  .app-nav {
    display: block;
    border-bottom: 1px solid var(--border);
    background: var(--bg-deep);
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .app-nav__inner {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
  }

  .app-nav__logo {
    display: flex;
    align-items: baseline;
    gap: 12px;
  }

  .app-nav__title {
    font-family: 'Outfit', sans-serif;
    font-weight: 700;
    font-size: 1.1rem;
    letter-spacing: 0.05em;
    color: var(--accent-gold);
  }

  .app-nav__tagline {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    color: var(--text-dim);
    text-transform: uppercase;
    letter-spacing: 0.15em;
  }

  .app-nav__links {
    display: flex;
    gap: 4px;
  }

  .app-nav__link {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border-radius: 8px;
    font-size: 0.8rem;
    color: var(--text-secondary);
    transition: all 0.2s;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.05em;
  }

  .app-nav__link:hover {
    color: var(--text-primary);
    background: var(--bg-card);
  }

  .app-nav__link.active {
    color: var(--accent-gold);
    background: rgba(229, 160, 13, 0.08);
  }
}
</style>
