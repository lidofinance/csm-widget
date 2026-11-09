import { Breadcrumbs } from '@lidofinance/lido-app-ui';
import { FC, useMemo } from 'react';
import styled from 'styled-components';
import { useCorrectPath } from 'shared/navigate';
import { Crumb } from './types';

// lib caps non-last items at nav width - 72px; a shrink-to-fit nav makes that cyclic and clips short trails
const BreadcrumbsStyled = styled(Breadcrumbs)`
  && {
    width: 100%;
  }
`;

type Props = { crumbs: Crumb[]; className?: string };

export const Crumbs: FC<Props> = ({ crumbs, className }) => {
  const correct = useCorrectPath();

  const items = useMemo(
    () =>
      crumbs.map(({ label, href }) =>
        href ? { label, href: correct(href) } : { label },
      ),
    [crumbs, correct],
  );

  if (items.length === 0) return null;
  return <BreadcrumbsStyled items={items} className={className} />;
};
