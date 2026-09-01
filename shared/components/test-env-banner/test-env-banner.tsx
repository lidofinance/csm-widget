import { config } from 'config';
import NoSSRWrapper from 'shared/components/no-ssr-wrapper';

import { BannerStyle, TestEnvBannerOffset } from './styles';

// client-only: `isTestEnv` comes from `window.__env__` at runtime, SSR would mismatch
export const TestEnvBanner = () => (
  <NoSSRWrapper>
    {config.isTestEnv && (
      <>
        <TestEnvBannerOffset />
        <BannerStyle />
      </>
    )}
  </NoSSRWrapper>
);
