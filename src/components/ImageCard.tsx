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
        <img src={photo.url} alt="foto" className="w-full h-48 object-cover" />
        
        {/* Overlay con fecha y botón de favorito */}
        <div 
          className={`absolute inset-0 bg-black/50 flex flex-col justify-between p-3 text-white transition-opacity duration-300
            ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="text-sm">
            <div>Bogotá: {bogotaDate}</div>
            <div>Madrid: {madridDate}</div>
          </div>
          {/* Aquí estaba el botón de favoritos */}
        </div>
      </div>
  )
}
