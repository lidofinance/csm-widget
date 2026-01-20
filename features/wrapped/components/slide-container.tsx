import { DarkThemeProvider } from '@lidofinance/lido-ui';
import { FC, PropsWithChildren, useCallback } from 'react';
import { useWrappedActions } from '../context';
import { SlideWrapper } from '../styles';
import { Background, SlideVariant } from './backgrounds';
import { ProgressBar } from './progress-bar';

type SlideContainerProps = PropsWithChildren<{
  bg?: SlideVariant;
  same?: boolean;
  progress?: boolean;
}>;

export const SlideContainer: FC<SlideContainerProps> = ({
  children,
  bg,
  progress,
}) => {
  const { pause, resume } = useWrappedActions();

  const handleMouseEnter = useCallback(() => pause(), [pause]);
  const handleMouseLeave = useCallback(() => resume(), [resume]);

  return (
    <DarkThemeProvider>
      <SlideWrapper
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Background variant={bg} />
        {progress && <ProgressBar />}
        {children}
      </SlideWrapper>
    </DarkThemeProvider>
  );
};

export const SlideDumbContainer: FC<SlideContainerProps> = ({
  children,
  bg,
  same,
}) => {
  return (
    <DarkThemeProvider>
      <SlideWrapper $same={same}>
        <Background variant={bg} />
        {children}
      </SlideWrapper>
    </DarkThemeProvider>
  );
};
