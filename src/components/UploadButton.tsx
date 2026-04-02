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

// Configuración de límites
const MAX_FILE_SIZE_MB = 100 // 100 MB máximo
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
const MAX_RETRIES = 3
const UPLOAD_TIMEOUT_MS = 300000 // 5 minutos para videos grandes

export default function UploadButton({ onUpload }: Props) {
  const [uploading, setUploading] = useState(false)
  const [filesWithDescriptions, setFilesWithDescriptions] = useState<FileWithDescription[]>([])
  const [showDescriptionModal, setShowDescriptionModal] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    setUploadError(null)
    const filesArray = Array.from(files)
    const newFiles: FileWithDescription[] = []

    // Validar tamaño de archivos
    for (const file of filesArray) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setUploadError(
          `El archivo "${file.name}" pesa ${(file.size / (1024 * 1024)).toFixed(1)} MB. ` +
          `Máximo permitido: ${MAX_FILE_SIZE_MB} MB (ideal para móvil: <50MB)`
        )
        continue
      }

      const preview = URL.createObjectURL(file)
      const media_type = isVideoFile(file) ? 'video' : 'photo'
      const sizeInMb = (file.size / (1024 * 1024)).toFixed(1)
      
      newFiles.push({
        file,
        description: '',
        preview,
        media_type
      })
    }

    if (newFiles.length === 0 && !uploadError) {
      setUploadError('Selecciona archivos válidos')
      return
    }

    setFilesWithDescriptions(newFiles)
    setShowDescriptionModal(true)
  }

  const handleDescriptionChange = (index: number, description: string) => {
    setFilesWithDescriptions((prev) =>
      prev.map((item, i) => (i === index ? { ...item, description } : item))
    )
  }

  const uploadFileWithRetry = async (item: FileWithDescription, retryCount = 0): Promise<boolean> => {
    try {
      const fileName = item.file.name.replace(/\s/g, '_')
      const filePath = `${crypto.randomUUID()}-${fileName}`
      
      // Crear un controlador de aborto con timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS)

      // Subir archivo al bucket
      const { error: uploadError } = await supabase.storage
        .from('galeria')
        .upload(filePath, item.file, { 
          cacheControl: '3600', 
          upsert: false,
          duplex: 'half'
        })

      clearTimeout(timeoutId)

      if (uploadError) {
        if (retryCount < MAX_RETRIES) {
          console.log(`Reintentando ${filePath}... (intento ${retryCount + 1}/${MAX_RETRIES})`)
          // Esperar antes de reintentar
          await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)))
          return uploadFileWithRetry(item, retryCount + 1)
        }
        throw new Error(`Error persistente: ${uploadError.message}`)
      }

      // Obtener URL pública
      const { data } = supabase.storage.from('galeria').getPublicUrl(filePath)
      const fileUrl = data.publicUrl

      // Insertar registro en tabla
      const insertPayload: any = { 
        url: fileUrl,
        media_type: item.media_type
      }
      if (item.description?.trim()) {
        insertPayload.description = item.description.trim()
      }

      const { data: insertedData, error: insertError } = await supabase
        .from('photos')
        .insert([insertPayload])
        .select()
        .single()

      if (insertError) {
        throw new Error(`Error al guardar en BD: ${insertError.message}`)
      }

      if (insertedData) onUpload?.(insertedData)
      return true
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido'
      console.error('Error en subida:', errorMsg)
      throw err
    }
  }

  const handleUploadAll = async () => {
    if (filesWithDescriptions.length === 0) return

    try {
      setUploading(true)
      setUploadError(null)
      const errors: string[] = []

      for (const item of filesWithDescriptions) {
        try {
          await uploadFileWithRetry(item)
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : 'Error desconocido'
          errors.push(`${item.file.name}: ${errorMsg}`)
        }
      }

      if (errors.length > 0) {
        setUploadError(
          `Errores al subir ${errors.length} archivo(s):\n${errors.join('\n')}\n\n` +
          `💡 Intenta:\n- Reconectar WiFi\n- Verificar conexión móvil\n- Dividir en archivos más pequeños`
        )
      } else {
        setFilesWithDescriptions([])
        setShowDescriptionModal(false)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    } catch (err) {
      console.error('Error general:', err)
      setUploadError('Error general en la carga. Intenta de nuevo.')
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
      {/* Mostrar error si existe */}
      {uploadError && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg whitespace-pre-wrap max-w-md shadow-lg">
          <div className="flex justify-between items-start">
            <span>{uploadError}</span>
            <button 
              onClick={() => setUploadError(null)}
              className="ml-2 text-red-700 hover:text-red-900"
            >
              ✕
            </button>
          </div>
        </div>
      )}

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
            
            {/* Aviso sobre tamaño para móviles */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-sm text-yellow-800">
              💡 Para móviles: Ideal mantener archivos &lt;50MB. Tienes {filesWithDescriptions.reduce((sum, item) => sum + item.file.size, 0) / (1024 * 1024) | 0}MB totales.
            </div>
            
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
                        <span className="text-xs text-gray-500 ml-2">
                          
                        </span>
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
