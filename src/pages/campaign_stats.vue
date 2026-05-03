<template>
  <v-card>
    <v-card-title>Статистика кампаний</v-card-title>
    <v-divider></v-divider>
    <v-table>
      <thead>
        <tr>
          <th>state_id</th>
          <th>impressions</th>
          <th>clicks</th>
          <th>conversions</th>
          <th>cost</th>
          <th>date</th>
          <th>campaign_id</th>
          <th>channel_id</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="stat in statistics" :key="stat.state_id">
          <td>{{ stat.state_id }}</td>
          <td>{{ stat.impressions.toLocaleString() }}</td>
          <td>{{ stat.clicks.toLocaleString() }}</td>
          <td>{{ stat.conversions }}</td>
          <td>{{ stat.cost.toLocaleString() }} ₽</td>
          <td>{{ stat.date }}</td>
          <td>{{ stat.campaign_id }}</td>
          <td>{{ stat.channel_id }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const statistics = ref([
  { state_id: 1, impressions: 124500, clicks: 5430, conversions: 420, cost: 18750, date: '2025-03-15', campaign_id: 201, channel_id: 1 },
  { state_id: 2, impressions: 98700, clicks: 4100, conversions: 298, cost: 12640, date: '2025-03-16', campaign_id: 201, channel_id: 2 },
  { state_id: 3, impressions: 214000, clicks: 12200, conversions: 1150, cost: 45320, date: '2025-05-10', campaign_id: 202, channel_id: 3 },
  { state_id: 4, impressions: 56780, clicks: 2890, conversions: 179, cost: 8750, date: '2025-05-12', campaign_id: 202, channel_id: 1 },
])
</script>