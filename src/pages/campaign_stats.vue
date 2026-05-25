<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Детальная статистика кампаний</span>
            <v-btn color="primary" @click="refresh">
              <v-icon left>mdi-refresh</v-icon>
              Обновить
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <v-select
                  v-model="selectedCampaign"
                  label="Выберите кампанию"
                  :items="campaigns"
                  item-title="campaign_name"
                  item-value="campaign_id"
                  return-object
                  clearable
                />
              </v-col>
            </v-row>

            <v-row v-if="selectedCampaign">
              <!-- Основные KPI -->
              <v-col cols="12" md="3">
                <v-card color="primary" variant="tonal">
                  <v-card-text class="text-center">
                    <div class="text-h4">{{ selectedCampaign.views?.toLocaleString() || 0 }}</div>
                    <div class="text-subtitle-1">Просмотры</div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="3">
                <v-card color="info" variant="tonal">
                  <v-card-text class="text-center">
                    <div class="text-h4">{{ selectedCampaign.clicks?.toLocaleString() || 0 }}</div>
                    <div class="text-subtitle-1">Клики</div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="3">
                <v-card color="success" variant="tonal">
                  <v-card-text class="text-center">
                    <div class="text-h4">{{ selectedCampaign.sales?.toLocaleString() || 0 }}</div>
                    <div class="text-subtitle-1">Продажи</div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="3">
                <v-card :color="ctrColor" variant="tonal">
                  <v-card-text class="text-center">
                    <div class="text-h4">{{ ctr }}%</div>
                    <div class="text-subtitle-1">CTR</div>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Каналы продвижения -->
              <v-col cols="12" md="6">
                <v-card>
                  <v-card-title>
                    <v-icon left>mdi-channels</v-icon>
                    Каналы продвижения
                  </v-card-title>
                  <v-card-text>
                    <v-list>
                      <v-list-item v-for="channel in campaignChannels" :key="channel.channel_id">
                        <template #prepend>
                          <v-avatar color="primary" size="40">
                            <v-icon>mdi-{{ getChannelIcon(channel.channel_type) }}</v-icon>
                          </v-avatar>
                        </template>
                        <v-list-item-title>{{ channel.channel_name }}</v-list-item-title>
                        <v-list-item-subtitle>
                          Тип: {{ channel.channel_type }} | 
                          Стоимость: {{ formatMoney(channel.placement_cost) }} | 
                          Охват: {{ formatNumber(channel.audience_reach) }}
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Ответственные сотрудники -->
              <v-col cols="12" md="6">
                <v-card>
                  <v-card-title>
                    <v-icon left>mdi-account-group</v-icon>
                    Ответственные сотрудники
                  </v-card-title>
                  <v-card-text>
                    <v-list>
                      <v-list-item v-for="employee in campaignEmployees" :key="employee.employee_id">
                        <template #prepend>
                          <v-avatar color="success" size="40">
                            <v-icon>mdi-account</v-icon>
                          </v-avatar>
                        </template>
                        <v-list-item-title>
                          {{ employee.last_name }} {{ employee.first_name }} {{ employee.middle_name }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          Должность: {{ employee.position }} | Уровень доступа: {{ employee.access_level }}
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Целевая аудитория -->
              <v-col cols="12">
                <v-card>
                  <v-card-title>
                    <v-icon left>mdi-account-search</v-icon>
                    Целевая аудитория
                  </v-card-title>
                  <v-card-text>
                    <v-chip-group>
                      <v-chip v-for="audience in campaignAudiences" :key="audience.audience_id" color="info" variant="tonal">
                        {{ audience.age_category }}, {{ audience.gender }}, {{ audience.region }}
                        <v-tooltip activator="parent" location="top">
                          Интересы: {{ audience.interests }} | Доход: {{ audience.income_level }}
                        </v-tooltip>
                      </v-chip>
                    </v-chip-group>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { inject, ref, onMounted, computed, watch } from 'vue';
import { PGLiteKey } from '@/plugins/database';

const db = inject(PGLiteKey);
const campaigns = ref([]);
const selectedCampaign = ref(null);
const campaignChannels = ref([]);
const campaignEmployees = ref([]);
const campaignAudiences = ref([]);

const ctr = computed(() => {
  if (!selectedCampaign.value || selectedCampaign.value.views === 0) return 0;
  return ((selectedCampaign.value.clicks / selectedCampaign.value.views) * 100).toFixed(2);
});

const ctrColor = computed(() => {
  const rate = parseFloat(ctr.value);
  if (rate >= 5) return 'success';
  if (rate >= 2) return 'warning';
  return 'error';
});

const formatMoney = (value: number) => {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(value);
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('ru-RU').format(value);
};

const getChannelIcon = (type: string) => {
  const icons: Record<string, string> = {
    'Social': 'facebook',
    'Search': 'google',
    'Video': 'youtube',
    'Display': 'television',
    'Offline': 'television-classic',
    'Direct': 'email',
    'Organic': 'web',
    'Mobile': 'cellphone',
    'Content': 'newspaper',
    'Ecom': 'shopping',
    'Partner': 'handshake',
    'Audio': 'podcast',
    'Media': 'newspaper-variant'
  };
  return icons[type] || 'dots-grid';
};

const loadCampaigns = async () => {
  if (!db) return;
  const result = await db.query(`
    SELECT c.*, cl.client_name 
    FROM campaigns c
    JOIN clients cl ON c.client_id = cl.client_id
    ORDER BY c.campaign_id
  `);
  campaigns.value = result.rows;
};

const loadCampaignChannels = async () => {
  if (!db || !selectedCampaign.value) return;
  const result = await db.query(`
    SELECT ch.* 
    FROM channels ch
    JOIN campaigns_channels cc ON ch.channel_id = cc.channel_id
    WHERE cc.campaign_id = $1
  `, [selectedCampaign.value.campaign_id]);
  campaignChannels.value = result.rows;
};

const loadCampaignEmployees = async () => {
  if (!db || !selectedCampaign.value) return;
  const result = await db.query(`
    SELECT e.* 
    FROM employees e
    JOIN campaigns_employees ce ON e.employee_id = ce.employee_id
    WHERE ce.campaign_id = $1
  `, [selectedCampaign.value.campaign_id]);
  campaignEmployees.value = result.rows;
};

const loadCampaignAudiences = async () => {
  if (!db || !selectedCampaign.value) return;
  const result = await db.query(`
    SELECT ta.* 
    FROM target_audiences ta
    JOIN campaigns_audiences ca ON ta.audience_id = ca.audience_id
    WHERE ca.campaign_id = $1
  `, [selectedCampaign.value.campaign_id]);
  campaignAudiences.value = result.rows;
};

const loadAllDetails = async () => {
  await Promise.all([
    loadCampaignChannels(),
    loadCampaignEmployees(),
    loadCampaignAudiences()
  ]);
};

const refresh = () => {
  loadCampaigns();
  if (selectedCampaign.value) {
    loadAllDetails();
  }
};

watch(selectedCampaign, () => {
  if (selectedCampaign.value) {
    loadAllDetails();
  }
});

onMounted(() => {
  loadCampaigns();
});
</script>