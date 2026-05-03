<template>
  <v-card>
    <v-card-title>Рекламные кампании</v-card-title>
    <v-divider></v-divider>
    <v-table>
      <thead>
        <tr>
          <th>campaign_id</th>
          <th>campaign_name</th>
          <th>start_date</th>
          <th>end_date</th>
          <th>budget</th>
          <th>goal</th>
          <th>status</th>
          <th>client_id</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="camp in campaigns" :key="camp.campaign_id">
          <td>{{ camp.campaign_id }}</td>
          <td>{{ camp.campaign_name }}</td>
          <td>{{ camp.start_date }}</td>
          <td>{{ camp.end_date }}</td>
          <td>{{ camp.budget.toLocaleString() }} ₽</td>
          <td>{{ camp.goal }}</td>
          <td>{{ camp.status }}</td>
          <td>{{ camp.client_id }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const campaigns = ref([
  { campaign_id: 201, campaign_name: 'Летняя распродажа', start_date: '2025-06-01', end_date: '2025-08-31', budget: 450000, goal: 'Повышение продаж', status: 'Активна', client_id: 101 },
  { campaign_id: 202, campaign_name: 'Бренд-имидж 2025', start_date: '2025-03-10', end_date: '2025-10-20', budget: 890000, goal: 'Узнаваемость бренда', status: 'Активна', client_id: 102 },
  { campaign_id: 203, campaign_name: 'Черная пятница', start_date: '2025-11-01', end_date: '2025-11-30', budget: 1250000, goal: 'Конверсии', status: 'Запланирована', client_id: 103 },
])
</script>