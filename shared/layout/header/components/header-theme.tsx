import { ThemeSwitcher } from '@lidofinance/lido-app-ui';
import { useRouter } from 'next/router';
import { FC } from 'react';

const HeaderTheme: FC = () => {
  const router = useRouter();

  if (router?.query?.theme) return null;

  return <ThemeSwitcher data-testid="themeToggler" />;
};

export default HeaderTheme;
