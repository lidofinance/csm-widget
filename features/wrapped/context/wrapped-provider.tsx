import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { WrappedStats } from '../data';
import { SlideComponent } from '../slides';

type WrappedState = {
  currentIndex: number;
  isPaused: boolean;
  data: WrappedStats | null;
  applicableSlides: SlideComponent[];
  progressSlides: SlideComponent[];
};

type WrappedActions = {
  goNext: () => void;
  goBack: () => void;
  goToSlide: (index: number) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
};

type WrappedContextValue = WrappedState & WrappedActions;

const WrappedContext = createContext<WrappedContextValue | null>(null);

type WrappedProviderProps = PropsWithChildren<{
  data: WrappedStats | null;
  slides: SlideComponent[];
}>;

export const WrappedProvider: FC<WrappedProviderProps> = ({
  children,
  data,
  slides,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const applicableSlides = useMemo(
    () =>
      !data
        ? []
        : slides.filter(
            (slide) => !slide.shouldRender || slide.shouldRender(data),
          ),
    [slides, data],
  );

  const progressSlides = useMemo(
    () => applicableSlides.slice(1, -1),
    [applicableSlides],
  );

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, applicableSlides.length - 1));
  }, [applicableSlides.length]);

  const goBack = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      setCurrentIndex(
        Math.max(0, Math.min(index, applicableSlides.length - 1)),
      );
    },
    [applicableSlides.length],
  );

  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);
  const reset = useCallback(() => {
    setCurrentIndex(0);
    setIsPaused(false);
  }, []);

  const value = useMemo<WrappedContextValue>(
    () => ({
      currentIndex,
      isPaused,
      data,
      applicableSlides,
      progressSlides,
      goNext,
      goBack,
      goToSlide,
      pause,
      resume,
      reset,
    }),
    // Callbacks already stable via useCallback, don't need in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentIndex, isPaused, data, applicableSlides, progressSlides],
  );

  return (
    <WrappedContext.Provider value={value}>{children}</WrappedContext.Provider>
  );
};

const useWrapped = (): WrappedContextValue => {
  const context = useContext(WrappedContext);
  if (!context) {
    throw new Error('useWrapped must be used within WrappedProvider');
  }
  return context;
};

export const useWrappedState = () => {
  const { currentIndex, isPaused, data, applicableSlides, progressSlides } =
    useWrapped();
  if (!data) {
    throw new Error('Wrapped data is not available');
  }
  return {
    currentIndex,
    isPaused,
    data,
    applicableSlides,
    progressSlides,
  } as WrappedState & {
    data: WrappedStats;
  };
};

export const useWrappedActions = (): WrappedActions => {
  const { goNext, goBack, goToSlide, pause, resume, reset } = useWrapped();
  return { goNext, goBack, goToSlide, pause, resume, reset };
};
