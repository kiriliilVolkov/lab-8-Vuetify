<template>
  <v-container>
    <DataTable
      title="Каналы продвижения"
      :headers="headers"
      :items="channels"
      :loading="loading"
      @add="openDialog()"
      @edit="openDialog"
      @delete="deleteChannel"
    />

    <EditDialog
      v-model="dialog"
      :title="dialogTitle"
      :is-edit="isEdit"
      :form-data="formData"
      @save="saveChannel"
    >
      <template #default="{ formData, isEdit }">
        <v-text-field
          v-model="formData.channel_id"
          label="ID канала"
          type="number"
          :rules="[v => !!v || 'ID обязателен']"
          :disabled="isEdit"
        />

        <v-text-field
          v-model="formData.channel_name"
          label="Название канала"
          :rules="[v => !!v || 'Название обязательно']"
        />

        <v-select
          v-model="formData.channel_type"
          label="Тип канала"
          :items="['Social', 'Search', 'Video', 'Display', 'Offline', 'Direct', 'Organic', 'Mobile', 'Content', 'Ecom', 'Partner', 'Audio', 'Media']"
          :rules="[v => !!v || 'Тип обязателен']"
        />

        <v-text-field
          v-model="formData.placement_cost"
          label="Стоимость размещения"
          type="number"
          prefix="₽"
          :rules="[v => !!v || 'Стоимость обязательна']"
        />

        <v-text-field
          v-model="formData.audience_reach"
          label="Охват аудитории"
          type="number"
          suffix="чел."
          :rules="[v => !!v || 'Охват обязателен']"
        />
      </template>
    </EditDialog>
  </v-container>
</template>

<script setup lang="ts">
import { inject, ref, onMounted } from 'vue';
import { PGLiteKey } from '@/plugins/database';
import DataTable from '@/components/DataTable.vue';
import EditDialog from '@/components/EditDialog.vue';

const db = inject(PGLiteKey);
const channels = ref([]);
const loading = ref(false);
const dialog = ref(false);
const isEdit = ref(false);

const headers = [
  { title: 'ID', key: 'channel_id', sortable: true },
  { title: 'Название', key: 'channel_name' },
  { title: 'Тип', key: 'channel_type' },
  { title: 'Стоимость размещения', key: 'placement_cost' },
  { title: 'Охват аудитории', key: 'audience_reach' },
  { title: 'Действия', key: 'actions', sortable: false }
];

const formData = ref({
  channel_id: null,
  channel_name: '',
  channel_type: '',
  placement_cost: null,
  audience_reach: null
});

const dialogTitle = ref('');

const loadChannels = async () => {
  if (!db) return;
  loading.value = true;
  try {
    const result = await db.query('SELECT * FROM channels ORDER BY channel_id');
    channels.value = result.rows;
  } catch (error) {
    console.error('Error loading channels:', error);
  } finally {
    loading.value = false;
  }
};

const openDialog = (item = null) => {
  if (item) {
    isEdit.value = true;
    dialogTitle.value = 'Редактировать канал';
    formData.value = { ...item };
  } else {
    isEdit.value = false;
    dialogTitle.value = 'Добавить канал';
    formData.value = {
      channel_id: null,
      channel_name: '',
      channel_type: '',
      placement_cost: null,
      audience_reach: null
    };
  }
  dialog.value = true;
};

const saveChannel = async () => {
  if (!db) return;
  try {
    if (isEdit.value) {
      await db.query(
        `UPDATE channels SET 
          channel_name = $1, 
          channel_type = $2, 
          placement_cost = $3, 
          audience_reach = $4 
        WHERE channel_id = $5`,
        [
          formData.value.channel_name,
          formData.value.channel_type,
          formData.value.placement_cost,
          formData.value.audience_reach,
          formData.value.channel_id
        ]
      );
    } else {
      await db.query(
        `INSERT INTO channels 
          (channel_id, channel_name, channel_type, placement_cost, audience_reach) 
        VALUES ($1, $2, $3, $4, $5)`,
        [
          formData.value.channel_id,
          formData.value.channel_name,
          formData.value.channel_type,
          formData.value.placement_cost,
          formData.value.audience_reach
        ]
      );
    }
    await loadChannels();
    dialog.value = false;
  } catch (error) {
    console.error('Error saving channel:', error);
  }
};

const deleteChannel = async (item: any) => {
  if (!db) return;
  if (confirm(`Удалить канал "${item.channel_name}"?`)) {
    try {
      await db.query('DELETE FROM channels WHERE channel_id = $1', [item.channel_id]);
      await loadChannels();
    } catch (error) {
      console.error('Error deleting channel:', error);
    }
  }
};

onMounted(() => {
  loadChannels();
});
</script>