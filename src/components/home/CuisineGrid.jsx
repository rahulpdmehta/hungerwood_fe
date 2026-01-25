import { useNavigate } from 'react-router-dom';

const CuisineGrid = () => {
  const navigate = useNavigate();

  // Cuisines
  const cuisines = [
    {
      id: 1,
      name: 'North Indian',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80',
    },
    {
      id: 2,
      name: 'Chinese',
      image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&q=80',
    },
    {
      id: 3,
      name: 'Tandoor',
      image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&q=80',
    },
    {
      id: 4,
      name: 'Continental',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80',
    },
  ];

  return (
    <div className="mt-8">
      <div className="px-4 flex justify-between items-end mb-4">
        <div>
          <h3 className="text-lg font-extrabold tracking-tight text-[#181411] dark:text-white">
            Explore Cuisines
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Authentic flavors from around the world</p>
        </div>
        <button className="text-[#7f4f13] text-xs font-bold" onClick={() => navigate('/menu')}>
          View All
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 px-4">
        {cuisines.map((cuisine) => (
          <button
            key={cuisine.id}
            className="relative aspect-square rounded-xl overflow-hidden group shadow-md border-2 border-gray-200 dark:border-zinc-700 hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/menu?category=${cuisine.name}`)}
          >
            <img src={cuisine.image} alt={cuisine.name} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-3 left-3">
              <p className="text-white text-sm font-bold drop-shadow-lg">{cuisine.name}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CuisineGrid;
