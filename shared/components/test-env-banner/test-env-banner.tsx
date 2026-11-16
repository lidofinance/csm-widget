import { config } from 'config';

import { BannerStyle } from './styles';

export const TestEnvBanner = () =>
  config.isTestEnv ? <BannerStyle /> : null;
