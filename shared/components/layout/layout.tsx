import { ReactNode, FC, PropsWithChildren, useEffect } from 'react';

import { ContainerProps } from '@lidofinance/lido-ui';

import { Header } from './header/header';
import { Footer } from './footer/footer';
import { Main } from './main/main';
import {
  LayoutTitleStyle,
  LayoutSubTitleStyle,
  Heading,
  Content,
} from './styles';
import { DummyHeader } from './header/dummy-header';
import { FeedbackLine } from '../feedback-line';
import { trackMatomoEvent, WithMatomoEvent } from 'utils';

type Props = {
  title?: ReactNode;
  subtitle?: ReactNode;
  containerSize?: ContainerProps['size'];
  dummy?: boolean;
};

export const Layout: FC<PropsWithChildren<WithMatomoEvent<Props>>> = ({
  children,
  dummy,
  title,
  subtitle,
  containerSize,
  matomoEvent,
}) => {
  const titlesCount = [title, subtitle].filter(Boolean).length;

  useEffect(() => {
    trackMatomoEvent(matomoEvent);
  }, [matomoEvent]);

  return (
    <>
      {!dummy && <FeedbackLine />}
      {dummy ? <DummyHeader /> : <Header />}
      <Main size={containerSize}>
        <Heading $titlesCount={titlesCount}>
          {title && <LayoutTitleStyle>{title}</LayoutTitleStyle>}
          {subtitle && <LayoutSubTitleStyle>{subtitle}</LayoutSubTitleStyle>}
        </Heading>
        <Content>{children}</Content>
      </Main>
      <Footer />
    </>
  );
};
