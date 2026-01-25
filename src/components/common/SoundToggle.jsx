/**
 * SoundToggle - User control for enabling/disabling sounds
 * Can be placed in settings or navigation
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAnimation } from '../../contexts/AnimationContext';

const SoundToggle = ({ className = '' }) => {
  const { soundManager } = useAnimation();
  const [enabled, setEnabled] = useState(soundManager.isEnabled());

  useEffect(() => {
    setEnabled(soundManager.isEnabled());
  }, [soundManager]);

  const handleToggle = () => {
    const newState = soundManager.toggle();
    setEnabled(newState);
    
    // Play a test sound when enabling
    if (newState) {
      soundManager.play('success', { volume: 0.2 });
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        enabled
          ? 'bg-[#7f4f13] text-white hover:bg-[#7f4f13]/90'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
      } ${className}`}
      aria-label={enabled ? 'Disable sounds' : 'Enable sounds'}
    >
      <motion.span
        animate={enabled ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
        className="material-symbols-outlined"
      >
        {enabled ? 'volume_up' : 'volume_off'}
      </motion.span>
      <span className="text-sm font-medium">
        {enabled ? 'Sounds On' : 'Sounds Off'}
      </span>
    </button>
  );
};

export default SoundToggle;
