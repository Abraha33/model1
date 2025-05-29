<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/services/supabase'

const email = ref('')
const password = ref('')
const mensaje = ref('')
const intentosFallidos = ref(0)
const router = useRouter()

const login = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  if (error) {
    intentosFallidos.value++
    if (error.message.includes('Invalid login credentials')) {
      mensaje.value = '❌ Credenciales incorrectas'
    } else {
      mensaje.value = '❌ ' + error.message
    }
  } else {
    mensaje.value = '✅ Sesión iniciada'
    router.push('/')
  }
}
</script>

<template>
  <div class="p-4">
    <h2>Iniciar sesión</h2>
    <input v-model="email" placeholder="Correo" />
    <input v-model="password" placeholder="Contraseña" type="password" />
    <button @click="login">Entrar</button>
    <p>{{ mensaje }}</p>

    <div v-if="intentosFallidos >= 2" class="mt-2 text-sm text-gray-500">
      ¿No tienes cuenta? <router-link to="/register" class="text-blue-600 underline">Regístrate aquí</router-link>
    </div>
  </div>
</template>
