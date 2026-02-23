<template>
  <div class="app">
    <AppNav />
    <main class="main-content">
      <router-view />
    </main>
    <BottomNav />
  </div>
</template>

<script setup>
import AppNav from './components/AppNav.vue'
import BottomNav from './components/BottomNav.vue'
</script>

<style>
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --bg-deep: #08090c;
  --bg-card: #0f1117;
  --bg-card-hover: #161922;
  --border: #1a1d28;
  --border-hover: #2a2f3e;
  --text-primary: #e8eaf0;
  --text-secondary: #6b7084;
  --text-dim: #3d4155;
  --accent-gold: #e5a00d;
  --accent-cyan: #3fc1f0;
  --accent-green: #22c55e;
  --accent-red: #ef4444;
}

html { font-size: 16px; }

body {
  background: var(--bg-deep);
  color: var(--text-primary);
  font-family: 'Outfit', sans-serif;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
}

body::before {
  content: '';
  position: fixed;
  inset: 0;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 100;
}

a { color: inherit; text-decoration: none; }

.main-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px 100px;
  position: relative;
  z-index: 1;
}

@media (min-width: 768px) {
  .main-content {
    padding: 0 32px 60px;
  }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
