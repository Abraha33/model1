import { supabase } from '@/services/supabase'


export async function obtenerFotosPorGrupo(grupo) {
  const { data, error } = await supabase
    .from('fotos')
    .select('*')
    .eq('grupo', grupo)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function obtenerMisFotos() {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('No autenticado')

  const { data, error } = await supabase
    .from('fotos')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
export async function obtenerFotosVisibles() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')

  // La RLS ya limita lo que el usuario puede ver
  const { data, error } = await supabase
    .from('fotos')
    .select(`
      id,
      url,
      nombre,
      descripcion,
      grupo,
      creada_en,
      user_id,
      usuarios: user_id (rol, supervisor_id)
    `)
    .order('creada_en', { ascending: false })

  if (error) throw error
  return data
}
export async function eliminarFoto(id) {
  const { error } = await supabase
    .from('fotos')
    .delete()
    .eq('id', id)

  if (error) throw error
}