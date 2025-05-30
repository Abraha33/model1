<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
</script>

<template>
  <div class="p-4">
    <h1>Tareas</h1>
    <input v-model="titulo" placeholder="Título" />
    <button @click="guardarTarea">Guardar</button>

    <ul>
      <li v-for="tarea in tareas" :key="tarea.id">{{ tarea.titulo }}</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/services/supabase'

const titulo = ref('')
const tareas = ref([])

const guardarTarea = async () => {
  const { error } = await supabase.from('tareas').insert({ titulo: titulo.value })
  if (!error) {
    titulo.value = ''
    cargarTareas()
  }
}

const cargarTareas = async () => {
  const { data } = await supabase.from('tareas').select('*').order('creada_en', { ascending: false })
  tareas.value = data
}

onMounted(() => {
  cargarTareas()
})
</script>


<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
