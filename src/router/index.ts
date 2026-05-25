import { createRouter, createWebHistory } from 'vue-router'
import Client from '@/pages/client.vue'
import Employee from '@/pages/employee.vue'
import Campaign from '@/pages/campaign.vue'
import Channel from '@/pages/channel.vue'
import AdMaterial from '@/pages/ad_material.vue'
import TargetAudience from '@/pages/TargetAudience.vue'
import CampaignStats from '@/pages/campaign_stats.vue'
import Index from '@/pages/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Index },
    { path: '/client', component: Client },
    { path: '/employee', component: Employee },
    { path: '/campaign', component: Campaign },
    { path: '/channel', component: Channel },
    { path: '/ad_material', component: AdMaterial },
    { path: '/target_audience', component: TargetAudience },
    { path: '/campaign_stats', component: CampaignStats },
  ],
})

export default router