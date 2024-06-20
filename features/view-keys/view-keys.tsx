import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks/useWeb3Key';
import { ViewKeysSection } from './view-keys-section';

export const ViewKeys = () => {
  const key = useWeb3Key();
  return (
    <>
      <NoSSRWrapper>
        <ViewKeysSection key={key} />
      </NoSSRWrapper>
    </>
  );
};
