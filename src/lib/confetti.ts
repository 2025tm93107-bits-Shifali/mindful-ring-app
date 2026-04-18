import confetti from 'canvas-confetti';

export const fireConfetti = () => {
  const duration = 1500;
  const end = Date.now() + duration;

  const colors = ['#22c55e', '#16a34a', '#fbbf24', '#f97316'];

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors,
    });

    if (Date.now() < end) requestAnimationFrame(frame);
  })();

  // Center burst
  confetti({
    particleCount: 120,
    spread: 90,
    origin: { y: 0.6 },
    colors,
  });
};
