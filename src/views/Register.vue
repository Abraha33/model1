<script setup>
import { supabase } from '@/services/supabase'; // Asegúrate que este archivo existe
import { ref } from 'vue';

let email = ref('');  // Correo del usuario 
let password = ref(''); // Contraseña del usuario        
let errorMsg = ref(''); // Mensaje de error al Registrar

async function registrar() {
  errorMsg.value = '' // Reiniciar mensaje de error

  // Validar campos
  if (!email.value || !password.value) {
    errorMsg.value = 'Por favor completa todos los campos.'
    return
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value
    })

    if (error) {
      errorMsg.value = 'Error al registrar: ' + error.message
    } 
    else {
      console.log('Usuario registrado:', data)
      errorMsg.value = 'Usuario registrado exitosamente. Por favor verifica tu correo para activar la cuenta.'
      // Aquí podrías redirigir al usuario a otra página o limpiar los campos
      email.value = ''
      password.value = '' 
      // Redirigir a la página de inicio o login
      // O podrías mostrar un mensaje de éxito
      alert('Usuario registrado exitosamente. Por favor verifica tu correo para activar la cuenta.')         
    }
  } catch (err) {
    errorMsg.value = 'Error inesperado: ' + err.message
  }
}           

</script>
<template>
  <div>
    <h2>Registrar nuevo usuario</h2>
      <input type="email" v-model="email" placeholder="Correo" required />
      <input type="password" v-model="password" placeholder="Contraseña" required />
      <button @click="registrar">Registrar</button>
    <p v-if="errorMsg">{{ errorMsg }}</p>
  </div>
</template>
