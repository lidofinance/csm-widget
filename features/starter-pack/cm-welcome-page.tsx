import { PATH } from 'consts';
import { useCuratedGatesEligibility, useDappStatus } from 'modules/web3';
import { FC } from 'react';
import { Layout } from 'shared/layout';
import { Navigate, SplashPage } from 'shared/navigate';
import { InvitesRedirect } from './invites-redirect';
import { BannerNotEligible } from './not-eligible/banner-not-eligible';
import { BannerTryCsm } from './not-eligible/banner-try-csm';
import { WelcomeSection } from 'shared/components';
import { NavigateCMv1 } from 'features/welcome/navigate-cm-v1';

export const CmWelcomePage: FC = () => {
  const { address } = useDappStatus();
  const { data: isEligible, isPending } = useCuratedGatesEligibility(
    address,
    (data) => data.length > 0,
  );

  if (isPending) {
    return <SplashPage />;
  }

  return (
    <>
      <Layout pageName="CmStarterPack">
        <InvitesRedirect />
        {!isEligible ? (
          <>
            <BannerNotEligible />
            <BannerTryCsm />
            <NavigateCMv1 />
          </>
        ) : (
          <WelcomeSection>
            <Navigate path={PATH.CREATE} fallback={null} />
          </WelcomeSection>
        )}
      </Layout>
    </>
  );
};
