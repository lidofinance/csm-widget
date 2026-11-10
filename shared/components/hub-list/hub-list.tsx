import { Caption, Card } from '@lidofinance/lido-app-ui';
import { Children, FC, PropsWithChildren, ReactNode } from 'react';
import { HubDividerStyle, HubOverlineStyle } from './styles';

export type HubListProps = PropsWithChildren<{
  overline?: ReactNode;
  dataTestId?: string;
}>;

export const HubList: FC<HubListProps> = ({
  overline,
  dataTestId,
  children,
}) => {
  const rows = Children.toArray(children);

  return (
    <Card dataTestId={{ root: dataTestId }}>
      <div>
        {overline && (
          <HubOverlineStyle>
            <Caption color="tertiary">{overline}</Caption>
          </HubOverlineStyle>
        )}
        {rows.map((row, index) => (
          <div key={index}>
            {index > 0 && <HubDividerStyle role="separator" />}
            {row}
          </div>
        ))}
      </div>
    </Card>
  );
};
