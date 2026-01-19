import { useCallback, useEffect, useRef } from 'react';
import { useWrappedActions, useWrappedState } from '../context';
import { AUTO_ADVANCE_INTERVAL } from '../data';

/**
 * Auto-advances slides with pause/resume capability.
 *
 * Key features:
 * - Auto-advances every 6 seconds (except first/last slides)
 * - Preserves remaining time when paused (e.g., pause at 3s → resume continues from 3s)
 * - Resets timer when navigating between slides
 *
 * This sophisticated approach prevents jarring timer resets when hovering over slides.
 */
export const useAutoAdvance = () => {
  const { isPaused, currentIndex, applicableSlides } = useWrappedState();
  const { goNext } = useWrappedActions();
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === applicableSlides.length - 1;

  // Track timer state to preserve remaining time across pause/resume
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const remainingRef = useRef<number>(AUTO_ADVANCE_INTERVAL);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    if (isFirst || isLast) return;

    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      goNext();
      remainingRef.current = AUTO_ADVANCE_INTERVAL;
    }, remainingRef.current);
  }, [clearTimer, goNext, isFirst, isLast]);

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) {
        const elapsed = Date.now() - startTimeRef.current;
        remainingRef.current = Math.max(0, remainingRef.current - elapsed);
        clearTimer();
      }
    } else {
      startTimer();
    }

    return clearTimer;
  }, [isPaused, clearTimer, startTimer]);

  // Reset timer only when navigating to a new slide
  // Note: isPaused is intentionally excluded from deps - the first effect handles pause/resume
  // Adding isPaused here would reset remaining time on every pause, breaking sync with progress bar
  useEffect(() => {
    remainingRef.current = AUTO_ADVANCE_INTERVAL;
    if (!isPaused) {
      startTimer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, startTimer]);

  return null;
};
