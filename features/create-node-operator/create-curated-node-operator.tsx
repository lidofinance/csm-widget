import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { BannerOperatorCustomAddresses } from 'features/create-node-operator/banner-operator-custom-addresses';
import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks';

import { CuratedOperatorForm } from './curated-operator-form';
import { OtherModuleBanner } from './other-module-banner';

export const CreateCuratedNodeOperator = () => {
  const key = useWeb3Key();

  return (
    <>
      <NoSSRWrapper>
        <OtherModuleBanner module={MODULE_NAME.CM} />
        <BannerOperatorCustomAddresses />
        <CuratedOperatorForm key={key} />
      </NoSSRWrapper>
    </>
  );
};
