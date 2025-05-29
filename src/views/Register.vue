<script setup>
import { ref } from 'vue'
import { supabase } from '@/services/supabase'; // Asegúrate que este archivo existe

const email = ref('')
const password = ref('')
const errorMsg = ref('')

const registrar = async () => {
  errorMsg.value = ''

  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  }, {
    options: {
      emailRedirectTo: 'http://localhost:5173/confirmado'
    }
  })

  if (error) {
    console.error("Error al registrar:", error.message)
    errorMsg.value = 'Error al registrar: ' + error.message
  } else {
    console.log("Registro exitoso", data)
    window.location.href = '/login'
  }
}
</script>

<template>
  <div>
    <h2>Registrar nuevo usuario</h2>
    <input type="email" v-model="email" placeholder="Correo" />
    <input type="password" v-model="password" placeholder="Contraseña" />
    <button @click="registrar">Registrar</button>
    <p v-if="errorMsg">{{ errorMsg }}</p>
  </div>
</template>
