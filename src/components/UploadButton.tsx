import { useState } from 'react'
import { supabase } from '../lib/supabaseClient.ts'

type Props = {
  onUpload?: (photo: any) => void
}

export default function UploadButton({ onUpload }: Props) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const fileName = file.name.replace(/\s/g, '_') // quitar espacios
      const filePath = `${crypto.randomUUID()}-${fileName}`

      // Subir imagen al bucket
      const { error: uploadError } = await supabase.storage
        .from('galeria')
        .upload(filePath, file, { cacheControl: '3600', upsert: false })

      if (uploadError) {
        console.error('Error al subir imagen:', uploadError.message)
        return
      }

      // Obtener URL pública
      const { data } = supabase.storage.from('galeria').getPublicUrl(filePath)
      const imageUrl = data.publicUrl

      // Insertar registro en tabla y obtener el registro insertado
      const { data: insertedData, error: insertError } = await supabase
        .from('photos')
        .insert([{ url: imageUrl }])
        .select()
        .single()

      if (insertError) {
        console.error('Error al insertar en tabla:', insertError.message)
        return
      }

      // Notificar al padre (Gallery) para que actualice la UI inmediatamente
      if (insertedData) onUpload?.(insertedData)

      // limpiar input para permitir subir el mismo archivo de nuevo si se desea
      ;(e.target as HTMLInputElement).value = ''
    } catch (err) {
      console.error('Error general:', err)
    } finally {
      setUploading(false)
    }
  }


  return (
    <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl cursor-pointer shadow-md">
      {uploading ? 'Subiendo...' : 'Subir foto'}
      <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
    </label>
  )
}
