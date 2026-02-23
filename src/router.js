import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from './views/DashboardView.vue'
import SeasonsView from './views/SeasonsView.vue'
import SpeciesView from './views/SpeciesView.vue'
import TagsView from './views/TagsView.vue'
import SpotsView from './views/SpotsView.vue'
import SpeciesDetailView from './views/SpeciesDetailView.vue'
import SpotDetailView from './views/SpotDetailView.vue'

const routes = [
  { path: '/', component: DashboardView },
  { path: '/seasons', component: SeasonsView },
  { path: '/species', component: SpeciesView },
  { path: '/tags', component: TagsView },
  { path: '/spots', component: SpotsView },
  { path: '/species/:id', component: SpeciesDetailView },
  { path: '/spots/:id', component: SpotDetailView },
]

export default createRouter({ history: createWebHistory(), routes })
