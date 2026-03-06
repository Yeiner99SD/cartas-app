import { useState } from 'react'
import ImageModal from './ImageModal'
import type { Photo } from '../types/photo'

interface Props {
  photo: Photo
  onClick: () => void
}
export default function ImageCard({ photo, onClick }: Props) {
  const [isHovered, setIsHovered] = useState(false)

  function parseAsUTC(s?: string) {
    if (!s) return null
    let t = s.trim()
    if (!t.includes('T') && t.includes(' ')) t = t.replace(' ', 'T')
    if (!(/[Zz]|[+-]\d{2}:?\d{2}$/.test(t))) t = t + 'Z'
    const d = new Date(t)
    return isNaN(d.getTime()) ? null : d
  }

  const parsed = parseAsUTC(photo.created_at)

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

  return (
      <div 
        className="group relative overflow-hidden rounded-2xl shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Mostrar video o imagen */}
        {photo.media_type === 'video' ? (
          <video src={photo.url} className="w-full h-48 object-cover" />
        ) : (
          <img src={photo.url} alt="foto" className="w-full h-48 object-cover" />
        )}
        
        {/* Ícono de video */}
        {photo.media_type === 'video' && (
          <div className="absolute top-2 right-2 bg-white/80 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        )}
        
        {/* Overlay con fecha y descripción */}
        <div 
          className={`absolute inset-0 bg-black/50 flex flex-col justify-between p-3 text-white transition-opacity duration-300
            ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="text-sm">
            <div>Bogotá: {bogotaDate}</div>
            <div>Madrid: {madridDate}</div>
          </div>
          
          {/* Mostrar estado de descripción */}
          <div className="text-xs bg-black/30 rounded p-2">
            {photo.description ? (
              <p className="line-clamp-2"><strong>Descripción:</strong> {photo.description}</p>
            ) : (
              <p className="italic text-gray-300">Sin descripción</p>
            )}
          </div>
        </div>
      </div>
  )
}
