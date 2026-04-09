import { useEffect, useState, useRef } from 'react';
import logov2 from '@assets/images/logo_cropped_lite_v2.png';


const SplashScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [location, setLocation] = useState('Gaya, Bihar');
  const [loadingStatus, setLoadingStatus] = useState('Loading assets...');
  const assetsLoadedRef = useRef(false);
  const progressIntervalRef = useRef(null);
  const timeoutIdRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const minDisplayTimeRef = useRef(5000); // Minimum 5 seconds

  useEffect(() => {
    startTimeRef.current = Date.now();
    let fontLoaded = false;
    let logoLoaded = false;

    const updateProgress = (increment) => {
      setProgress(prev => {
        const newProgress = Math.min(prev + increment, 100);
        return newProgress;
      });
    };

    // Function to check if fonts are loaded
    const checkFontsLoaded = async () => {
      try {
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
          if (!fontLoaded) {
            fontLoaded = true;
            updateProgress(40);
            setLoadingStatus('Fonts loaded...');
          }
        } else {
          // Fallback: wait a bit for fonts
          await new Promise(resolve => setTimeout(resolve, 500));
          if (!fontLoaded) {
            fontLoaded = true;
            updateProgress(40);
            setLoadingStatus('Fonts loaded...');
          }
        }
      } catch (error) {
        console.warn('Font loading check failed:', error);
        if (!fontLoaded) {
          fontLoaded = true;
          updateProgress(40);
        }
      }
    };

    // Function to check if logo image is loaded
    const checkLogoLoaded = () => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          if (!logoLoaded) {
            logoLoaded = true;
            updateProgress(40);
            setLoadingStatus('Images loaded...');
          }
          resolve();
        };
        img.onerror = () => {
          // Even if logo fails, continue
          if (!logoLoaded) {
            logoLoaded = true;
            updateProgress(40);
          }
          resolve();
        };
        img.src = logov2;
      });
    };

    // Function to check if all critical images in DOM are loaded
    const checkDOMImagesLoaded = () => {
      return new Promise((resolve) => {
        // Wait a bit for DOM to be ready
        setTimeout(() => {
          const images = document.querySelectorAll('img');
          if (images.length === 0) {
            resolve();
            return;
          }

          let loadedCount = 0;
          let errorCount = 0;
          const totalImages = images.length;
          let resolved = false;

          const checkComplete = () => {
            if (resolved) return;
            
            if (loadedCount + errorCount >= totalImages) {
              resolved = true;
              resolve();
            }
          };

          images.forEach((img) => {
            if (img.complete && img.naturalHeight !== 0) {
              loadedCount++;
              checkComplete();
            } else {
              img.addEventListener('load', () => {
                loadedCount++;
                checkComplete();
              }, { once: true });
              img.addEventListener('error', () => {
                errorCount++;
                checkComplete();
              }, { once: true });
            }
          });

          // Timeout fallback
          setTimeout(() => {
            if (!resolved) {
              resolved = true;
              resolve();
            }
          }, 2000);
        }, 100);
      });
    };

    // Function to finish splash screen (ensures minimum display time)
    const finishSplash = () => {
      if (assetsLoadedRef.current) return; // Already finished
      
      const elapsedTime = Date.now() - startTimeRef.current;
      const remainingTime = minDisplayTimeRef.current - elapsedTime;
      
      if (remainingTime > 0) {
        // Wait for remaining time to reach minimum 5 seconds
        setTimeout(() => {
          if (!assetsLoadedRef.current) {
            assetsLoadedRef.current = true;
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
            }
            onFinish();
          }
        }, remainingTime);
      } else {
        // Minimum time already elapsed, finish immediately
        assetsLoadedRef.current = true;
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
        onFinish();
      }
    };

    // Start loading checks
    const loadAssets = async () => {
      setLoadingStatus('Loading fonts...');
      
      // Start both font and logo loading in parallel
      const fontPromise = checkFontsLoaded();
      const logoPromise = checkLogoLoaded();
      
      await Promise.all([fontPromise, logoPromise]);
      
      setLoadingStatus('Loading images...');
      await checkDOMImagesLoaded();

      // Ensure progress reaches 100%
      setProgress(100);
      setLoadingStatus('Ready!');
      
      // Wait for minimum display time before finishing
      finishSplash();
    };

    // Simulate progress while assets load (but don't exceed 90%)
    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (assetsLoadedRef.current) {
          return prev;
        }
        // Gradually increase progress, but don't go above 90 until assets are loaded
        if (prev < 90) {
          return Math.min(prev + Math.random() * 3, 90);
        }
        return prev;
      });
    }, 150);

    // Start asset loading
    loadAssets();

    // Try to get user's location (optional)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        _position => {
          setLocation('Gaya, Bihar');
        },
        () => {
          setLocation('Gaya, Bihar');
        }
      );
    }

    // Safety timeout - ensure splash doesn't show forever (max 10 seconds)
    timeoutIdRef.current = setTimeout(() => {
      if (!assetsLoadedRef.current) {
        console.warn('Splash screen timeout - proceeding anyway');
        assetsLoadedRef.current = true;
        setProgress(100);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
        onFinish();
      }
    }, 10000); // Max 10 seconds (5 min + 5 safety buffer)

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col text-white items-center justify-center animate-fadeIn bg-[#543918]">
      {/* Panda Chef Logo */}
      <div className="animate-slideUp">
        <div className="cm-panda-logo max-w-[150px]">
          <img src={logov2} alt="HungerWood Panda Chef" className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Brand Name */}
      <div className="text-center mb-8 mt-8 animate-slideUp" style={{ animationDelay: '0.1s' }}>
        {/* <h2 className="text-text-primary text-4xl font-bold text-white">HungerWood</h2> */}
        <p className="text-gray-600 text-md tracking-wider uppercase font-medium text-white">
          Taste the Wild, Feel the Wood
        </p>
      </div>

      {/* Loading Section */}
      <div className="w-80 max-w-[90%] fixed bottom-10 left-[50%] translate-x-[-50%]" style={{ animationDelay: '0.2s' }}>
        {/* Loading Text */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-text-primary font-medium text-white text-sm">{loadingStatus}</p>
          <span className="text-primary-dark font-bold text-white text-sm">{Math.round(progress)}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-primary-100 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-white via-white to-white rounded-full transition-all duration-300 ease-out shadow-lg"
            style={{ width: `${progress}%` }}
          >
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center justify-center mt-6 text-text-secondary">
          <svg
            className="w-5 h-5 mr-2 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium text-white">{location}</span>
        </div>
      </div>

      {/* Decorative elements with theme colors */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-primary rounded-full opacity-20 blur-2xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-primary-dark rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
    </div>
  );
};

export default SplashScreen;
