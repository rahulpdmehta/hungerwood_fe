import { useNavigate } from 'react-router-dom';
import { useActiveBanners } from '@hooks/useBannerQueries';
import { BannerSkeleton } from '@components/common/Loader';

const BannerCarousel = () => {
  const navigate = useNavigate();
  const { data: activeBanners = [], isLoading: bannersLoading } = useActiveBanners();

  return (
    <div className="mt-2">
      <div className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 gap-4">
        {bannersLoading ? (
          <BannerSkeleton />
        ) : activeBanners.length > 0 ? (
          activeBanners.map((banner, index) => (
            <div
              key={banner.id || banner._id || `banner-${index}`}
              className="snap-center shrink-0 w-[85%] aspect-[2/1] rounded-xl relative overflow-hidden cursor-pointer shadow-lg border border-gray-200 dark:border-zinc-700 hover:shadow-xl transition-shadow"
              onClick={() => banner.ctaLink && navigate(banner.ctaLink)}
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>
              <div className="absolute inset-0 p-5 flex flex-col justify-center text-white">
                {banner.badge && (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded w-fit mb-2 text-white"
                    style={{ backgroundColor: banner.badgeColor }}
                  >
                    {banner.badge}
                  </span>
                )}
                <h3 className="text-xl font-extrabold leading-tight text-white">
                  {banner.title}
                  {banner.subtitle && (
                    <>
                      <br />
                      {banner.subtitle}
                    </>
                  )}
                </h3>
                {banner.description && (
                  <p className="text-xs mt-1 text-gray-200">{banner.description}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          // Fallback banner if no active banners
          <div className="snap-center shrink-0 w-[85%] aspect-[2/1] rounded-xl relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center shadow-lg border border-orange-400">
            <div className="text-center text-white p-5">
              <h3 className="text-2xl font-extrabold">Welcome to HungerWood</h3>
              <p className="text-sm mt-2">Gaya's Premium Dining Experience</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerCarousel;
