/**
 * ConfettiAnimation - Reusable confetti burst effect
 * Uses canvas-confetti for celebration moments
 */

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

const ConfettiAnimation = ({ trigger = false, type = 'full', colors = ['#7f4f13', '#f8b84e', '#ff6b6b'] }) => {
  useEffect(() => {
    if (!trigger) return;

    const fireConfetti = () => {
      if (type === 'full') {
        // Full screen confetti burst
        const count = 200;
        const defaults = {
          origin: { y: 0.7 },
          colors,
        };

        function fire(particleRatio, opts) {
          confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio),
          });
        }

        fire(0.25, {
          spread: 26,
          startVelocity: 55,
        });

        fire(0.2, {
          spread: 60,
        });

        fire(0.35, {
          spread: 100,
          decay: 0.91,
          scalar: 0.8,
        });

        fire(0.1, {
          spread: 120,
          startVelocity: 25,
          decay: 0.92,
          scalar: 1.2,
        });

        fire(0.1, {
          spread: 120,
          startVelocity: 45,
        });
      } else if (type === 'micro') {
        // Micro burst - subtle celebration
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors,
          scalar: 0.8,
        });
      } else if (type === 'side') {
        // Confetti from sides
        const end = Date.now() + 1000;

        (function frame() {
          confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors,
          });

          confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors,
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        })();
      }
    };

    fireConfetti();
  }, [trigger, type, colors]);

  return null; // No visual component needed
};

export default ConfettiAnimation;
