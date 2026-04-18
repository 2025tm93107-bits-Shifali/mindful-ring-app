import { useEffect, useRef, useState } from 'react';

interface Options {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  disabled?: boolean;
}

/**
 * Lightweight pull-to-refresh hook for touch devices.
 * Activates only when the page is scrolled to the top.
 */
export const usePullToRefresh = ({ onRefresh, threshold = 70, disabled }: Options) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const pulling = useRef(false);

  useEffect(() => {
    if (disabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY > 0 || refreshing) return;
      startY.current = e.touches[0].clientY;
      pulling.current = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!pulling.current || startY.current === null || refreshing) return;
      const diff = e.touches[0].clientY - startY.current;
      if (diff > 0 && window.scrollY === 0) {
        // dampen
        const distance = Math.min(diff * 0.5, threshold * 1.5);
        setPullDistance(distance);
        if (diff > 10) e.preventDefault();
      }
    };

    const handleTouchEnd = async () => {
      if (!pulling.current) return;
      pulling.current = false;
      startY.current = null;
      if (pullDistance >= threshold && !refreshing) {
        setRefreshing(true);
        try {
          await onRefresh();
        } finally {
          setRefreshing(false);
          setPullDistance(0);
        }
      } else {
        setPullDistance(0);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onRefresh, threshold, disabled, pullDistance, refreshing]);

  return { pullDistance, refreshing, threshold };
};
