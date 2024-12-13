import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks/useWeb3Key';

import { SubmitKeysForm } from './submit-keys-form';
import { Faq } from 'shared/components';
import { OtherModuleBanner } from './other-module-banner';
import { ShareLimitBanner } from './share-limit-banner';

export const CreateNodeOperator = () => {
  const key = useWeb3Key();
  return (
    <>
      <NoSSRWrapper>
        <ShareLimitBanner />
        <OtherModuleBanner />
        <SubmitKeysForm key={key} />
      </NoSSRWrapper>
      <Faq />
    </>
  );
};
