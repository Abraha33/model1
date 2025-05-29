import { Camera, CameraResultType } from '@capacitor/camera'

export async function tomarFoto() {
  const foto = await Camera.getPhoto({
    quality: 80,
    resultType: CameraResultType.Base64
  })

  return foto.base64String
}
