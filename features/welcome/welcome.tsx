import { FC } from 'react';

import { NotReleasedBanner } from './not-released-banner';
import { WelcomeSection } from './welcome-section';

export const Welcome: FC = () => (
  <>
    <NotReleasedBanner />
    <WelcomeSection />
  </>
);
