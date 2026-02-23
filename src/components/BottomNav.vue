<template>
  <nav class="bottom-nav">
    <router-link to="/" class="bottom-nav__item" :class="{ active: $route.path === '/' }">
      <House :size="20" />
      <span>Home</span>
    </router-link>
    <router-link to="/seasons" class="bottom-nav__item" :class="{ active: $route.path === '/seasons' }">
      <Calendar :size="20" />
      <span>Seasons</span>
    </router-link>
    <router-link to="/species" class="bottom-nav__item" :class="{ active: $route.path.startsWith('/species') }">
      <Target :size="20" />
      <span>Species</span>
    </router-link>
    <router-link to="/tags" class="bottom-nav__item" :class="{ active: $route.path === '/tags' }">
      <Ticket :size="20" />
      <span>Tags</span>
    </router-link>
    <router-link to="/spots" class="bottom-nav__item" :class="{ active: $route.path.startsWith('/spots') }">
      <MapPin :size="20" />
      <span>Spots</span>
    </router-link>
  </nav>
</template>

<script setup>
import { House, Calendar, Target, Ticket, MapPin } from 'lucide-vue-next'
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--bg-card);
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
  padding-bottom: calc(8px + env(safe-area-inset-bottom));
  z-index: 50;
}

.bottom-nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 4px 12px;
  color: var(--text-dim);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: color 0.2s;
}

.bottom-nav__item.active {
  color: var(--accent-gold);
}

@media (min-width: 768px) {
  .bottom-nav {
    display: none;
  }
}
</style>
