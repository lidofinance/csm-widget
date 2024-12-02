import { PATH } from 'consts/urls';
import { useRouter } from 'next/router';
import { useNodeOperatorContext } from 'providers/node-operator-provider';
import { useEffect } from 'react';
import { useSearchParams } from 'shared/hooks';
import { SplashPage } from 'shared/navigate';
import { NodeOperatorId } from 'types';

const Page = () => {
  const { push } = useRouter();
  const query = useSearchParams();
  const { appendAndSwitch } = useNodeOperatorContext();

  useEffect(() => {
    if (!query) return;

    const apply = async () => {
      const queryId = query.get('id') ?? '';
      const numberId = parseInt(queryId);
      if (!Number.isNaN(numberId)) {
        const id: NodeOperatorId = `${numberId}`;
        await appendAndSwitch(id);
      }
      void push(PATH.HOME);
    };

    void apply();
  }, [appendAndSwitch, push, query]);

  return <SplashPage />;
};

export default Page;
