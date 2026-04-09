import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { photoService } from '@services/photo.service';

const PhotoLibrary = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const data = await photoService.getActivePhotos();
      setPhotos(data || []);
    } catch (error) {
      console.error('Failed to load photos:', error);
      // Fallback to empty array on error
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (photo) => {
    setSelectedImage(photo);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="px-4 mt-6 mb-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#7f4f13] dark:text-[#d4a574] text-2xl">
            photo_library
          </span>
          <h2 className="text-xl font-extrabold text-[#181411] dark:text-white">
            Photo Gallery
          </h2>
        </div>
      </div>

      {/* Photo Grid */}
      {loading ? (
        <div className="grid grid-cols-3 gap-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
          ))}
        </div>
      ) : photos.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {photos.slice(0, 6).map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => handleImageClick(photo)}
              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-all"
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x400?text=Image';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-xs font-semibold truncate">
                    {photo.title}
                  </p>
                </div>
              </div>
              {/* Featured badge */}
              {photo.isFeatured && (
                <div className="absolute top-2 left-2 bg-[#7f4f13] dark:bg-[#d4a574] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  Featured
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p className="text-sm">No photos available</p>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh]">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="w-full h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
              <h3 className="text-white text-lg font-bold mb-1">
                {selectedImage.title}
              </h3>
              <p className="text-white/80 text-sm">
                {selectedImage.category}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoLibrary;
