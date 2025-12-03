import { PATH } from 'consts/urls';
import { useApplyOperator, useDappStatus } from 'modules/web3';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Layout } from 'shared/layout';
import { SplashPage } from 'shared/navigate';
import { getFirstParam } from 'utils';
import { getProps } from 'utilsApi';

const Page = () => {
  const { push, query } = useRouter();
  const appendAndSwitch = useApplyOperator();
  const { address } = useDappStatus();

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
  }, [address, appendAndSwitch, push, query]);

  return <>{!address ? <Layout>login</Layout> : <SplashPage />}</>;
};

export default Page;

export const getServerSideProps = getProps();
