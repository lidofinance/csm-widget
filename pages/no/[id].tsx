import { PATH } from 'consts/urls';
import { SplashPage } from 'features/welcome';
import { useRouter } from 'next/router';
import { useNodeOperatorContext } from 'providers/node-operator-provider';
import { useEffect } from 'react';
import { NodeOperatorId } from 'types';
import { getFirstParam } from 'utils';

const Page = () => {
  const { query, isReady, push } = useRouter();
  const { appendAndSwitch } = useNodeOperatorContext();

  useEffect(() => {
    if (!isReady) return;

    const apply = async () => {
      const queryId = getFirstParam(query['id']) as NodeOperatorId;
      const numberId = parseInt(queryId);
      if (!Number.isNaN(numberId)) {
        const id: NodeOperatorId = `${numberId}`;
        await appendAndSwitch(id);
      }
      void push(PATH.HOME);
    };

    void apply();
  }, [appendAndSwitch, isReady, push, query]);

  return <SplashPage />;
};

export default Page;
