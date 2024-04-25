import { DashboardPage } from 'features/dashboard';
import { WelcomePage } from 'features/welcome';
import {
  useNodeOperatorId,
  useNodeOperatorLoaded,
} from 'providers/node-operator-provider';
// import { DashboardPage } from 'features/dashboard';

// export default () => <DashboardPage fallback={WelcomePage} />;

const Switch = () => {
  const no = useNodeOperatorId();
  const loading = useNodeOperatorLoaded();

  return (
    <>
      {loading && <div>...loading</div>}
      {!loading && no && <DashboardPage />}
      {!loading && !no && <WelcomePage />}
    </>
  );
};

export default Switch;
