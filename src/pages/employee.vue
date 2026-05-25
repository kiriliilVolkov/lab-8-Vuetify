<template>
  <v-container>
    <DataTable
      title="Сотрудники"
      :headers="headers"
      :items="employees"
      :loading="loading"
      @add="openDialog()"
      @edit="openDialog"
      @delete="deleteEmployee"
    />

    <EditDialog
      v-model="dialog"
      :title="dialogTitle"
      :is-edit="isEdit"
      :form-data="formData"
      @save="saveEmployee"
    >
      <template #default="{ formData, isEdit }">
        <v-text-field
          v-model="formData.employee_id"
          label="ID сотрудника"
          type="number"
          :rules="[v => !!v || 'ID обязателен']"
          :disabled="isEdit"
        />

        <v-text-field
          v-model="formData.last_name"
          label="Фамилия"
          :rules="[v => !!v || 'Фамилия обязательна']"
        />

        <v-text-field
          v-model="formData.first_name"
          label="Имя"
          :rules="[v => !!v || 'Имя обязательно']"
        />

        <v-text-field
          v-model="formData.middle_name"
          label="Отчество"
        />

        <v-text-field
          v-model="formData.position"
          label="Должность"
          :rules="[v => !!v || 'Должность обязательна']"
        />

        <v-select
          v-model="formData.access_level"
          label="Уровень доступа"
          :items="['A1', 'A2', 'A3']"
          :rules="[v => !!v || 'Уровень доступа обязателен']"
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
const employees = ref([]);
const loading = ref(false);
const dialog = ref(false);
const isEdit = ref(false);

const headers = [
  { title: 'ID', key: 'employee_id', sortable: true },
  { title: 'Фамилия', key: 'last_name' },
  { title: 'Имя', key: 'first_name' },
  { title: 'Отчество', key: 'middle_name' },
  { title: 'Должность', key: 'position' },
  { title: 'Уровень доступа', key: 'access_level' },
  { title: 'Действия', key: 'actions', sortable: false }
];

const formData = ref({
  employee_id: null,
  last_name: '',
  first_name: '',
  middle_name: '',
  position: '',
  access_level: ''
});

const dialogTitle = ref('');

const loadEmployees = async () => {
  if (!db) return;
  loading.value = true;
  try {
    const result = await db.query('SELECT * FROM employees ORDER BY employee_id');
    employees.value = result.rows;
  } catch (error) {
    console.error('Error loading employees:', error);
  } finally {
    loading.value = false;
  }
};

const openDialog = (item = null) => {
  if (item) {
    isEdit.value = true;
    dialogTitle.value = 'Редактировать сотрудника';
    formData.value = { ...item };
  } else {
    isEdit.value = false;
    dialogTitle.value = 'Добавить сотрудника';
    formData.value = {
      employee_id: null,
      last_name: '',
      first_name: '',
      middle_name: '',
      position: '',
      access_level: ''
    };
  }
  dialog.value = true;
};

const saveEmployee = async () => {
  if (!db) return;
  try {
    if (isEdit.value) {
      await db.query(
        `UPDATE employees SET 
          last_name = $1, 
          first_name = $2, 
          middle_name = $3, 
          position = $4, 
          access_level = $5 
        WHERE employee_id = $6`,
        [
          formData.value.last_name,
          formData.value.first_name,
          formData.value.middle_name,
          formData.value.position,
          formData.value.access_level,
          formData.value.employee_id
        ]
      );
    } else {
      await db.query(
        `INSERT INTO employees 
          (employee_id, last_name, first_name, middle_name, position, access_level) 
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          formData.value.employee_id,
          formData.value.last_name,
          formData.value.first_name,
          formData.value.middle_name,
          formData.value.position,
          formData.value.access_level
        ]
      );
    }
    await loadEmployees();
    dialog.value = false;
  } catch (error) {
    console.error('Error saving employee:', error);
  }
};

const deleteEmployee = async (item: any) => {
  if (!db) return;
  if (confirm(`Удалить сотрудника "${item.last_name} ${item.first_name}"?`)) {
    try {
      await db.query('DELETE FROM employees WHERE employee_id = $1', [item.employee_id]);
      await loadEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  }
};

onMounted(() => {
  loadEmployees();
});
</script>