<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import useAuthStore from './stores/auth'

// Ensure the authentication state is always up-to-date
const authStore = useAuthStore()

// Use onMounted to ensure the store is fully initialized before checking auth
onMounted(() => {
  if (!authStore.token) {
    authStore.checkAuth()
  }
})
</script>
