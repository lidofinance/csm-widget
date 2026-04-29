import { PATH } from 'consts';
import { NavigateCMv1 } from 'features/welcome/navigate-cm-v1';
import { useCuratedGatesEligibility, useInvites } from 'modules/web3';
import { FC } from 'react';
import { WelcomeSection } from 'shared/components';
import { Layout } from 'shared/layout';
import { Navigate, SplashPage } from 'shared/navigate';
import { BannerOperatorCustomAddresses } from './banner-operator-custom-addresses';
import { BannerNotEligible } from './not-eligible/banner-not-eligible';
import { BannerTryCsm } from './not-eligible/banner-try-csm';

export const CmWelcomePage: FC = () => {
  const { data: isEligible, isPending } = useCuratedGatesEligibility(
    undefined,
    (data) => data.length > 0,
  );
  const { data: invites, isPending: isPendingInvites } = useInvites();

  if (isPending || isPendingInvites) {
    return <SplashPage />;
  }

  return (
    <Layout pageName="CmStarterPack">
      {isEligible ? (
        <WelcomeSection>
          <Navigate path={PATH.CREATE} fallback={null} />
        </WelcomeSection>
      ) : invites?.length ? (
        <WelcomeSection>
          <Navigate path={PATH.SETTINGS_INBOX} fallback={null} />
        </WelcomeSection>
      ) : (
        <>
          <BannerOperatorCustomAddresses />
          <BannerNotEligible />
          <BannerTryCsm />
          <NavigateCMv1 />
        </>
      )}
    </Layout>
  );
};
