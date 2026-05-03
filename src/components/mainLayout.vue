<template>
  <v-layout class="rounded rounded-md border">
    <v-app-bar :elevation="1" rounded>
      <template #prepend>
        <v-app-bar-nav-icon @click="drawer = !drawer" />
      </template>

      <v-app-bar-title>admin panel</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer">
      <v-list active-color="primary" nav>
        <v-list-item link title="Menu" to="/" />
        <v-list-item link title="Client" to="/Client" />
        <v-list-item link title="Employee" to="/Employee" />
        <v-list-item link title="Campaign" to="/Campaign" />
        <v-list-item link title="Channel" to="/Channel" />
        <v-list-item link title="Ad_Material" to="/Ad_Material" />
        <v-list-item link title="Campaign_Stats" to="/Campaign_Stats" />
      </v-list>
    </v-navigation-drawer>

    <v-main class="d-flex align-center justify-center" height="100vh">
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-layout>
</template>
<script setup lang="ts">

import { ref } from "vue"
const drawer = ref(true)
</script>