<template>
  <v-container>
    <DataTable
      title="Рекламные материалы"
      :headers="headers"
      :items="materials"
      :loading="loading"
      @add="openDialog()"
      @edit="openDialog"
      @delete="deleteMaterial"
    />

    <EditDialog
      v-model="dialog"
      :title="dialogTitle"
      :is-edit="isEdit"
      :form-data="formData"
      @save="saveMaterial"
    >
      <template #default="{ formData, isEdit }">
        <v-text-field
          v-model="formData.material_id"
          label="ID материала"
          type="number"
          :rules="[v => !!v || 'ID обязателен']"
          :disabled="isEdit"
        />

        <v-text-field
          v-model="formData.material_name"
          label="Название материала"
          :rules="[v => !!v || 'Название обязательно']"
        />

        <v-select
          v-model="formData.material_type"
          label="Тип материала"
          :items="['Баннер', 'Видео', 'Статья', 'Email', 'Презентация']"
          :rules="[v => !!v || 'Тип обязателен']"
        />

        <v-text-field
          v-model="formData.creation_date"
          label="Дата создания"
          type="date"
          :rules="[v => !!v || 'Дата обязательна']"
        />

        <v-select
          v-model="formData.campaign_id"
          label="Кампания"
          :items="campaigns"
          item-title="campaign_name"
          item-value="campaign_id"
          :rules="[v => !!v || 'Кампания обязательна']"
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
const materials = ref([]);
const campaigns = ref([]);
const loading = ref(false);
const dialog = ref(false);
const isEdit = ref(false);

const headers = [
  { title: 'ID', key: 'material_id', sortable: true },
  { title: 'Название', key: 'material_name' },
  { title: 'Тип', key: 'material_type' },
  { title: 'Дата создания', key: 'creation_date' },
  { title: 'Кампания', key: 'campaign_name' },
  { title: 'Действия', key: 'actions', sortable: false }
];

const formData = ref({
  material_id: null,
  material_name: '',
  material_type: '',
  creation_date: '',
  campaign_id: null
});

const dialogTitle = ref('');

const loadMaterials = async () => {
  if (!db) return;
  loading.value = true;
  try {
    const result = await db.query(`
      SELECT m.*, c.campaign_name 
      FROM materials m
      JOIN campaigns c ON m.campaign_id = c.campaign_id
      ORDER BY m.material_id
    `);
    materials.value = result.rows;
  } catch (error) {
    console.error('Error loading materials:', error);
  } finally {
    loading.value = false;
  }
};

const loadCampaigns = async () => {
  if (!db) return;
  const result = await db.query('SELECT campaign_id, campaign_name FROM campaigns ORDER BY campaign_id');
  campaigns.value = result.rows;
};

const openDialog = (item = null) => {
  if (item) {
    isEdit.value = true;
    dialogTitle.value = 'Редактировать материал';
    formData.value = { ...item };
  } else {
    isEdit.value = false;
    dialogTitle.value = 'Добавить материал';
    formData.value = {
      material_id: null,
      material_name: '',
      material_type: '',
      creation_date: '',
      campaign_id: null
    };
  }
  dialog.value = true;
};

const saveMaterial = async () => {
  if (!db) return;
  try {
    if (isEdit.value) {
      await db.query(
        `UPDATE materials SET 
          material_name = $1, 
          material_type = $2, 
          creation_date = $3, 
          campaign_id = $4 
        WHERE material_id = $5`,
        [
          formData.value.material_name,
          formData.value.material_type,
          formData.value.creation_date,
          formData.value.campaign_id,
          formData.value.material_id
        ]
      );
    } else {
      await db.query(
        `INSERT INTO materials 
          (material_id, material_name, material_type, creation_date, campaign_id) 
        VALUES ($1, $2, $3, $4, $5)`,
        [
          formData.value.material_id,
          formData.value.material_name,
          formData.value.material_type,
          formData.value.creation_date,
          formData.value.campaign_id
        ]
      );
    }
    await loadMaterials();
    dialog.value = false;
  } catch (error) {
    console.error('Error saving material:', error);
  }
};

const deleteMaterial = async (item: any) => {
  if (!db) return;
  if (confirm(`Удалить материал "${item.material_name}"?`)) {
    try {
      await db.query('DELETE FROM materials WHERE material_id = $1', [item.material_id]);
      await loadMaterials();
    } catch (error) {
      console.error('Error deleting material:', error);
    }
  }
};

onMounted(() => {
  loadMaterials();
  loadCampaigns();
});
</script>