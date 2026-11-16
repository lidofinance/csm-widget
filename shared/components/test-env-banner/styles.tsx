import { TestEnvBanner } from '@lidofinance/lido-app-ui';
import styled from 'styled-components';

// z-index 100 keeps the banner above page content but under the sticky header (250), sidebar and scrim (300/290)
export const BannerStyle = styled(TestEnvBanner)`
  position: relative;
  z-index: 100;
`;
