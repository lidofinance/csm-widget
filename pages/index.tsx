import { DashboardPage } from 'features/dashboard';
import { WelcomePage } from 'features/welcome';
import { useNodeOperator } from 'providers/node-operator-provider';

const Switch = () => {
  const { active, isLoading: loading } = useNodeOperator();

  return (
    <>
      {loading && <div>...loading</div>}
      {!loading && active && <DashboardPage />}
      {!loading && !active && <WelcomePage />}
    </>
  );
};

export default Switch;
