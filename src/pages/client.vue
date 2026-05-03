<template>
  <v-card>
    <v-card-title>Клиенты</v-card-title>
    <v-divider></v-divider>
    <v-table>
      <thead>
        <tr>
          <th>client_id</th>
          <th>client_name</th>
          <th>client_email</th>
          <th>client_industry</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="client in clients" :key="client.client_id">
          <td>{{ client.client_id }}</td>
          <td>{{ client.client_name }}</td>
          <td>{{ client.client_email }}</td>
          <td>{{ client.client_industry }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const clients = ref([
  { client_id: 101, client_name: 'ООО "Рекламный Холдинг"', client_email: 'info@holding.ru', client_industry: 'Маркетинг' },
  { client_id: 102, client_name: 'ТД "Электроника+"', client_email: 'sales@electronica.ru', client_industry: 'Ритейл' },
  { client_id: 103, client_name: 'Косметикс Групп', client_email: 'hello@cosmetics.ru', client_industry: 'Красота' },
  { client_id: 104, client_name: 'Автоцентр "Премиум"', client_email: 'pr@premium-auto.ru', client_industry: 'Автобизнес' },
])
</script>