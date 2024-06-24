import { DashboardPage } from 'features/dashboard';
import { GateActiveUser, GateLoaded, GateNodeOperator } from 'shared/gates';
import { StarterPackPage } from 'features/starter-pack';
import { NotReleasedPage, SplashPage, WelcomePage } from 'features/welcome';
import { GetStaticProps } from 'next';
import { SecretConfigType, secretConfig } from 'config';
import { FC } from 'react';

type PageProps = Pick<SecretConfigType, 'notReleased'>;

const Page: FC<PageProps> = ({ notReleased }) => {
  if (notReleased) return <NotReleasedPage />;

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

export const getStaticProps: GetStaticProps = async () => {
  const { notReleased } = secretConfig;

  return {
    props: {
      notReleased,
    },
  };
};
