<template>
  <div class="min-h-screen bg-gray-50">
    <!-- En-tête de la page d'accueil -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <h1 class="text-3xl font-bold text-gray-900">
              Gestionnaire d'Emails
            </h1>
          </div>
          <div class="flex items-center space-x-4">
            <router-link 
              to="/profile" 
              class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Profil
            </router-link>
            <router-link 
              to="/emails" 
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Voir les Emails
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <main class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h2 class="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Bienvenue dans votre gestionnaire d'emails
        </h2>
        <p class="mt-4 text-xl text-gray-600">
          Gérez tous vos emails de manière simple et efficace
        </p>
      </div>

      <!-- Statistiques rapides -->
      <div class="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Total des emails
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ emailStats.total }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Emails lus
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ emailStats.read }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Non lus
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ emailStats.unread }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions rapides -->
      <div class="mt-12">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Actions rapides</h3>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <router-link 
            to="/emails" 
            class="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:shadow-md transition-shadow duration-200 group"
          >
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                  Consulter tous les emails
                </p>
                <p class="text-sm text-gray-500">
                  Voir la liste complète de vos emails
                </p>
              </div>
            </div>
          </router-link>

          <router-link 
            to="/profile" 
            class="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:shadow-md transition-shadow duration-200 group"
          >
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 group-hover:text-green-600">
                  Gérer mon profil
                </p>
                <p class="text-sm text-gray-500">
                  Modifier vos informations personnelles
                </p>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useEmailStore } from '@/stores/emailStore'
import { useRoute } from 'vue-router'

const route = useRoute()
const emailStore = useEmailStore()
const emailStats = ref({
  total: 0,
  read: 0,
  unread: 0
})

// Charger les statistiques au montage du composant
onMounted(async () => {
  const stats = await emailStore.fetchEmailStats();
  if (stats) {
    emailStats.value = stats;
  }
})

watch(() => route.path, async (newPath, oldPath) => {
  if (newPath !== oldPath) {
    const stats = await emailStore.fetchEmailStats();
    if (stats) {
      emailStats.value = stats;
    }
  }
})
</script>