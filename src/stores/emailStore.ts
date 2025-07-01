import { ref, computed } from 'vue'
import axios from 'axios'

export interface Email {
  id: string
  subject: string
  sender: {
    name: string
    email: string
  }
  body: string
  receivedDateTime: string
  isRead: boolean
  hasAttachments: boolean
  isVisible: boolean
}

const emails = ref<Email[]>([]) // Initialisation par défaut à une liste vide
const filteredEmails = ref<Email[]>([])
const filters = ref({
  sender: '',
  keyword: '',
  dateFrom: '',
  dateTo: '',
}) // Ajout de la propriété filters
const loading = ref(false) // Ajout de la propriété loading
const error = ref<string | null>(null)
const sentEmails = ref<Email[]>([]); // Ajout de la propriété sentEmails
const receivedEmails = ref<Email[]>([]); // Ajout de la propriété receivedEmails
const stats = ref({
  total: 0,
  read: 0,
  unread: 0
});

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const fetchSentEmails = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await axios.get('/api/emails/sent');
    sentEmails.value = response.data.emails || [];
  } catch (err: any) {
    console.error('Erreur lors du chargement des e-mails envoyés:', err);
    error.value = err.response?.data?.error || 'Erreur lors du chargement des e-mails envoyés';
  } finally {
    loading.value = false;
  }
};

const fetchReceivedEmails = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await axios.get('/api/emails/received');
    receivedEmails.value = response.data.emails || [];
  } catch (err: any) {
    console.error('Erreur lors du chargement des e-mails reçus:', err);
    error.value = err.response?.data?.error || 'Erreur lors du chargement des e-mails reçus';
  } finally {
    loading.value = false;
  }
};

export const useEmailStore = () => {
  const fetchEmails = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.get('/api/emails')
      emails.value = response.data.emails || []
      filteredEmails.value = emails.value // Par défaut, tous les e-mails sont visibles
    } catch (err: any) {
      console.error('Erreur lors du chargement des e-mails:', err)
      error.value = err.response?.data?.error || 'Erreur lors du chargement des e-mails'
    } finally {
      loading.value = false
    }
  }

  const getEmailById = async (id: string): Promise<Email | null> => {
    try {
      const response = await axios.get(`/api/emails/${id}`)
      return response.data.email || null
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'e-mail:', err)
      return null
    }
  }

  const addEmail = async (emailData: {
    subject: string
    senderName?: string
    senderEmail?: string
    body?: string
  }) => {
    try {
      const response = await axios.post('/api/emails', emailData)
      emails.value.unshift(response.data.email)
      filteredEmails.value = emails.value // Met à jour les e-mails filtrés
      return { success: true }
    } catch (err: any) {
      console.error('Erreur lors de l\'ajout de l\'e-mail:', err)
      return { 
        success: false, 
        error: err.response?.data?.error || 'Erreur lors de l\'ajout de l\'e-mail' 
      }
    }
  }

  const hideEmail = async (id: string) => {
    try {
      await axios.delete(`/api/emails/${id}`)
      emails.value = emails.value.filter(email => email.id !== id)
      filteredEmails.value = emails.value // Met à jour les e-mails filtrés
      return { success: true }
    } catch (err: any) {
      console.error('Erreur lors du masquage de l\'e-mail:', err)
      return { 
        success: false, 
        error: err.response?.data?.error || 'Erreur lors du masquage de l\'e-mail' 
      }
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await axios.patch(`/api/emails/${id}/read`)
      
      // Mise à jour de l'email dans le store
      const email = emails.value.find(e => e.id === id)
      if (email && !email.isRead) {
        email.isRead = true
        
        // Mise à jour des emails reçus
        const receivedEmail = receivedEmails.value.find(e => e.id === id)
        if (receivedEmail) {
          receivedEmail.isRead = true
        }
        
        // Mise à jour des statistiques
        if (stats.value) {
          stats.value.read++;
          stats.value.unread--;
        } else {
          // Si les statistiques n'ont pas été chargées, on les charge
          await fetchEmailStats();
        }
      }
      
      return { success: true }
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour de l\'e-mail:', err)
      return { 
        success: false, 
        error: err.response?.data?.error || 'Erreur lors de la mise à jour de l\'e-mail' 
      }
    }
  }

  const updateFilters = (newFilters: typeof filters.value) => {
    filters.value = newFilters
    filteredEmails.value = emails.value.filter(email => {
      const matchesSender = !filters.value.sender || email.sender.name.includes(filters.value.sender) || email.sender.email.includes(filters.value.sender)
      const matchesKeyword = !filters.value.keyword || email.subject.includes(filters.value.keyword) || email.body.includes(filters.value.keyword)
      const matchesDateFrom = !filters.value.dateFrom || new Date(email.receivedDateTime) >= new Date(filters.value.dateFrom)
      const matchesDateTo = !filters.value.dateTo || new Date(email.receivedDateTime) <= new Date(filters.value.dateTo)
      return matchesSender && matchesKeyword && matchesDateFrom && matchesDateTo
    })
  }

  const clearFilters = () => {
    filters.value = {
      sender: '',
      keyword: '',
      dateFrom: '',
      dateTo: '',
    }
    filteredEmails.value = emails.value // Réinitialise les e-mails filtrés
  }

  const fetchEmailStats = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get('/api/emails/stats');
      stats.value = response.data.stats;
      return stats.value;
    } catch (err: any) {
      console.error('Erreur lors du chargement des statistiques:', err);
      error.value = err.response?.data?.error || 'Erreur lors du chargement des statistiques';
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    emails: computed(() => emails.value),
    sentEmails: computed(() => sentEmails.value),
    receivedEmails: computed(() => receivedEmails.value), // Expose receivedEmails ici
    filteredEmails: computed(() => filteredEmails.value),
    filters: computed(() => filters.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    stats: computed(() => stats.value),
    fetchEmails,
    fetchSentEmails,
    fetchReceivedEmails, // Expose fetchReceivedEmails ici
    fetchEmailStats,
    getEmailById,
    addEmail,
    hideEmail,
    markAsRead,
    updateFilters,
    clearFilters,
    formatDate,
  }
}