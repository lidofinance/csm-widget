import { FC } from 'react';
import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { CreatableOperatorType, useWeb3Key } from 'shared/hooks';

import { OtherModuleBanner } from './other-module-banner';
import { ShareLimitBanner } from './share-limit-banner';
import { SubmitKeysForm } from './submit-keys-form';

export const CreateNodeOperator: FC<{ type: CreatableOperatorType }> = ({
  type,
}) => {
  const key = useWeb3Key();

  return (
    <>
      <NoSSRWrapper>
        <ShareLimitBanner />
        <OtherModuleBanner />
        <SubmitKeysForm key={key} type={type} />
      </NoSSRWrapper>
    </>
  );
};
