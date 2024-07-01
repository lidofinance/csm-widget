import { SecretConfigType, secretConfig } from 'config';
import { DashboardPage } from 'features/dashboard';
import { StarterPackPage } from 'features/starter-pack';
import { SplashPage, WelcomePage } from 'features/welcome';
import { getFaqList } from 'lib/faqList';
import { GetStaticProps } from 'next';
import { FC } from 'react';
import { GateActiveUser, GateLoaded, GateNodeOperator } from 'shared/gates';

type PageProps = Pick<SecretConfigType, 'notReleased'>;

const Page: FC<PageProps> = () => {
  return (
    <GateLoaded fallback={<SplashPage />}>
      <GateActiveUser fallback={<WelcomePage />}>
        <GateNodeOperator fallback={<StarterPackPage />}>
          <DashboardPage />
        </GateNodeOperator>
      </GateActiveUser>
    </GateLoaded>
  );
};

export default Page;

const faqList = getFaqList([
  'main-why-run-an-ethereum-validator',
  'main-what-is-required-as-a-node-operator-in-csm',
  'main-what-do-node-operators-receive-in-csm',
  'main-what-are-the-risks-of-running-a-validator',
  'main-how-does-csm-work',
  'main-what-makes-csm-unique',
  'main-how-much-bond-is-needed',
  'main-how-can-i-get-help',
]);

export const getStaticProps: GetStaticProps = async () => {
  const { notReleased } = secretConfig;

  return {
    props: {
      notReleased,
      faqList: await faqList,
    },
  };
};
