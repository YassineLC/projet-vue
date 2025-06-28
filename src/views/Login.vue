<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <Mail class="h-12 w-12 text-blue-600" />
      </div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Gestionnaire d'E-mails
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Connectez-vous avec votre compte Google
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Message d'erreur -->
        <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div class="flex">
            <AlertCircle class="h-5 w-5 text-red-400" />
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                Erreur de connexion
              </h3>
              <div class="mt-2 text-sm text-red-700">
                {{ error }}
              </div>
            </div>
          </div>
        </div>

        <!-- Bouton de connexion Google -->
        <div class="space-y-6">
          <button
            @click="handleGoogleLogin"
            :disabled="authLoading"
            class="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div v-if="authLoading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600 mr-3"></div>
            <svg v-else class="h-5 w-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {{ authLoading ? 'Connexion...' : 'Se connecter avec Google' }}
          </button>

          <div class="text-center">
            <p class="text-xs text-gray-500">
              En vous connectant, vous acceptez nos conditions d'utilisation
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Mail, AlertCircle } from 'lucide-vue-next'
import { useAuthStore } from '../stores/authStore'

const route = useRoute()
const authStore = useAuthStore()

const error = ref<string | null>(null)
const { loginWithGoogle, isLoading: authLoading } = authStore

const handleGoogleLogin = () => {
  error.value = null
  loginWithGoogle()
}

// Gérer les erreurs depuis les paramètres d'URL
onMounted(() => {
  const errorParam = route.query.error as string;
  if (errorParam) {
    switch (errorParam) {
      case 'no_code':
        error.value = 'Aucun code d\'autorisation reçu de Google';
        break;
      case 'token_exchange_failed':
        error.value = 'Échec de l\'échange du code contre un token';
        break;
      case 'auth_failed':
        error.value = 'Erreur lors de l\'authentification Google';
        break;
      default:
        error.value = 'Une erreur est survenue lors de la connexion';
    }
  } else {
    error.value = null; // Réinitialisation si aucun paramètre d'erreur
  }
})
</script>