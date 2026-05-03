<template>
  <v-card>
    <v-card-title>Каналы продвижения</v-card-title>
    <v-divider></v-divider>
    <v-table>
      <thead>
        <tr>
          <th>channel_id</th>
          <th>channel_name</th>
          <th>channel_type</th>
          <th>placement_cost</th>
          <th>audience_reach</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="channel in channels" :key="channel.channel_id">
          <td>{{ channel.channel_id }}</td>
          <td>{{ channel.channel_name }}</td>
          <td>{{ channel.channel_type }}</td>
          <td>{{ channel.placement_cost.toLocaleString() }} ₽</td>
          <td>{{ channel.audience_reach.toLocaleString() }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const channels = ref([
  { channel_id: 1, channel_name: 'Яндекс.Директ', channel_type: 'Контекстная реклама', placement_cost: 15000, audience_reach: 4500000 },
  { channel_id: 2, channel_name: 'VK Реклама', channel_type: 'Соцсети', placement_cost: 12000, audience_reach: 7200000 },
  { channel_id: 3, channel_name: 'Telegram Ads', channel_type: 'Мессенджер', placement_cost: 25000, audience_reach: 3100000 },
  { channel_id: 4, channel_name: 'YouTube', channel_type: 'Видеохостинг', placement_cost: 42000, audience_reach: 8900000 },
])
</script>