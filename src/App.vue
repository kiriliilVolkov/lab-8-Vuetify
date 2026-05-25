<template>
  <v-app>
    <v-main>
      <mainLayout />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import mainLayout from './components/mainLayout.vue'
import { provideDb, initDb, resetData } from './plugins/database'
import { onMounted } from 'vue'

const db = provideDb()

onMounted(async () => {
  try {
    await initDb(db)
    await resetData(db)
    console.log('База данных успешно инициализирована и заполнена данными')
  } catch (error) {
    console.error('Ошибка инициализации БД:', error)
  }
})
</script>