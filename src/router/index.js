import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import AppContent from '@/views/AppContent.vue'
import { supabase } from '@/services/supabase'

const routes = [
  { path: '/', name: 'Home', component: AppContent },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ✅ Middleware para proteger rutas
router.beforeEach(async (to, from, next) => {
  const publicPages = ['/login', '/register']
  const requiresAuth = !publicPages.includes(to.path)

  const { data } = await supabase.auth.getSession()
  const user = data.session?.user

  if (requiresAuth && !user) {
    return next('/login')
  }

  next()
})

export default router
