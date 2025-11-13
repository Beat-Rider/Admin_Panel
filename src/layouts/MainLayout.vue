<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>{{ currentTitle }}</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Меню Адміна </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Додавання',
    caption: 'Додати Полеглого Воїна',
    icon: 'person_add',
    link: '/add',
  },
  {
    title: 'Редагування',
    caption: 'Внести Зміни У Базі',
    icon: 'edit_square',
    link: '/edit',
  },
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const route = useRoute()

// Реактивний заголовок
const currentTitle = computed(() => route.meta.title || 'Адмін Панель')

// Примусове оновлення заголовка при переходах
watch(
  () => route.fullPath,
  () => {
    // Викличе перерахунок computed
  },
)
</script>
