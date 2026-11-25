import { config } from 'config';

import { TestEnvBanner as TestEnvBannerUi } from '@lidofinance/lido-app-ui';
import s from './styles.module.css';

export const TestEnvBanner = () =>
  config.isTestEnv ? <TestEnvBannerUi className={s.banner} /> : null;
