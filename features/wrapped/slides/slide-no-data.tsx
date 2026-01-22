import { DarkThemeProvider } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Background } from '../components/backgrounds';
import { SlideContent, SlideHeading, SlideWrapper } from '../styles';

export const SlideNoData: FC = () => {
  return (
    <DarkThemeProvider>
      <SlideWrapper>
        <Background variant="thanks" />
        <SlideContent $position="start">
          <br />
          <SlideHeading>No 2025 story to tell yet.</SlideHeading>
        </SlideContent>
        <SlideContent $position="end">
          <SlideHeading>Your validation journey starts now!</SlideHeading>
        </SlideContent>
      </SlideWrapper>
    </DarkThemeProvider>
  );
};
