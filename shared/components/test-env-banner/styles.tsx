import { TestEnvBanner } from '@lidofinance/lido-shared-ui';
import styled, { createGlobalStyle } from 'styled-components';

// Above the mobile nav overlay (z-index 98) so its backdrop-filter doesn't
// blur the banner, below the sticky header (z-index 250) so the pinned
// header still covers it when it overlaps.
export const BannerStyle = styled(TestEnvBanner)`
  position: relative;
  z-index: 100;
`;

export const TestEnvBannerOffset = createGlobalStyle`
  :root {
    --test-env-banner-height: 60px;
  }
`;
