import { useState } from 'react'
import ImageModal from './ImageModal'
import type { Photo } from '../types/photo'

interface Props {
  photo: Photo
  onClick: () => void
}
export default function ImageCard({ photo, onClick }: Props) {
  const [isHovered, setIsHovered] = useState(false)

  const formattedDate = new Date(new Date(photo.created_at).getTime() - 5 * 60 * 60 * 1000).toLocaleString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Bogota'
  }).replace(/,/, ' -')

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
          <div className="text-sm">{formattedDate}</div>
          {/* Aquí estaba el botón de favoritos */}
        </div>
      </div>
  )
}
