/**
 * AddToCartAnimation - Fly-to-cart effect with cart bounce
 * Shows item flying to cart icon and cart bouncing
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimation } from '../../contexts/AnimationContext';

const AddToCartAnimation = () => {
  const { on } = useAnimation();
  const [animations, setAnimations] = useState([]);

  useEffect(() => {
    const unsubscribe = on('cart:add', (data) => {
      const animationId = Date.now();
      
      // Add new animation
      setAnimations(prev => [
        ...prev,
        {
          id: animationId,
          item: data.item,
          sourcePosition: data.sourcePosition || { x: window.innerWidth / 2, y: window.innerHeight / 2 },
        },
      ]);

      // Remove animation after it completes
      setTimeout(() => {
        setAnimations(prev => prev.filter(anim => anim.id !== animationId));
      }, 1000);
    });

    return unsubscribe;
  }, [on]);

  // Calculate cart icon position (bottom navigation - Orders tab)
  const getCartPosition = () => {
    const cartIcon = document.querySelector('[href="/orders"]') || 
                     document.querySelector('.cart-icon');
    
    if (cartIcon) {
      const rect = cartIcon.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }
    
    // Fallback to bottom right
    return {
      x: window.innerWidth - 60,
      y: window.innerHeight - 100,
    };
  };

  return (
    <AnimatePresence>
      {animations.map((anim) => {
        const cartPos = getCartPosition();
        
        return (
          <motion.div
            key={anim.id}
            initial={{
              x: anim.sourcePosition.x,
              y: anim.sourcePosition.y,
              scale: 1,
              opacity: 1,
            }}
            animate={{
              x: cartPos.x,
              y: cartPos.y,
              scale: 0.2,
              opacity: [1, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
            className="fixed z-[9997] pointer-events-none"
          >
            {/* Flying Item Visual */}
            <div className="w-16 h-16 rounded-lg bg-[#7f4f13] shadow-lg flex items-center justify-center">
              {anim.item?.image ? (
                <img 
                  src={anim.item.image} 
                  alt="" 
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="material-symbols-outlined text-white text-3xl">
                  restaurant
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
};

// Cart Icon Bounce - Separate component to add bounce to cart
export const CartIconBounce = ({ children, className = '' }) => {
  const { on } = useAnimation();
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    const unsubscribe = on('cart:add', () => {
      setBounce(true);
      setTimeout(() => setBounce(false), 600);
    });

    return unsubscribe;
  }, [on]);

  return (
    <motion.div
      animate={bounce ? {
        scale: [1, 1.3, 0.9, 1.1, 1],
        rotate: [0, -10, 10, -5, 0],
      } : {}}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AddToCartAnimation;
