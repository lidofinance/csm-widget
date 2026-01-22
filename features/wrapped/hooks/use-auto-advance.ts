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
  const prevIndexRef = useRef<number>(currentIndex);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Unified effect that handles both pause/resume and slide changes
  useEffect(() => {
    // Detect if we navigated to a new slide
    const slideChanged = prevIndexRef.current !== currentIndex;
    prevIndexRef.current = currentIndex;

    // Clear any existing timer
    clearTimer();

    // Reset timer when navigating to a new slide
    if (slideChanged) {
      remainingRef.current = AUTO_ADVANCE_INTERVAL;
      startTimeRef.current = 0;
    }

    // Skip first and last slides
    if (isFirst || isLast) {
      return;
    }

    // Don't start timer when paused
    if (isPaused) {
      // Calculate remaining time when pausing (only if timer was running)
      if (!slideChanged && startTimeRef.current > 0) {
        const elapsed = Date.now() - startTimeRef.current;
        remainingRef.current = Math.max(0, remainingRef.current - elapsed);
      }
      return clearTimer;
    }

    // Start/resume timer when not paused
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      goNext();
    }, remainingRef.current);

    return clearTimer;
  }, [isPaused, currentIndex, isFirst, isLast, goNext, clearTimer]);

  return null;
};
