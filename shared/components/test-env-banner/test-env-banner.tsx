import { config } from 'config';

import { BannerStyle, TestEnvBannerOffset } from './styles';

export const TestEnvBanner = () =>
  config.isTestEnv ? (
    <>
      <TestEnvBannerOffset />
      <BannerStyle />
    </>
  ) : null;
