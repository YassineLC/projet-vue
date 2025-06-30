<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div class="text-center">
          <div v-if="isProcessing">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Connexion en cours...</h3>
            <p class="text-sm text-gray-600">Veuillez patienter pendant que nous finalisons votre connexion.</p>
          </div>

          <div v-else-if="error" class="text-center">
            <AlertCircle class="h-8 w-8 text-red-500 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">Erreur de connexion</h3>
            <p class="text-sm text-gray-600 mb-4">{{ error }}</p>
            <router-link 
              to="/login" 
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Retour à la connexion
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AlertCircle } from 'lucide-vue-next'
import { useAuthStore } from '../stores/authStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isProcessing = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const token = route.query.token as string;
    if (!token) {
      throw new Error('Aucun token reçu');
    }

    const result = await authStore.handleOAuthCallback(token);
    if (result.success) {
      router.push('/');
    } else {
      error.value = result.error || 'Erreur lors de la connexion';
    }
  } catch (err: any) {
    error.value = err.message || 'Une erreur est survenue';
  } finally {
    isProcessing.value = false;
  }
})
</script>