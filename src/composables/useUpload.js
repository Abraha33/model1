import { supabase } from '@/services/supabase'

export async function subirFotoYGuardarBase(base64String, descripcion = '', grupo = '') {
  const nombreArchivo = `foto_${Date.now()}.jpg`

  // Convertir base64 a blob
  const blob = base64ToBlob(base64String)
  
  // Subir a storage
  const { data, error } = await supabase.storage
    .from('imagenes')
    .upload(nombreArchivo, blob, {
      contentType: 'image/jpeg',
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Error al subir imagen:', error)
    throw error
  }

  // Obtener URL pública
  const { data: { publicUrl } } = supabase.storage
    .from('imagenes')
    .getPublicUrl(nombreArchivo)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuario no autenticado')

  // Guardar en base de datos
  const { error: insertError } = await supabase.from('fotos').insert([{
    url: publicUrl,
    nombre: nombreArchivo,
    descripcion,
    grupo,
    user_id: user.id
  }])

  if (insertError) {
    console.error('Error al guardar en base de datos:', insertError)
    throw insertError
  }

  return { url: publicUrl, nombre: nombreArchivo }
}

function base64ToBlob(base64Data) {
  // Asegurarse de que el base64 no tenga el prefijo data:image/jpeg;base64,
  const base64Clean = base64Data.replace(/^data:image\/\w+;base64,/, '')
  
  const byteCharacters = atob(base64Clean)
  const byteArrays = []

  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays.push(byteCharacters.charCodeAt(i))
  }

  return new Blob([new Uint8Array(byteArrays)], { type: 'image/jpeg' })
}
