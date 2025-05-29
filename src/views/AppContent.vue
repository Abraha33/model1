<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/services/supabase'
import { tomarFoto } from '@/composables/useCamera'
import { obtenerMisFotos } from '@/composables/useFotos'
import { subirFotoYGuardarBase } from '@/composables/useUpload'
import AdminPanel from '@/views/AdminPanel.vue'

const foto = ref(null)              // Preview base64
const mensaje = ref('')
const titulo = ref('')              // Para tareas
const tareas = ref([])
const fotos = ref([])               // Galería del usuario
const cargando = ref(true)
const error = ref('')
const grupo = 'grupo1'
const descripcion = ref('')

const rol = ref('')
const user = ref(null)              // Usuario actual

// Cargar tareas
const cargarTareas = async () => {
  const { data } = await supabase
    .from('tareas')
    .select('*')
    .order('creada_en', { ascending: false })
  tareas.value = data
}

// Guardar nueva tarea
const guardarTarea = async () => {
  const { error } = await supabase.from('tareas').insert({ titulo: titulo.value })
  if (!error) {
    titulo.value = ''
    cargarTareas()
  }
}

// Tomar foto, subir y guardar en base
const tomarYGuardar = async () => {
  try {
    const base64 = await tomarFoto()
    foto.value = base64

    const resultado = await subirFotoYGuardarBase(base64, descripcion.value, grupo)
    mensaje.value = '✅ Foto subida y guardada'
    console.log('📥 Foto:', resultado)

    fotos.value = await obtenerMisFotos()
  } catch (err) {
    mensaje.value = '❌ Error al guardar'
    console.error('Error al guardar en base de datos:', err)
  }
}

// Al iniciar
onMounted(async () => {
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  if (!currentUser) return

  user.value = currentUser

  const { data } = await supabase
    .from('users')
    .select('rol')
    .eq('id', currentUser.id)
    .single()
  rol.value = data?.rol || ''

  fotos.value = await obtenerMisFotos()
  await cargarTareas()
  cargando.value = false
})
</script>

<template>
  <div class="p-4">
    <!-- Info del usuario -->
    <p v-if="user" class="text-xs text-gray-500">👤 Usuario ID: {{ user.id }}</p>
    <p v-if="rol && rol !== 'admin'" class="text-xs text-blue-500">📎 Usuario subordinado</p>

    <!-- Panel solo para administrador -->
    <AdminPanel v-if="rol === 'admin'" />

    <!-- Sección de tareas -->
    <h1 class="text-xl font-bold mt-6">📝 Tareas</h1>
    <input v-model="titulo" placeholder="Título de tarea" class="border p-1 mb-2 w-full" />
    <button @click="guardarTarea" class="mb-4 bg-blue-500 text-white px-3 py-1 rounded">Guardar</button>

    <ul class="mb-4">
      <li v-for="tarea in tareas" :key="tarea.id">{{ tarea.titulo }}</li>
    </ul>

    <hr class="my-6" />

    <!-- Subir nueva foto -->
    <h2 class="text-xl font-bold">📸 Nueva Foto</h2>
    <input v-model="descripcion" placeholder="Descripción" class="border p-1 mb-2 w-full" />
    <button @click="tomarYGuardar" class="mb-2 bg-green-500 text-white px-3 py-1 rounded">📷 Tomar y Subir Foto</button>
    <p>{{ mensaje }}</p>

    <!-- Preview base64 -->
    <img
      v-if="foto"
      :src="`data:image/jpeg;base64,${foto}`"
      class="w-32 aspect-square object-cover rounded-full border mb-4"
    />

    <hr class="my-6" />

    <!-- Galería de usuario -->
    <h2 class="text-xl font-bold mb-4">🖼️ Mis Fotos</h2>

    <div v-if="cargando">Cargando fotos...</div>
    <div v-else-if="error">❌ {{ error }}</div>
    <div v-else-if="fotos.length === 0">No tienes fotos aún</div>

    <ul v-else class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <li v-for="foto in fotos" :key="foto.id" class="flex flex-col items-center text-center">
        <img :src="foto.url" alt="Imagen" class="w-24 h-24 object-cover rounded-md border mb-2" />
        <p class="text-sm font-semibold">{{ foto.descripcion }}</p>
        <p class="text-xs text-gray-500">📁 {{ foto.nombre }}</p>
        <p class="text-xs text-gray-500">🏷️ {{ foto.grupo }}</p>
        <p class="text-xs text-gray-500">📅 {{ new Date(foto.created_at).toLocaleString() }}</p>
      </li>
    </ul>
  </div>
</template>
