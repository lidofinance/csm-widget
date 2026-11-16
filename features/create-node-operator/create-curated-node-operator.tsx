import { BannerOperatorCustomAddresses } from 'features/starter-pack/banner-operator-custom-addresses';
import { useWeb3Key } from 'shared/hooks';

import { CuratedOperatorForm } from './curated-operator-form';
import { OtherModuleBanner } from './other-module-banner';

export const CreateCuratedNodeOperator = () => {
  const key = useWeb3Key();

  return (
    <>
      <OtherModuleBanner />
      <BannerOperatorCustomAddresses />
      <CuratedOperatorForm key={key} />
    </>
  );
};
