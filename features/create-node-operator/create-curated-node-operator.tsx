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
        <CuratedOperatorForm key={key} />
      </NoSSRWrapper>
    </>
  );
};
