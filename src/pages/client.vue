<template>
  <v-container>
    <DataTable
      title="Клиенты"
      :headers="headers"
      :items="clients"
      :loading="loading"
      @add="openDialog()"
      @edit="openDialog"
      @delete="deleteClient"
    />

    <EditDialog
      v-model="dialog"
      :title="dialogTitle"
      :is-edit="isEdit"
      :form-data="formData"
      @save="saveClient"
    >
      <template #default="{ formData, isEdit }">
        <v-text-field
          v-model="formData.client_id"
          label="ID клиента"
          type="number"
          :rules="[v => !!v || 'ID обязателен']"
          :disabled="isEdit"
        />

        <v-select
          v-model="formData.client_type"
          label="Тип клиента"
          :items="['Юр лицо', 'Физ лицо']"
          :rules="[v => !!v || 'Тип обязателен']"
        />

        <v-text-field
          v-model="formData.client_name"
          label="Название / ФИО"
          :rules="[v => !!v || 'Название обязательно']"
        />

        <v-text-field
          v-model="formData.phone_number"
          label="Телефон"
          :rules="[v => !!v || 'Телефон обязателен']"
        />

        <v-text-field
          v-model="formData.business_area"
          label="Сфера деятельности"
          :rules="[v => !!v || 'Сфера обязательна']"
        />

        <v-text-field
          v-model="formData.client_address"
          label="Адрес"
          :rules="[v => !!v || 'Адрес обязателен']"
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
const clients = ref([]);
const loading = ref(false);
const dialog = ref(false);
const isEdit = ref(false);

const headers = [
  { title: 'ID', key: 'client_id', sortable: true },
  { title: 'Тип', key: 'client_type' },
  { title: 'Название', key: 'client_name' },
  { title: 'Телефон', key: 'phone_number' },
  { title: 'Сфера', key: 'business_area' },
  { title: 'Адрес', key: 'client_address' },
  { title: 'Действия', key: 'actions', sortable: false }
];

const formData = ref({
  client_id: null,
  client_type: '',
  client_name: '',
  phone_number: '',
  business_area: '',
  client_address: ''
});

const dialogTitle = ref('');

const loadClients = async () => {
  if (!db) return;
  loading.value = true;
  try {
    const result = await db.query('SELECT * FROM clients ORDER BY client_id');
    clients.value = result.rows;
  } catch (error) {
    console.error('Error loading clients:', error);
  } finally {
    loading.value = false;
  }
};

const openDialog = (item = null) => {
  if (item) {
    isEdit.value = true;
    dialogTitle.value = 'Редактировать клиента';
    formData.value = { ...item };
  } else {
    isEdit.value = false;
    dialogTitle.value = 'Добавить клиента';
    formData.value = {
      client_id: null,
      client_type: '',
      client_name: '',
      phone_number: '',
      business_area: '',
      client_address: ''
    };
  }
  dialog.value = true;
};

const saveClient = async () => {
  if (!db) return;
  try {
    if (isEdit.value) {
      await db.query(
        `UPDATE clients SET 
          client_type = $1, 
          client_name = $2, 
          phone_number = $3, 
          business_area = $4, 
          client_address = $5 
        WHERE client_id = $6`,
        [
          formData.value.client_type,
          formData.value.client_name,
          formData.value.phone_number,
          formData.value.business_area,
          formData.value.client_address,
          formData.value.client_id
        ]
      );
    } else {
      await db.query(
        `INSERT INTO clients 
          (client_id, client_type, client_name, phone_number, business_area, client_address) 
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          formData.value.client_id,
          formData.value.client_type,
          formData.value.client_name,
          formData.value.phone_number,
          formData.value.business_area,
          formData.value.client_address
        ]
      );
    }
    await loadClients();
    dialog.value = false;
  } catch (error) {
    console.error('Error saving client:', error);
  }
};

const deleteClient = async (item: any) => {
  if (!db) return;
  if (confirm(`Удалить клиента "${item.client_name}"?`)) {
    try {
      await db.query('DELETE FROM clients WHERE client_id = $1', [item.client_id]);
      await loadClients();
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  }
};

onMounted(() => {
  loadClients();
});
</script>