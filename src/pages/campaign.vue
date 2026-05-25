<template>
  <v-container>
    <DataTable
      title="Кампании"
      :headers="headers"
      :items="campaigns"
      :loading="loading"
      @add="openDialog()"
      @edit="openDialog"
      @delete="deleteCampaign"
    />

    <EditDialog
      v-model="dialog"
      :title="dialogTitle"
      :is-edit="isEdit"
      :form-data="formData"
      @save="saveCampaign"
    >
      <template #default="{ formData, isEdit }">
        <v-text-field
          v-model="formData.campaign_id"
          label="ID кампании"
          type="number"
          :rules="[v => !!v || 'ID обязателен']"
          :disabled="isEdit"
        />

        <v-text-field
          v-model="formData.campaign_name"
          label="Название кампании"
          :rules="[v => !!v || 'Название обязательно']"
        />

        <v-text-field
          v-model="formData.start_date"
          label="Дата начала"
          type="date"
          :rules="[v => !!v || 'Дата обязательна']"
        />

        <v-text-field
          v-model="formData.end_date"
          label="Дата окончания"
          type="date"
          :rules="[v => !!v || 'Дата обязательна']"
        />

        <v-text-field
          v-model="formData.budget"
          label="Бюджет"
          type="number"
          prefix="₽"
          :rules="[v => !!v || 'Бюджет обязателен']"
        />

        <v-text-field
          v-model="formData.goal"
          label="Цель"
          :rules="[v => !!v || 'Цель обязательна']"
        />

        <v-select
          v-model="formData.status"
          label="Статус"
          :items="['Активна', 'Завершена', 'Планируется']"
          :rules="[v => !!v || 'Статус обязателен']"
        />

        <v-select
          v-model="formData.client_id"
          label="Клиент"
          :items="clientsList"
          item-title="client_name"
          item-value="client_id"
          :rules="[v => !!v || 'Клиент обязателен']"
        />

        <v-text-field
          v-model="formData.views"
          label="Просмотры"
          type="number"
        />

        <v-text-field
          v-model="formData.clicks"
          label="Клики"
          type="number"
        />

        <v-text-field
          v-model="formData.sales"
          label="Продажи"
          type="number"
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
const campaigns = ref([]);
const clientsList = ref([]);
const loading = ref(false);
const dialog = ref(false);
const isEdit = ref(false);

const headers = [
  { title: 'ID', key: 'campaign_id', sortable: true },
  { title: 'Название', key: 'campaign_name' },
  { title: 'Дата начала', key: 'start_date' },
  { title: 'Дата окончания', key: 'end_date' },
  { title: 'Бюджет', key: 'budget' },
  { title: 'Цель', key: 'goal' },
  { title: 'Статус', key: 'status' },
  { title: 'Клиент', key: 'client_name' },
  { title: 'Просмотры', key: 'views' },
  { title: 'Клики', key: 'clicks' },
  { title: 'Продажи', key: 'sales' },
  { title: 'Действия', key: 'actions', sortable: false }
];

const formData = ref({
  campaign_id: null,
  campaign_name: '',
  start_date: '',
  end_date: '',
  budget: null,
  goal: '',
  status: '',
  client_id: null,
  views: 0,
  clicks: 0,
  sales: 0
});

const dialogTitle = ref('');

const loadCampaigns = async () => {
  if (!db) return;
  loading.value = true;
  try {
    const result = await db.query(`
      SELECT c.*, cl.client_name 
      FROM campaigns c
      JOIN clients cl ON c.client_id = cl.client_id
      ORDER BY c.campaign_id
    `);
    campaigns.value = result.rows;
  } catch (error) {
    console.error('Error loading campaigns:', error);
  } finally {
    loading.value = false;
  }
};

const loadClients = async () => {
  if (!db) return;
  const result = await db.query('SELECT client_id, client_name FROM clients ORDER BY client_id');
  clientsList.value = result.rows;
};

const openDialog = (item = null) => {
  if (item) {
    isEdit.value = true;
    dialogTitle.value = 'Редактировать кампанию';
    formData.value = { ...item };
  } else {
    isEdit.value = false;
    dialogTitle.value = 'Добавить кампанию';
    formData.value = {
      campaign_id: null,
      campaign_name: '',
      start_date: '',
      end_date: '',
      budget: null,
      goal: '',
      status: '',
      client_id: null,
      views: 0,
      clicks: 0,
      sales: 0
    };
  }
  dialog.value = true;
};

const saveCampaign = async () => {
  if (!db) return;
  try {
    if (isEdit.value) {
      await db.query(
        `UPDATE campaigns SET 
          campaign_name = $1, 
          start_date = $2, 
          end_date = $3, 
          budget = $4, 
          goal = $5, 
          status = $6, 
          client_id = $7,
          views = $8,
          clicks = $9,
          sales = $10
        WHERE campaign_id = $11`,
        [
          formData.value.campaign_name,
          formData.value.start_date,
          formData.value.end_date,
          formData.value.budget,
          formData.value.goal,
          formData.value.status,
          formData.value.client_id,
          formData.value.views,
          formData.value.clicks,
          formData.value.sales,
          formData.value.campaign_id
        ]
      );
    } else {
      await db.query(
        `INSERT INTO campaigns 
          (campaign_id, campaign_name, start_date, end_date, budget, goal, status, client_id, views, clicks, sales) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          formData.value.campaign_id,
          formData.value.campaign_name,
          formData.value.start_date,
          formData.value.end_date,
          formData.value.budget,
          formData.value.goal,
          formData.value.status,
          formData.value.client_id,
          formData.value.views,
          formData.value.clicks,
          formData.value.sales
        ]
      );
    }
    await loadCampaigns();
    dialog.value = false;
  } catch (error) {
    console.error('Error saving campaign:', error);
  }
};

const deleteCampaign = async (item: any) => {
  if (!db) return;
  if (confirm(`Удалить кампанию "${item.campaign_name}"?`)) {
    try {
      await db.query('DELETE FROM campaigns WHERE campaign_id = $1', [item.campaign_id]);
      await loadCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  }
};

onMounted(() => {
  loadCampaigns();
  loadClients();
});
</script>