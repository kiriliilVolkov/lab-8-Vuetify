<template>
  <v-container>
    <DataTable
      title="Целевая аудитория"
      :headers="headers"
      :items="audiences"
      :loading="loading"
      @add="openDialog()"
      @edit="openDialog"
      @delete="deleteAudience"
    />

    <EditDialog
      v-model="dialog"
      :title="dialogTitle"
      :is-edit="isEdit"
      :form-data="formData"
      @save="saveAudience"
    >
      <template #default="{ formData, isEdit }">
        <v-text-field
          v-model="formData.audience_id"
          label="ID аудитории"
          type="number"
          :rules="[v => !!v || 'ID обязателен']"
          :disabled="isEdit"
        />

        <v-select
          v-model="formData.age_category"
          label="Возрастная категория"
          :items="['18-25', '26-35', '36-50', '50+']"
          :rules="[v => !!v || 'Возрастная категория обязательна']"
        />

        <v-select
          v-model="formData.gender"
          label="Пол"
          :items="['М', 'Ж']"
          :rules="[v => !!v || 'Пол обязателен']"
        />

        <v-text-field
          v-model="formData.region"
          label="Регион"
          :rules="[v => !!v || 'Регион обязателен']"
        />

        <v-text-field
          v-model="formData.interests"
          label="Интересы"
          :rules="[v => !!v || 'Интересы обязательны']"
        />

        <v-select
          v-model="formData.income_level"
          label="Уровень дохода"
          :items="['Низкий', 'Средний', 'Высокий']"
          :rules="[v => !!v || 'Уровень дохода обязателен']"
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
const audiences = ref([]);
const loading = ref(false);
const dialog = ref(false);
const isEdit = ref(false);

const headers = [
  { title: 'ID', key: 'audience_id', sortable: true },
  { title: 'Возраст', key: 'age_category' },
  { title: 'Пол', key: 'gender' },
  { title: 'Регион', key: 'region' },
  { title: 'Интересы', key: 'interests' },
  { title: 'Уровень дохода', key: 'income_level' },
  { title: 'Действия', key: 'actions', sortable: false }
];

const formData = ref({
  audience_id: null,
  age_category: '',
  gender: '',
  region: '',
  interests: '',
  income_level: ''
});

const dialogTitle = ref('');

const loadAudiences = async () => {
  if (!db) return;
  loading.value = true;
  try {
    const result = await db.query('SELECT * FROM target_audiences ORDER BY audience_id');
    audiences.value = result.rows;
  } catch (error) {
    console.error('Error loading audiences:', error);
  } finally {
    loading.value = false;
  }
};

const openDialog = (item = null) => {
  if (item) {
    isEdit.value = true;
    dialogTitle.value = 'Редактировать аудиторию';
    formData.value = { ...item };
  } else {
    isEdit.value = false;
    dialogTitle.value = 'Добавить аудиторию';
    formData.value = {
      audience_id: null,
      age_category: '',
      gender: '',
      region: '',
      interests: '',
      income_level: ''
    };
  }
  dialog.value = true;
};

const saveAudience = async () => {
  if (!db) return;
  try {
    if (isEdit.value) {
      await db.query(
        `UPDATE target_audiences SET 
          age_category = $1, 
          gender = $2, 
          region = $3, 
          interests = $4, 
          income_level = $5 
        WHERE audience_id = $6`,
        [
          formData.value.age_category,
          formData.value.gender,
          formData.value.region,
          formData.value.interests,
          formData.value.income_level,
          formData.value.audience_id
        ]
      );
    } else {
      await db.query(
        `INSERT INTO target_audiences 
          (audience_id, age_category, gender, region, interests, income_level) 
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          formData.value.audience_id,
          formData.value.age_category,
          formData.value.gender,
          formData.value.region,
          formData.value.interests,
          formData.value.income_level
        ]
      );
    }
    await loadAudiences();
    dialog.value = false;
  } catch (error) {
    console.error('Error saving audience:', error);
  }
};

const deleteAudience = async (item: any) => {
  if (!db) return;
  if (confirm(`Удалить аудиторию (${item.age_category}, ${item.gender}, ${item.region})?`)) {
    try {
      await db.query('DELETE FROM target_audiences WHERE audience_id = $1', [item.audience_id]);
      await loadAudiences();
    } catch (error) {
      console.error('Error deleting audience:', error);
    }
  }
};

onMounted(() => {
  loadAudiences();
});
</script>