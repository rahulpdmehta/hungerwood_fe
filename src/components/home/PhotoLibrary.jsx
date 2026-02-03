import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PhotoLibrary = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

  // Sample photo library data - In production, this would come from an API
  const photos = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop',
      title: 'Delicious Pasta',
      category: 'Food'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
      title: 'Gourmet Pizza',
      category: 'Food'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop',
      title: 'Fresh Salad',
      category: 'Food'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
      title: 'Tasty Burger',
      category: 'Food'
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop',
      title: 'Sizzling Steak',
      category: 'Food'
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&h=600&fit=crop',
      title: 'Fresh Sushi',
      category: 'Food'
    },
    {
      id: 7,
      url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
      title: 'Restaurant Ambiance',
      category: 'Restaurant'
    },
    {
      id: 8,
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
      title: 'Dining Experience',
      category: 'Restaurant'
    },
    {
      id: 9,
      url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
      title: 'Chef Special',
      category: 'Food'
    },
    {
      id: 10,
      url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop',
      title: 'Dessert Delight',
      category: 'Food'
    },
    {
      id: 11,
      url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
      title: 'Fresh Ingredients',
      category: 'Food'
    },
    {
      id: 12,
      url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop',
      title: 'Kitchen View',
      category: 'Restaurant'
    }
  ];

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
        <button
          onClick={() => navigate('/about-us')}
          className="text-sm text-[#7f4f13] dark:text-[#d4a574] font-semibold hover:underline flex items-center gap-1"
        >
          View All
          <span className="material-symbols-outlined text-base">
            arrow_forward
          </span>
        </button>
      </div>

      {/* Photo Grid */}
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
            {/* First image - larger */}
            {index === 0 && (
              <div className="absolute top-2 left-2 bg-[#7f4f13] dark:bg-[#d4a574] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                Featured
              </div>
            )}
          </div>
        ))}
      </div>

      {/* View More Button */}
      <button
        onClick={() => navigate('/about-us')}
        className="w-full mt-4 py-3 bg-white dark:bg-[#2d221a] border-2 border-[#7f4f13] dark:border-[#d4a574] text-[#7f4f13] dark:text-[#d4a574] font-bold rounded-xl hover:bg-[#7f4f13] dark:hover:bg-[#d4a574] hover:text-white transition-all flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-lg">
          collections
        </span>
        View Photo Archives
      </button>

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
