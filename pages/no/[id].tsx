import { PATH } from 'consts/urls';
import { useApplyOperator } from 'modules/web3';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAccount } from 'shared/hooks';
import { SplashPage } from 'shared/navigate';
import { getFirstParam } from 'utils';

const Page = () => {
  const { push, query, ...all } = useRouter();
  const appendAndSwitch = useApplyOperator();
  const { address } = useAccount();

  useEffect(() => {
    if (!query || !address) return;

    const apply = async () => {
      const queryId = getFirstParam(query['id']) ?? '';
      try {
        const id = BigInt(queryId);
        await appendAndSwitch(id);
        void push(PATH.HOME);
      } catch (e) {
        /* nope */
      }
    };

    setTimeout(() => void apply(), 100);
  }, [address, all, appendAndSwitch, push, query]);

  return <SplashPage />;
};

export default Page;
