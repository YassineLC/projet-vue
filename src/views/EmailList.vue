<template>
  <div>
    <!-- En-tête -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Mes E-mails</h1>
        <p class="text-gray-600">
          {{ filteredEmails.length }} e-mail{{ filteredEmails.length > 1 ? 's' : '' }} affichés
          <span v-if="isFiltering">(sur {{ receivedEmails.length }} au total)</span>
        </p>
      </div>
      <button @click="refreshEmails" :disabled="loading" class="btn-secondary mt-2 lg:mt-0">
        <span v-if="loading">Actualisation...</span>
        <span v-else>Actualiser</span>
      </button>
    </div>

    <!-- Formulaire de recherche simplifié -->
    <div class="card p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">Rechercher</h2>
        <button
          v-if="isFiltering"
          @click="clearFilters"
          class="text-sm text-primary-600 hover:text-primary-700"
        >
          Effacer les filtres
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Recherche par expéditeur -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Expéditeur</label>
          <input
            v-model="searchFilters.sender"
            type="text"
            class="input-field"
            placeholder="Nom ou email"
          />
        </div>

        <!-- Recherche par mot-clé dans objet/contenu -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Objet</label>
          <input
            v-model="searchFilters.keyword"
            type="text"
            class="input-field"
            placeholder="Recherche dans l'objet du mail"
          />
        </div>

        <!-- Date de réception unique -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Date de réception</label>
          <input
            v-model="searchFilters.date"
            type="date"
            class="input-field"
          />
        </div>
      </div>
    </div>

    <!-- Liste des e-mails filtrés -->
    <div class="card p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">E-mails reçus</h2>
      <div v-if="loading" class="text-center py-6">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">Chargement des e-mails...</p>
      </div>
      <div v-else-if="filteredEmails.length === 0" class="text-center py-6">
        <p class="text-gray-600">
          {{ isFiltering ? 'Aucun e-mail ne correspond à votre recherche.' : 'Aucun e-mail reçu pour le moment.' }}
        </p>
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="email in filteredEmails"
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
const searchFilters = ref({
  sender: '',
  keyword: '',
  date: ''
});
const isFiltering = computed(() => {
  return searchFilters.value.sender.trim() !== ''
    || searchFilters.value.keyword.trim() !== ''
    || searchFilters.value.date !== '';
});
const filteredEmails = computed(() => {
  let filtered = [...receivedEmails.value];

  // Filtre par expéditeur
  if (searchFilters.value.sender.trim()) {
    const senderQuery = searchFilters.value.sender.toLowerCase().trim();
    filtered = filtered.filter(email => {
      const senderName = (email.sender?.name || '').toLowerCase();
      const senderEmail = (email.sender?.email || '').toLowerCase();
      return senderName.includes(senderQuery) || senderEmail.includes(senderQuery);
    });
  }

  // Filtre par mot-clé (objet + contenu)
  if (searchFilters.value.keyword.trim()) {
    const keywordQuery = searchFilters.value.keyword.toLowerCase().trim();
    filtered = filtered.filter(email => {
      const subject = (email.subject || '').toLowerCase();
      const body = stripHtml(email.body || '').toLowerCase();
      return subject.includes(keywordQuery) || body.includes(keywordQuery);
    });
  }

  // Filtre par date
  if (searchFilters.value.date) {
    const filterDate = new Date(searchFilters.value.date);
    filterDate.setHours(0, 0, 0, 0); // Début de la journée

    const nextDay = new Date(filterDate);
    nextDay.setDate(nextDay.getDate() + 1); // Fin de la journée

    filtered = filtered.filter(email => {
      const emailDate = new Date(email.receivedDateTime);
      return emailDate >= filterDate && emailDate < nextDay;
    });
  }

  return filtered;
});

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

const clearFilters = () => {
  searchFilters.value = {
    sender: '',
    keyword: '',
    date: ''
  };
};

const stripHtml = (html) => {
  if (!html) return '';
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
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
