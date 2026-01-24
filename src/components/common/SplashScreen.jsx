import { useEffect, useState } from 'react';

const SplashScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [location, setLocation] = useState('Gaya, Bihar');

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Wait a bit before finishing
          setTimeout(() => {
            onFinish();
          }, 300);
          return 100;
        }
        // Random increment for more natural feel
        return prev + Math.random() * 15;
      });
    }, 200);

    // Try to get user's location (optional)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        _position => {
          // In a real app, you'd use reverse geocoding API
          // For now, keeping default location
          setLocation('Gaya, Bihar');
        },
        () => {
          setLocation('Gaya, Bihar');
        }
      );
    }

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 animate-fadeIn">
      {/* Panda Chef Logo */}
      <div className="mb-8 animate-slideUp">
        <div className="cm-panda-logo max-w-[200px]">
          <img src="/logo_1.jpeg" alt="HungerWood Panda Chef" className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Brand Name */}
      <div className="text-center mb-8 animate-slideUp" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-text-primary text-4xl font-bold">HungerWood</h2>
        <p className="text-gray-600 text-lg tracking-wider uppercase font-medium">
          Taste the Wild, Feel the Wood
        </p>
      </div>

      {/* Loading Section */}
      <div className="w-80 max-w-[90%] animate-slideUp" style={{ animationDelay: '0.2s' }}>
        {/* Loading Text */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-text-primary font-medium">Brewing fresh flavors...</p>
          <span className="text-primary-dark font-bold">{Math.round(progress)}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-primary-100 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-primary via-primary-dark to-cta rounded-full transition-all duration-300 ease-out shadow-lg"
            style={{ width: `${progress}%` }}
          >
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center justify-center mt-6 text-text-secondary">
          <svg
            className="w-5 h-5 mr-2 text-primary"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium">{location}</span>
        </div>
      </div>

      {/* Decorative elements with theme colors */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-primary rounded-full opacity-20 blur-2xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-primary-dark rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
    </div>
  );
};

export default SplashScreen;
