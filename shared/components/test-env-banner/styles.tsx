import { TestEnvBanner } from '@lidofinance/lido-shared-ui';
import styled, { createGlobalStyle } from 'styled-components';

// z-index 100 keeps the banner above page content but under the sticky header (250), sidebar and scrim (300/290)
export const BannerStyle = styled(TestEnvBanner)`
  position: relative;
  z-index: 100;
`;

export const TestEnvBannerOffset = createGlobalStyle`
  :root {
    --test-env-banner-height: 60px;
  }
`;
