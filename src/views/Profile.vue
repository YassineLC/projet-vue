<template>
  <div>
    <div class="max-w-2xl mx-auto">
      <!-- En-tête -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Mon Profil</h1>
        <p class="text-gray-600">Informations de votre compte Microsoft</p>
      </div>

      <!-- Informations utilisateur -->
      <div class="card p-6 mb-6">
        <div class="flex items-center space-x-6 mb-6">
          <div class="flex-shrink-0">
            <div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <img 
                v-if="authStore.user?.value?.photo" 
                :src="authStore.user.value.photo" 
                :alt="authStore.user.value.name"
                class="w-20 h-20 rounded-full object-cover"
              />
              <svg v-else class="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
          </div>
          
          <div class="flex-1">
            <h2 class="text-xl font-semibold text-gray-900 mb-1">
              {{ authStore.user?.value?.name || 'Utilisateur' }}
            </h2>
            <p class="text-gray-600 mb-2">{{ authStore.user?.value?.email }}</p>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Connecté via Microsoft
            </span>
          </div>
        </div>
        
        <div class="border-t border-gray-200 pt-6">
          <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt class="text-sm font-medium text-gray-500">ID Utilisateur</dt>
              <dd class="mt-1 text-sm text-gray-900 font-mono">
                {{ authStore.user?.value?.id || 'Non disponible' }}
              </dd>
            </div>
            
            <div>
              <dt class="text-sm font-medium text-gray-500">Statut</dt>
              <dd class="mt-1">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✓ Authentifié
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Statistiques des e-mails -->
      <div class="card p-6 mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Statistiques des E-mails</h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="text-center p-4 bg-blue-50 rounded-lg">
            <div class="text-2xl font-bold text-blue-600 mb-1">
              {{ emailStats.total }}
            </div>
            <div class="text-sm text-blue-600">Total</div>
          </div>
          
          <div class="text-center p-4 bg-green-50 rounded-lg">
            <div class="text-2xl font-bold text-green-600 mb-1">
              {{ emailStats.read }}
            </div>
            <div class="text-sm text-green-600">Lus</div>
          </div>
          
          <div class="text-center p-4 bg-orange-50 rounded-lg">
            <div class="text-2xl font-bold text-orange-600 mb-1">
              {{ emailStats.unread }}
            </div>
            <div class="text-sm text-orange-600">Non lus</div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
        
        <div class="space-y-3">
          <router-link to="/emails" class="block w-full btn-primary text-center">
            Voir mes e-mails
          </router-link>
          
          <button 
            @click="refreshProfile" 
            :disabled="refreshing"
            class="w-full btn-secondary"
          >
            <span v-if="refreshing">Actualisation...</span>
            <span v-else>Actualiser le profil</span>
          </button>
          
          <button 
            @click="handleLogout" 
            class="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Se déconnecter
          </button>
        </div>
      </div>

      <!-- Informations techniques -->
      <div class="card p-6 mt-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Informations Techniques</h3>
        
        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">Dernière connexion:</span>
            <span class="text-gray-900">{{ formatCurrentTime() }}</span>
          </div>
          
          <div class="flex justify-between">
            <span class="text-gray-600">Navigateur:</span>
            <span class="text-gray-900">{{ getBrowserInfo() }}</span>
          </div>
          
          <div class="flex justify-between">
            <span class="text-gray-600">Version de l'app:</span>
            <span class="text-gray-900">1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useEmailStore } from '@/stores/emailStore'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const router = useRouter()
const authStore = useAuthStore()
const emailStore = useEmailStore()

const refreshing = ref(false)

/**
 * Statistiques des e-mails
 */
const emailStats = ref({
  total: 0,
  read: 0,
  unread: 0
})

/**
 * Actualise les informations du profil
 */
const refreshProfile = async () => {
  refreshing.value = true
  
  try {
    // Actualise les statistiques des emails
    const stats = await emailStore.fetchEmailStats();
    if (stats) {
      emailStats.value = stats;
    }
    
    // Simule un délai pour l'UX
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (error) {
    console.error('Erreur lors de l\'actualisation:', error)
  } finally {
    refreshing.value = false
  }
}

/**
 * Gère la déconnexion
 */
const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

/**
 * Formate l'heure actuelle
 */
const formatCurrentTime = (): string => {
  return format(new Date(), 'dd/MM/yyyy à HH:mm', { locale: fr })
}

/**
 * Récupère les informations du navigateur
 */
const getBrowserInfo = (): string => {
  const userAgent = navigator.userAgent
  
  if (userAgent.includes('Chrome')) return 'Chrome'
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Safari')) return 'Safari'
  if (userAgent.includes('Edge')) return 'Edge'
  
  return 'Navigateur inconnu'
}

/**
 * Vérifie l'authentification au montage
 */
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/');
  } else {
    const stats = await emailStore.fetchEmailStats();
    if (stats) {
      emailStats.value = stats;
    }
  }
})
</script>