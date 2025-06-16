import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks';

import { OtherModuleBanner } from './other-module-banner';
import { ShareLimitBanner } from './share-limit-banner';
import { SubmitKeysForm } from './submit-keys-form';

export const CreateNodeOperator = () => {
  const key = useWeb3Key();
  return (
    <>
      <NoSSRWrapper>
        <ShareLimitBanner />
        <OtherModuleBanner />
        <SubmitKeysForm key={key} />
      </NoSSRWrapper>
    </>
  );
};
