<template>
  <v-card>
    <v-card-title>Креативные материалы</v-card-title>
    <v-divider></v-divider>
    <v-table>
      <thead>
        <tr>
          <th>material_id</th>
          <th>material_format</th>
          <th>content</th>
          <th>creation_date</th>
          <th>campaign_id</th>
          <th>channel_id</th>
          <th>employee_id</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="material in materials" :key="material.material_id">
          <td>{{ material.material_id }}</td>
          <td>{{ material.material_format }}</td>
          <td>{{ material.content }}</td>
          <td>{{ material.creation_date }}</td>
          <td>{{ material.campaign_id }}</td>
          <td>{{ material.channel_id }}</td>
          <td>{{ material.employee_id }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const materials = ref([
  { material_id: 401, material_format: 'Видео', content: 'Ролик "Летний движ" 30s', creation_date: '2025-05-20', campaign_id: 201, channel_id: 3, employee_id: 301 },
  { material_id: 402, material_format: 'Баннер', content: '728x90 промо баннер', creation_date: '2025-05-22', campaign_id: 201, channel_id: 1, employee_id: 302 },
  { material_id: 403, material_format: 'Текст', content: 'SEO статья про бренд', creation_date: '2025-02-10', campaign_id: 202, channel_id: 4, employee_id: 303 },
])
</script>