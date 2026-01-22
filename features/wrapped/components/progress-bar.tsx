import { FC, useCallback, useMemo } from 'react';
import { useWrappedActions, useWrappedState } from '../context';
import { AUTO_ADVANCE_INTERVAL } from '../data';
import { ProgressBarWrapper, ProgressSegment } from '../styles';

export const ProgressBar: FC = () => {
  const { currentIndex, isPaused, progressSlides } = useWrappedState();
  const { goToSlide } = useWrappedActions();

  // Map currentIndex (in applicableSlides) to progress position (in progressSlides)
  // Intro is at index 0, so subtract 1 to get progress position
  const currentProgressIndex = useMemo(() => {
    return currentIndex - 1;
  }, [currentIndex]);

  // Map progress segment click to slide index in applicableSlides
  const handleSegmentClick = useCallback(
    (progressIndex: number) => {
      // Add 1 to skip intro (intro is at index 0)
      const slideIndex = progressIndex + 1;
      goToSlide(slideIndex);
    },
    [goToSlide],
  );

  return (
    <ProgressBarWrapper>
      {progressSlides.map((_, i) => (
        <ProgressSegment
          key={i}
          $state={
            i < currentProgressIndex
              ? 'completed'
              : i === currentProgressIndex
                ? 'active'
                : 'pending'
          }
          $isCompleted={i < currentProgressIndex}
          $isPaused={isPaused}
          $duration={AUTO_ADVANCE_INTERVAL}
          onClick={() => handleSegmentClick(i)}
        />
      ))}
    </ProgressBarWrapper>
  );
};
