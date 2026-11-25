import { Logo, Spinner } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { WIDGET_DESCRIPTION, WIDGET_TITLE } from 'consts/module';
import s from './app-shell-loader.module.css';

export const AppShellLoader: FC = () => (
  <div className={s.wrapper}>
    <header className={s.header}>
      <Logo variant="full" product={WIDGET_TITLE} />
    </header>
    <main className={s.main}>
      <h1 className={s.title}>{WIDGET_TITLE}</h1>
      <p className={s.description}>{WIDGET_DESCRIPTION}</p>
      <Spinner size="lg" label="Loading" />
    </main>
  </div>
);
