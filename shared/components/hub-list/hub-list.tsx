import { Caption, Card, Divider } from '@lidofinance/lido-app-ui';
import { Children, FC, PropsWithChildren, ReactNode } from 'react';
import s from './styles.module.css';

export type HubListProps = PropsWithChildren<{
  overline?: ReactNode;
  footer?: ReactNode;
  dataTestId?: string;
}>;

export const HubList: FC<HubListProps> = ({
  overline,
  footer,
  dataTestId,
  children,
}) => {
  const rows = Children.toArray(children);

  return (
    <Card dataTestId={{ root: dataTestId }}>
      <div className={s.hubList}>
        {overline && (
          <div className={s.overline}>
            <Caption color="tertiary">{overline}</Caption>
          </div>
        )}
        {rows.map((row, index) => (
          <div key={index}>
            {index > 0 && <Divider role="separator" />}
            {row}
          </div>
        ))}
        {footer && <div className={s.footer}>{footer}</div>}
      </div>
    </Card>
  );
};
