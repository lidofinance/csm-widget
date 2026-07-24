import { BannerOperatorCustomAddresses } from 'features/starter-pack/banner-operator-custom-addresses';
import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks';

import { CuratedOperatorForm } from './curated-operator-form';
import { OtherModuleBanner } from './other-module-banner';

export const CreateCuratedNodeOperator = () => {
  const key = useWeb3Key();

  return (
    <>
      <NoSSRWrapper>
        <OtherModuleBanner />
        <BannerOperatorCustomAddresses />
        <CuratedOperatorForm key={key} />
      </NoSSRWrapper>
    </>
  );
};
