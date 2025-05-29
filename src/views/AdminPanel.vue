<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/services/supabase'

const fotosSubordinados = ref([])
const cargando = ref(true)
const error = ref('')

// Cargar fotos de todos los usuarios (excepto del admin)
const cargarFotosSubordinados = async () => {
  cargando.value = true
  try {
    const { data, error: err } = await supabase
      .from('fotos')
      .select(`
        id, 
        url, 
        descripcion, 
        nombre, 
        grupo, 
        created_at, 
        user_id,
        users (
          id,
          nombre,
          rol
        )
      `)
      .neq('user_id', (await supabase.auth.getUser()).data.user.id)
      .order('created_at', { ascending: false })

    if (err) {
      error.value = '❌ Error al cargar fotos'
      console.error('Error al cargar fotos:', err)
      return
    }

    console.log('Fotos cargadas:', data) // Debug info

    // Group photos by user
    const fotosPorUsuario = data.reduce((acc, foto) => {
      const userId = foto.user_id
      if (!acc[userId]) {
        acc[userId] = {
          id: userId,
          nombre: foto.users?.nombre || 'Usuario sin nombre',
          fotos: []
        }
      }
      acc[userId].fotos.push(foto)
      return acc
    }, {})
    
    fotosSubordinados.value = Object.values(fotosPorUsuario)
  } catch (err) {
    error.value = '❌ Error inesperado al cargar fotos'
    console.error('Error inesperado:', err)
  } finally {
    cargando.value = false
  }
}

onMounted(cargarFotosSubordinados)
</script>

<template>
  <div class="bg-white border p-4 rounded-md mt-6 shadow">
    <h2 class="text-xl font-bold text-red-600 mb-4">🔒 Panel de Administrador</h2>

    <div v-if="cargando">Cargando fotos de subordinados...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="fotosSubordinados.length === 0">No hay fotos de subordinados.</div>

    <div v-else class="space-y-6">
      <div v-for="usuario in fotosSubordinados" :key="usuario.id" class="border rounded-lg p-4">
        <h3 class="text-lg font-semibold mb-3">
          👤 Usuario ID: {{ usuario.id }}
          <span class="text-sm text-gray-600">({{ usuario.nombre }})</span>
        </h3>
        
        <div v-if="usuario.fotos.length === 0" class="text-gray-500">
          Este usuario no tiene fotos
        </div>
        
        <ul v-else class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <li
            v-for="foto in usuario.fotos"
            :key="foto.id"
            class="flex flex-col items-center text-center border p-2 rounded shadow-sm"
          >
            <div class="relative w-24 h-24 mb-2">
              <img 
                :src="foto.url" 
                class="w-full h-full object-cover rounded-md"
                @error="(e) => { e.target.src = 'https://via.placeholder.com/150?text=Error'; console.error('Error cargando imagen:', foto.url) }"
                :alt="foto.descripcion || 'Imagen'"
              />
            </div>
            <p class="text-sm font-semibold">{{ foto.descripcion }}</p>
            <p class="text-xs text-gray-500">📁 {{ foto.nombre }}</p>
            <p class="text-xs text-gray-500">🏷️ {{ foto.grupo }}</p>
            <p class="text-xs text-gray-500">📅 {{ new Date(foto.created_at).toLocaleString() }}</p>
            <p class="text-xs text-gray-400 break-all">{{ foto.url }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
