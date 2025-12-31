import { useEffect, useState, useCallback } from 'react'

type Props = {
  url: string
  onClose: () => void
  currentIndex: number
  totalPhotos: number
  onNavigate: (direction: 'prev' | 'next') => void
  created_at?: string
}

export default function ImageModal({ 
  url, 
  onClose, 
  currentIndex,
  totalPhotos,
  onNavigate,
  created_at
}: Props) {
  const [scale, setScale] = useState(1)
  
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

  // Toggle zoom con doble clic
  const handleDoubleClick = useCallback(() => {
    setScale(s => s === 1 ? 1.5 : 1)
  }, [])

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

        {/* Contenedor de imagen */}
        <div className="relative w-full aspect-4/3 md:aspect-[25/8] bg-black/50 rounded-lg overflow-hidden">
          <img 
            src={url} 
            alt="Foto en tamaño completo" 
            className="w-full h-full object-contain transition-transform duration-200"
            style={{ transform: `scale(${scale})` }}
            onDoubleClick={handleDoubleClick}
          />
        </div>

        {/* Controles inferiores */}
        <div className="w-full flex items-center justify-between gap-4 px-4 text-white">
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
  )
}