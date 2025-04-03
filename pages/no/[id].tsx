import { PATH } from 'consts/urls';
import { useRouter } from 'next/router';
import { useNodeOperatorContext } from 'providers/node-operator-provider';
import { useEffect } from 'react';
import { useAccount } from 'shared/hooks';
import { SplashPage } from 'shared/navigate';
import { NodeOperatorId } from 'types';
import { getFirstParam } from 'utils';

const Page = () => {
  const { push, query, ...all } = useRouter();
  const { appendAndSwitch } = useNodeOperatorContext();
  const { address } = useAccount();

  useEffect(() => {
    if (!query || !address) return;

    const apply = async () => {
      const queryId = getFirstParam(query['id']) ?? '';
      const numberId = parseInt(queryId);
      if (!Number.isNaN(numberId)) {
        const id: NodeOperatorId = `${numberId}`;
        await appendAndSwitch(id);
      }
      void push(PATH.HOME);
    };

    setTimeout(() => void apply(), 100);
  }, [address, all, appendAndSwitch, push, query]);

  return <SplashPage />;
};

export default Page;
