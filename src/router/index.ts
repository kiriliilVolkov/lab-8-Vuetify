import { createRouter, createWebHistory } from 'vue-router'
import Client from '@/pages/client.vue'
import Employee from '@/pages/employee.vue'
import Campaign from '@/pages/campaign.vue'
import Channel from '@/pages/channel.vue'
import Ad_Material from '@/pages/ad_material.vue'
import Campaign_Stats from '@/pages/campaign_stats.vue'
import Index from '@/pages/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Index,
    },
    {
      path: '/client',
      component: Client,
    },
    {
      path: '/employee',
      component: Employee,
    },
    {
      path: '/campaign',
      component: Campaign,
    },
    {
      path: '/channel',
      component: Channel,
    },
    {
      path: '/ad_material',
      component: Ad_Material,
    },
    {
      path: '/campaign_stats',
      component: Campaign_Stats,
    },
  ],
})

export default router