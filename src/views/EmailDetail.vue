<template>
  <div>
    <!-- Navigation -->
    <div class="mb-6">
      <button @click="goBack" class="flex items-center text-primary-600 hover:text-primary-700 transition-colors">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        Retour à la liste
      </button>
    </div>

    <!-- Chargement -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <p class="mt-2 text-gray-600">Chargement de l'e-mail...</p>
    </div>

    <!-- Contenu de l'e-mail -->
    <div v-else-if="email" class="card">
      <!-- En-tête de l'e-mail -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <h1 class="text-2xl font-bold text-gray-900 mb-2">
              {{ email.subject }}
            </h1>
            
            <div class="space-y-2">
              <div class="flex items-center text-sm text-gray-600">
                <span class="font-medium mr-2">De:</span>
                <span>{{ email.sender.name }} &lt;{{ email.sender.email }}&gt;</span>
              </div>
              
              <div class="flex items-center text-sm text-gray-600">
                <span class="font-medium mr-2">Date:</span>
                <span>{{ emailStore.formatDate(email.receivedDateTime) }}</span>
              </div>
            </div>
          </div>
          
          <div class="flex items-center space-x-2 ml-4">
            <span v-if="!email.isRead" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              Non lu
            </span>
            
            <span v-if="email.hasAttachments" class="text-gray-400" title="Pièces jointes">
              📎
            </span>
            
            <button
              @click="handleDeleteEmail"
              class="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Supprimer cet e-mail"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Corps de l'e-mail -->
      <div class="p-6">
        <div 
          class="prose max-w-none"
          v-html="sanitizedBody"
        ></div>
        
        <!-- Message si le contenu est vide -->
        <div v-if="!email.body.trim()" class="text-center py-8 text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p>Cet e-mail ne contient pas de texte.</p>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="p-6 border-t border-gray-200 bg-gray-50">
        <div class="flex flex-col sm:flex-row gap-3">
          <!-- Plus de Répondre ni Transférer -->
          <button 
            @click="handleMarkAsRead"
            v-if="!email.isRead"
            class="btn-secondary"
          >
            Marquer comme lu
          </button>
          <button 
            @click="handleDeleteEmail"
            class="btn-secondary"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>

    <!-- E-mail non trouvé -->
    <div v-else class="card p-12 text-center">
      <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">E-mail non trouvé</h3>
      <p class="text-gray-600 mb-4">
        L'e-mail demandé n'existe pas ou a été supprimé.
      </p>
      <button @click="goBack" class="btn-primary">
        Retour à la liste
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useEmailStore, Email } from '@/stores/emailStore'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const emailStore = useEmailStore()

const id = route.params.id as string
const email = ref<Email | null>(null)
const loading = computed(() => emailStore.loading.value)

/**
 * Contenu HTML sécurisé de l'e-mail
 */
const sanitizedBody = computed(() => {
  if (!email.value?.body) return 'Aucun contenu disponible.'
  return email.value.body
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
})

const goBack = () => {
  router.push('/emails')
}

const handleMarkAsRead = async () => {
  if (email.value) {
    await emailStore.markAsRead(email.value.id)
    email.value.isRead = true
  }
}

const handleDeleteEmail = async () => {
  if (email.value) {
    const token = localStorage.getItem('token')
    await axios.patch(`/api/emails/${email.value.id}/hide`, null, {
      headers: { Authorization: `Bearer ${token}` },
    })
    goBack()
  }
}

onMounted(async () => {
  try {
    emailStore.loading.value = true
    const fetchedEmail = await emailStore.getEmailById(id)
    if (fetchedEmail && fetchedEmail.body?.trim()) {
      email.value = fetchedEmail
    } else {
      const token = localStorage.getItem('token')
      const res = await axios.get(`/api/emails/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      email.value = res.data.email
    }
  } catch (error) {
    console.error('Erreur lors du chargement de l\'e-mail:', error)
    email.value = null
  } finally {
    emailStore.loading.value = false
  }
})
</script>

<style scoped>
.prose {
  @apply text-gray-800 leading-relaxed;
}

.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
  @apply font-semibold text-gray-900 mt-6 mb-4;
}

.prose p {
  @apply mb-4;
}

.prose a {
  @apply text-primary-600 hover:text-primary-700 underline;
}

.prose ul, .prose ol {
  @apply mb-4 pl-6;
}

.prose li {
  @apply mb-1;
}

.prose blockquote {
  @apply border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4;
}

.prose code {
  @apply bg-gray-100 px-1 py-0.5 rounded text-sm font-mono;
}

.prose pre {
  @apply bg-gray-100 p-4 rounded overflow-x-auto my-4;
}
</style>
