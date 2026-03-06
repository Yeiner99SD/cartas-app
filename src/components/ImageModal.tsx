import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

type Props = {
  url: string
  onClose: () => void
  currentIndex: number
  totalPhotos: number
  onNavigate: (direction: 'prev' | 'next') => void
  created_at?: string
  photoId?: number
  description?: string | null
  onDescriptionUpdate?: (newDescription: string | null) => void
  media_type?: 'photo' | 'video'
}

export default function ImageModal({ 
  url, 
  onClose, 
  currentIndex,
  totalPhotos,
  onNavigate,
  created_at,
  photoId,
  description,
  onDescriptionUpdate,
  media_type = 'photo'
}: Props) {
  const [scale, setScale] = useState(1)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [editedDescription, setEditedDescription] = useState(description || '')
  const [isSavingDescription, setIsSavingDescription] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  
  // Cerrar con la tecla Escape y navegación con flechas
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') onNavigate('prev')
      else if (e.key === 'ArrowRight') onNavigate('next')
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onNavigate])

  const handleSaveDescription = async () => {
    if (!photoId) {
      setErrorMessage('Error: No se pudo identificar la foto')
      return
    }

    try {
      setIsSavingDescription(true)
      setErrorMessage(null)

      const descriptionValue = editedDescription.trim() || null

      const { data, error } = await supabase
        .from('photos')
        .update({ description: descriptionValue })
        .eq('id', photoId)
        .select()

      if (error) {
        setErrorMessage(`Error al guardar: ${error.message}`)
        return
      }

      onDescriptionUpdate?.(descriptionValue)
      setIsEditingDescription(false)
    } catch (err) {
      setErrorMessage('Error al guardar la descripción')
    } finally {
      setIsSavingDescription(false)
    }
  }

  const handleCancelEdit = () => {
    setEditedDescription(description || '')
    setIsEditingDescription(false)
    setErrorMessage(null)
  }

  // Toggle zoom con doble clic (solo para fotos)
  const handleDoubleClick = useCallback(() => {
    if (media_type === 'photo') {
      setScale(s => s === 1 ? 1.5 : 1)
    }
  }, [media_type])

  function parseAsUTC(s?: string) {
    if (!s) return null
    let t = s.trim()
    if (!t.includes('T') && t.includes(' ')) t = t.replace(' ', 'T')
    // If string already contains timezone info (Z or ±HH:MM), leave it.
    if (!(/[Zz]|[+-]\d{2}:?\d{2}$/.test(t))) t = t + 'Z'
    const d = new Date(t)
    return isNaN(d.getTime()) ? null : d
  }

  const parsed = parseAsUTC(created_at)

  const bogotaDate = parsed
    ? parsed.toLocaleString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/Bogota'
      }).replace(/,/, ' -')
    : null

  const madridDate = parsed
    ? parsed.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Europe/Madrid'
      }).replace(/,/, ' -')
    : null
    
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    onNavigate('prev')
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    onNavigate('next')
  }

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-6xl flex flex-col items-center gap-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Controles superiores */}
        <div className="w-full flex justify-between items-center text-white px-4">
          <div className="text-sm md:text-base flex flex-col items-start">
            <span>Bogotá: {bogotaDate}</span>
            <span>Madrid: {madridDate}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-2xl hover:text-gray-300 transition-colors"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        {/* Contenedor de imagen o video */}
        <div className="relative w-full aspect-4/3 md:aspect-[25/8] bg-black/50 rounded-lg overflow-hidden">
          {media_type === 'video' ? (
            <video 
              src={url} 
              controls
              className="w-full h-full object-contain"
              autoPlay
            />
          ) : (
            <img 
              src={url} 
              alt="Foto en tamaño completo" 
              className="w-full h-full object-contain transition-transform duration-200"
              style={{ transform: `scale(${scale})` }}
              onDoubleClick={handleDoubleClick}
            />
          )}
        </div>

        {/* Controles inferiores */}
        <div className="w-full flex flex-col gap-4 px-4 text-white">
          {/* Sección de descripción */}
          <div className="bg-black/30 rounded-lg p-4">
            {!isEditingDescription ? (
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  {description ? (
                    <div>
                      <p className="text-sm text-gray-300 mb-2">Descripción:</p>
                      <p className="text-base">{description}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">Sin descripción</p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setIsEditingDescription(true)
                    setEditedDescription(description || '')
                  }}
                  className="whitespace-nowrap px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors"
                >
                  {description ? 'Editar' : 'Agregar descripción'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  placeholder="Escribe una descripción para esta foto..."
                  className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                {errorMessage && (
                  <div className="p-2 bg-red-600/30 border border-red-500 rounded text-red-200 text-sm">
                    {errorMessage}
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={handleCancelEdit}
                    disabled={isSavingDescription}
                    className="flex-1 px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveDescription}
                    disabled={isSavingDescription}
                    className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors disabled:opacity-50"
                  >
                    {isSavingDescription ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Navegación */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={currentIndex === 0}
            >
              <span className="text-2xl">←</span>
              <span className="hidden md:inline">Anterior</span>
            </button>

            <div className="flex items-center gap-4">
              <span className="text-sm md:text-base">
                {currentIndex + 1} / {totalPhotos}
              </span>
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={currentIndex === totalPhotos - 1}
            >
              <span className="hidden md:inline">Siguiente</span>
              <span className="text-2xl">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}