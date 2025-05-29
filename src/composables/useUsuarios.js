import { supabase } from '@/services/supabase'

export async function obtenerSubordinados() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('supervisor_id', user.id)

  if (error) throw error
  return data
}

export async function actualizarRol(usuarioId, nuevoRol) {
  const { error } = await supabase
    .from('users')
    .update({ rol: nuevoRol })
    .eq('id', usuarioId)

  if (error) throw error
}

