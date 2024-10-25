import { SecretConfigType } from 'config';
import { DashboardPage } from 'features/dashboard';
import { StarterPackPage } from 'features/starter-pack';
import { SplashPage, WelcomePage } from 'features/welcome';
import { MaintenancePage } from 'features/welcome/maintenance-page';
import { getFaqMain } from 'lib/getFaq';
import { getProps } from 'lib/getProps';
import { FC } from 'react';
import { GateActiveUser, GateLoaded, GateNodeOperator } from 'shared/gates';

type PageProps = Pick<SecretConfigType, 'maintenance'>;

const Page: FC<PageProps> = ({ maintenance }) => {
  if (maintenance) return <MaintenancePage />;

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

export const getStaticProps = getProps(getFaqMain, { continueAnyway: true });
