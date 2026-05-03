<template>
  <v-card>
    <v-card-title>Сотрудники</v-card-title>
    <v-divider></v-divider>
    <v-table>
      <thead>
        <tr>
          <th>employee_id</th>
          <th>full_name</th>
          <th>position</th>
          <th>email</th>
          <th>department</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="employee in employees" :key="employee.employee_id">
          <td>{{ employee.employee_id }}</td>
          <td>{{ employee.full_name }}</td>
          <td>{{ employee.position }}</td>
          <td>{{ employee.email }}</td>
          <td>{{ employee.department }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const employees = ref([
  { employee_id: 301, full_name: 'Екатерина Смирнова', position: 'Старший менеджер', email: 'e.smirnova@adpro.ru', department: 'Отдел стратегии' },
  { employee_id: 302, full_name: 'Дмитрий Ковалёв', position: 'Digital-специалист', email: 'd.kovalev@adpro.ru', department: 'Трафик' },
  { employee_id: 303, full_name: 'Анна Лебедева', position: 'Креативный директор', email: 'a.lebed@adpro.ru', department: 'Креатив' },
  { employee_id: 304, full_name: 'Олег Васильев', position: 'Аналитик', email: 'o.vasiliev@adpro.ru', department: 'Аналитика' },
])
</script>