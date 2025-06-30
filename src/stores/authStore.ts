import { ref, computed } from 'vue'
import axios from 'axios'

export interface User {
  id: string
  email: string
  name: string
  photo?: string
}

const user = ref<User | null>(null)
const token = ref<string | null>(localStorage.getItem('token'))
const isLoading = ref(false)
const isInitialized = ref(false)

// Configuration axios par défaut
const updateAxiosAuth = (newToken: string | null) => {
  if (newToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
  } else {
    delete axios.defaults.headers.common['Authorization']
  }
}

// Initialiser avec le token existant
updateAxiosAuth(token.value)

export const useAuthStore = () => {
  const isAuthenticated = computed(() => !!user.value && !!token.value)

  const setAuth = (newToken: string, newUser: User) => {
    token.value = newToken
    user.value = newUser
    localStorage.setItem('token', newToken)
    updateAxiosAuth(newToken)
  }

  const clearAuth = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    updateAxiosAuth(null)
  }

  // Vérifier si l'utilisateur est connecté au démarrage
  const initializeAuth = async () => {
    if (isInitialized.value) return;

    isLoading.value = true;

    try {
      if (token.value) {
        const response = await axios.get('/api/auth/verify');
        if (response.data.valid) {
          const profileResponse = await axios.get('/api/auth/profile');
          user.value = profileResponse.data.user || null;
          if (!user.value) {
            console.error('Erreur: Les informations utilisateur sont manquantes.');
          }
        } else {
          clearAuth();
        }
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
      clearAuth();
    } finally {
      isLoading.value = false;
      isInitialized.value = true;
    }
  }

  // Initier la connexion OAuth Google
  const loginWithGoogle = () => {
    window.location.href = '/api/auth/google'; // Utilisez le proxy configuré
  }

  // Traiter le callback OAuth
  const handleOAuthCallback = async (authToken: string) => {
    try {
      // Le token est déjà généré par le serveur, on le stocke
      token.value = authToken
      localStorage.setItem('token', authToken)
      updateAxiosAuth(authToken)
      
      // Récupérer les informations de l'utilisateur
      const profileResponse = await axios.get('/api/auth/profile')
      user.value = profileResponse.data.user
      
      return { success: true }
    } catch (error: any) {
      clearAuth()
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erreur lors de la connexion' 
      }
    }
  }

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout')
    } catch (error) {
      console.log('Erreur lors de la déconnexion:', error)
    } finally {
      clearAuth()
    }
  }

  return {
    user: computed(() => user.value),
    token: computed(() => token.value),
    isAuthenticated,
    isLoading: computed(() => isLoading.value),
    isInitialized: computed(() => isInitialized.value),
    loginWithGoogle,
    handleOAuthCallback,
    logout,
    setAuth,
    clearAuth,
    initializeAuth
  }
}