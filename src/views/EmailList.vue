<template>
  <div>
    <!-- En-tête -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Mes E-mails</h1>
        <p class="text-gray-600">
          {{ receivedEmails.length }} e-mail{{ receivedEmails.length > 1 ? 's' : '' }} reçus.
        </p>
      </div>
      <button @click="refreshEmails" :disabled="loading" class="btn-secondary">
        <span v-if="loading">Actualisation...</span>
        <span v-else>Actualiser</span>
      </button>
    </div>

    <!-- E-mails reçus -->
    <div class="card p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">E-mails reçus</h2>
      <div v-if="receivedEmails.length === 0" class="text-center py-6">
        <p class="text-gray-600">Aucun e-mail reçu pour le moment.</p>
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="email in receivedEmails"
          :key="email.id"
          class="card p-4 hover:shadow-lg transition-shadow cursor-pointer"
          :class="{'border-l-4 border-blue-500': !email.isRead}"
          @click="goToEmail(email.id)"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <!-- Titre en gras si non lu -->
              <h3 class="text-lg truncate" :class="{'font-bold': !email.isRead, 'font-medium': email.isRead}">
                {{ email.subject }}
                <span v-if="!email.isRead" class="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Non lu
                </span>
              </h3>
              <p class="text-sm text-gray-600">De: {{ email.sender.name }} <{{ email.sender.email }}></p>
              <p class="text-sm text-gray-500">Reçu le: {{ formatDate(email.receivedDateTime) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useEmailStore } from '@/stores/emailStore';

const router = useRouter();
const emailStore = useEmailStore();

const loading = computed(() => emailStore.loading.value);
const receivedEmails = computed(() => emailStore.receivedEmails.value);

const refreshEmails = async () => {
  await emailStore.fetchReceivedEmails();
};

const goToEmail = (id: string) => {
  router.push(`/email/${id}`);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

onMounted(async () => {
  await refreshEmails();
});
</script>

<style scoped>
.card {
  @apply bg-white shadow rounded-lg p-4;
}
</style>
