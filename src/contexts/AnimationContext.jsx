/**
 * AnimationContext - Centralized animation event system
 * Provides global access to trigger animations across the app
 */

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import soundManager from '../services/soundManager';

const AnimationContext = createContext(null);

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within AnimationProvider');
  }
  return context;
};

export const AnimationProvider = ({ children }) => {
  // Event listeners registry
  const listeners = useRef({});
  
  // Animation state management
  const [activeAnimations, setActiveAnimations] = useState(new Set());

  /**
   * Subscribe to animation events
   */
  const on = useCallback((event, callback) => {
    if (!listeners.current[event]) {
      listeners.current[event] = [];
    }
    listeners.current[event].push(callback);

    // Return unsubscribe function
    return () => {
      listeners.current[event] = listeners.current[event].filter(cb => cb !== callback);
    };
  }, []);

  /**
   * Trigger an animation event
   */
  const trigger = useCallback((event, data = {}) => {
    console.log(`🎬 Animation triggered: ${event}`, data);

    // Mark animation as active
    setActiveAnimations(prev => new Set([...prev, event]));

    // Call all registered listeners for this event
    if (listeners.current[event]) {
      listeners.current[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in animation listener for ${event}:`, error);
        }
      });
    }

    // Remove from active animations after a delay
    setTimeout(() => {
      setActiveAnimations(prev => {
        const next = new Set(prev);
        next.delete(event);
        return next;
      });
    }, 3000); // Clear after 3 seconds

    // Trigger associated sound if enabled
    triggerSound(event, data);
  }, []);

  /**
   * Trigger sound based on animation event
   */
  const triggerSound = useCallback((event, data) => {
    const soundMap = {
      'order:placed': 'orderPlaced',
      'wallet:credit': 'walletCredit',
      'cart:add': 'addToCart',
      'order:status': 'statusUpdate',
      'referral:success': 'reward',
      'success': 'success',
    };

    const soundName = soundMap[event];
    if (soundName) {
      soundManager.play(soundName, data.soundOptions);
    }
  }, []);

  /**
   * Check if an animation is currently active
   */
  const isActive = useCallback((event) => {
    return activeAnimations.has(event);
  }, [activeAnimations]);

  /**
   * Convenience methods for common animations
   */
  const animations = {
    orderPlaced: (orderData) => trigger('order:placed', orderData),
    walletCredit: (amount) => trigger('wallet:credit', { amount }),
    addToCart: (item) => trigger('cart:add', { item }),
    orderStatus: (status) => trigger('order:status', { status }),
    referralSuccess: (reward) => trigger('referral:success', { reward }),
    success: (message) => trigger('success', { message }),
  };

  const value = {
    trigger,
    on,
    isActive,
    animations,
    soundManager, // Expose sound manager for manual control
  };

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
};

export default AnimationContext;
