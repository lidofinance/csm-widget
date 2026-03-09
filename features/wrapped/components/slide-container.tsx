import { DarkThemeProvider } from '@lidofinance/lido-ui';
import { FC, PropsWithChildren } from 'react';
import { SlideWrapper } from '../styles';
import { Background, SlideVariant } from './backgrounds';

type SlideContainerProps = PropsWithChildren<{
  bg?: SlideVariant;
  same?: boolean;
}>;

export const SlideDumbContainer: FC<SlideContainerProps> = ({
  children,
  same,
}) => {
  return (
    <DarkThemeProvider>
      <SlideWrapper $same={same}>
        <Background />
        {children}
      </SlideWrapper>
    </DarkThemeProvider>
  );
};
