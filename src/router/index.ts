import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

// Import des vues
import Home from '../views/Home.vue'
import EmailList from '../views/EmailList.vue'
import EmailDetail from '../views/EmailDetail.vue'
import Profile from '../views/Profile.vue'
import Login from '../views/Login.vue'
import AuthCallback from '../views/AuthCallback.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/auth/callback',
    name: 'AuthCallback',
    component: AuthCallback,
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/emails',
    name: 'EmailList',
    component: EmailList,
    meta: { requiresAuth: true }
  },
  {
    path: '/emails/:id',
    name: 'EmailDetail',
    component: EmailDetail,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
  path: '/email/:id',
  name: 'EmailDetail',
  component: () => import('@/views/EmailDetail.vue'),
 }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de navigation
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Attendre l'initialisation de l'authentification
  if (!authStore.isInitialized.value) {
    await authStore.initializeAuth()
  }
  
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  const isAuthenticated = authStore.isAuthenticated.value

  if (requiresAuth && !isAuthenticated) {
    // Rediriger vers la page de connexion
    next('/login')
  } else if (requiresGuest && isAuthenticated) {
    // Rediriger vers l'accueil si déjà connecté
    next('/')
  } else {
    next()
  }
})

export default router
