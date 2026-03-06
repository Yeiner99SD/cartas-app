import { useState, useRef } from 'react'
import { supabase } from '../lib/supabaseClient.ts'

type Props = {
  onUpload?: (photo: any) => void
}

type FileWithDescription = {
  file: File
  description: string
  preview: string
  media_type: 'photo' | 'video'
}

const isVideoFile = (file: File): boolean => {
  const videoMimes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
  const videoExtensions = ['.mp4', '.webm', '.ogv', '.mov', '.avi', '.mkv']
  
  return videoMimes.includes(file.type) || 
    videoExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
}

export default function UploadButton({ onUpload }: Props) {
  const [uploading, setUploading] = useState(false)
  const [filesWithDescriptions, setFilesWithDescriptions] = useState<FileWithDescription[]>([])
  const [showDescriptionModal, setShowDescriptionModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    const filesArray = Array.from(files)
    const newFiles: FileWithDescription[] = []

    for (const file of filesArray) {
      const preview = URL.createObjectURL(file)
      const media_type = isVideoFile(file) ? 'video' : 'photo'
      newFiles.push({
        file,
        description: '',
        preview,
        media_type
      })
    }

    setFilesWithDescriptions(newFiles)
    setShowDescriptionModal(true)
  }

  const handleDescriptionChange = (index: number, description: string) => {
    setFilesWithDescriptions((prev) =>
      prev.map((item, i) => (i === index ? { ...item, description } : item))
    )
  }

  const handleUploadAll = async () => {
    if (filesWithDescriptions.length === 0) return

    try {
      setUploading(true)

      for (const item of filesWithDescriptions) {
        const fileName = item.file.name.replace(/\s/g, '_')
        const filePath = `${crypto.randomUUID()}-${fileName}`

        // Subir archivo al bucket
        const { error: uploadError } = await supabase.storage
          .from('galeria')
          .upload(filePath, item.file, { cacheControl: '3600', upsert: false })

        if (uploadError) {
          console.error('Error al subir archivo:', uploadError.message)
          continue
        }

        // Obtener URL pública
        const { data } = supabase.storage.from('galeria').getPublicUrl(filePath)
        const fileUrl = data.publicUrl

        // Insertar registro en tabla con descripción y tipo de media
        const insertPayload: any = { 
          url: fileUrl,
          media_type: item.media_type
        }
        if (item.description.trim()) {
          insertPayload.description = item.description.trim()
        }

        const { data: insertedData, error: insertError } = await supabase
          .from('photos')
          .insert([insertPayload])
          .select()
          .single()

        if (insertError) {
          console.error('Error al insertar en tabla:', insertError.message)
          continue
        }

        // Notificar al padre (Gallery) para cada archivo subido
        if (insertedData) onUpload?.(insertedData)
      }

      // Limpiar estado
      setFilesWithDescriptions([])
      setShowDescriptionModal(false)
      // Resetear el input file
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      console.error('Error general:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleCancel = () => {
    // Limpiar URLs de preview
    filesWithDescriptions.forEach(item => URL.revokeObjectURL(item.preview))
    setFilesWithDescriptions([])
    setShowDescriptionModal(false)
    // Resetear el input file
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }


  return (
    <>
      <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl cursor-pointer shadow-md">
        {uploading ? 'Subiendo...' : 'Subir fotos o videos'}
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*,video/*" 
          className="hidden" 
          onChange={handleFileSelect}
          disabled={uploading || showDescriptionModal}
          multiple
        />
      </label>

      {/* Modal para agregar descripción a múltiples fotos */}
      {showDescriptionModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Agregar descripción a {filesWithDescriptions.length} archivo{filesWithDescriptions.length !== 1 ? 's' : ''} (opcional)
            </h2>
            
            <div className="space-y-4 mb-6">
              {filesWithDescriptions.map((item, index) => (
                <div key={index} className="border border-gray-300 rounded-lg p-4">
                  <div className="flex gap-4 items-start">
                    {/* Preview de imagen o video */}
                    <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                      {item.media_type === 'video' ? (
                        <video 
                          src={item.preview} 
                          className="w-24 h-24 object-cover rounded"
                        />
                      ) : (
                        <img 
                          src={item.preview} 
                          alt={`Preview ${index + 1}`}
                          className="w-24 h-24 object-cover rounded"
                        />
                      )}
                    </div>
                    
                    {/* Input de descripción */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {item.media_type === 'video' ? '🎥' : '📷'} {item.file.name}
                      </label>
                      <textarea
                        value={item.description}
                        onChange={(e) => handleDescriptionChange(index, e.target.value)}
                        placeholder="Descripción (opcional)..."
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                disabled={uploading}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleUploadAll}
                disabled={uploading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {uploading ? 'Subiendo...' : `Subir ${filesWithDescriptions.length} archivo${filesWithDescriptions.length !== 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
