import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import UploadButton from './UploadButton';
import ImageCard from './ImageCard';
import ImageModal from './ImageModal';
import type { Photo } from '../types/photo';

export default function Gallery() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number | null>(null)

  const handleGoBack = () => {
    window.location.href = '/home'
  }

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
       
        return
      }

   
      if (!data || data.length === 0) {
       
        setPhotos([])
        return
      }

      setPhotos(data)
    } catch (err) {
    }
  }

  const handleNewPhoto = (newPhoto: Photo) => {
    if (!newPhoto) return
    setPhotos((prev) => [newPhoto, ...prev])
  }

  // Se eliminó la función handleToggleFavorite

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (currentPhotoIndex === null) return
    
    if (direction === 'prev' && currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1)
    } else if (direction === 'next' && currentPhotoIndex < photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1)
    }
  }

  const openPhotoModal = (index: number) => {
    setCurrentPhotoIndex(index)
  }

  const closePhotoModal = () => {
    setCurrentPhotoIndex(null)
  }

  useEffect(() => {
    fetchPhotos()

    const channel = supabase
      .channel('public:photos')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'photos' },
        (payload) => {
          setPhotos((prev) => [payload.new as Photo, ...prev])
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'photos' },
        (payload) => {
          setPhotos((prev) => prev.map(p => 
            p.id === (payload.new as Photo).id ? (payload.new as Photo) : p
          ))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 p-6 max-w-6xl mx-auto">
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Volver al inicio
        </button>
      </div>
      <h1 className="text-4xl font-bold">Nuestras fotitos</h1>
      <UploadButton onUpload={handleNewPhoto} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
        {photos.map((photo, index) => (
          <ImageCard 
            key={photo.id} 
            photo={photo}
            onClick={() => openPhotoModal(index)}
          />
        ))}
      </div>

      {/* Modal global */}
      {currentPhotoIndex !== null && photos[currentPhotoIndex] && (
        <ImageModal 
          url={photos[currentPhotoIndex].url}
          created_at={photos[currentPhotoIndex].created_at}
          onClose={closePhotoModal}
          currentIndex={currentPhotoIndex}
          totalPhotos={photos.length}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  )
}
