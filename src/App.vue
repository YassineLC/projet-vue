<!-- filepath: c:\Code\projet-vue\project\src\App.vue -->
<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Loading screen pendant l'initialisation -->
    <div v-if="!isInitialized" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Chargement...</p>
      </div>
    </div>

    <!-- Navigation pour les utilisateurs connectés -->
    <nav v-else-if="isAuthenticated" class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="flex items-center space-x-2">
              <Mail class="h-8 w-8 text-blue-600" />
              <span class="text-xl font-bold text-gray-900">Gestionnaire d'E-mails</span>
            </router-link>
          </div>
          
          <div class="flex items-center space-x-4">
            <router-link 
              to="/" 
              class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              :class="{ 'text-blue-600 bg-blue-50': $route.name === 'Home' }"
            >
              Accueil
            </router-link>
            <router-link 
              to="/emails" 
              class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              :class="{ 'text-blue-600 bg-blue-50': $route.name === 'EmailList' }"
            >
              E-mails
            </router-link>
            <router-link 
              to="/profile" 
              class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              :class="{ 'text-blue-600 bg-blue-50': $route.name === 'Profile' }"
            >
              Profil
            </router-link>
            <!-- Bouton de déconnexion seulement si connecté -->
            <button
              v-if="isAuthenticated"
              @click="handleLogout"
              class="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
            >
              <LogOut class="h-4 w-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Contenu principal -->
    <main v-if="isInitialized && isAuthenticated" :class="{ 'max-w-7xl mx-auto py-6 sm:px-6 lg:px-8': isAuthenticated }">
      <router-view />
    </main>
    <main v-else-if="isInitialized">
      <router-view />
    </main>
    <div v-else class="min-h-screen flex items-center justify-center">
      <p class="text-red-600">Erreur lors de l'initialisation. Veuillez vérifier votre connexion ou recharger la page.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, LogOut } from 'lucide-vue-next'
import { useAuthStore } from './stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated.value)
const isInitialized = computed(() => authStore.isInitialized.value)

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

onMounted(() => {
  // L'initialisation se fait automatiquement dans le router guard
})
</script>