<template>
  <v-card>
    <v-card-title class="d-flex justify-space-between align-center">
      <span>{{ title }}</span>
      <v-btn color="primary" @click="$emit('add')">
        <v-icon left>mdi-plus</v-icon>
        Добавить
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-text-field
        v-model="search"
        label="Поиск"
        prepend-inner-icon="mdi-magnify"
        density="compact"
        hide-details
        class="mb-4"
      />
      
      <v-data-table
        :headers="headers"
        :items="items"
        :loading="loading"
        :search="search"
        :items-per-page="10"
        class="elevation-1"
      >
        <template #item.actions="{ item }">
          <v-icon color="primary" class="mr-2" size="small" @click="$emit('edit', item)">
            mdi-pencil
          </v-icon>
          <v-icon color="error" size="small" @click="$emit('delete', item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  title: string;
  headers: any[];
  items: any[];
  loading: boolean;
}>();

defineEmits<{
  (e: 'add'): void;
  (e: 'edit', item: any): void;
  (e: 'delete', item: any): void;
}>();

const search = ref('');
</script>