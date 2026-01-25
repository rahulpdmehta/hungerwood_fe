import BottomNavBar from '@components/layout/BottomNavBar';
import FloatingCartButton from '@components/layout/FloatingCartButton';
import HomeHeader from '@components/layout/HomeHeader';
import WalletBalancePill from '@components/home/WalletBalancePill';
import BannerCarousel from '@components/home/BannerCarousel';
import ReferEarnBanner from '@components/home/ReferEarnBanner';
import RestaurantInfoCard from '@components/home/RestaurantInfoCard';
import CuisineGrid from '@components/home/CuisineGrid';
import BestSellersSection from '@components/home/BestSellersSection';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#f8f7f6] dark:bg-[#211811] pb-20">
      {/* Header */}
      <HomeHeader />

      {/* Wallet Balance Pill */}
      <WalletBalancePill />

      {/* Promotional Carousel */}
      <BannerCarousel />

      {/* Refer & Earn Banner */}
      <ReferEarnBanner />

      {/* Restaurant Info Card */}
      <RestaurantInfoCard />

      {/* Explore Cuisines Section */}
      <CuisineGrid />

      {/* Best Sellers Section */}
      <BestSellersSection />

      {/* Floating Cart Button */}
      <FloatingCartButton />

      {/* Promotional Carousel */}
      <BannerCarousel />

      {/* Bottom Navigation Bar */}
      <BottomNavBar />
    </div>
  );
};

export default Home;
