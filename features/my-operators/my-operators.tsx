import { FC } from 'react';
import { WhenLoaded } from 'shared/components';
import { useMyOperators, useShowRule } from 'shared/hooks';
import { CreateOperatorTile } from './create-operator-tile';
import { OperatorCard } from './operator-card';
import { ListStyle } from './styles';
import { SummaryCard } from './summary-card';

export const MyOperators: FC = () => {
  const { data: operators, isPending } = useMyOperators();
  const check = useShowRule();

  return (
    <WhenLoaded
      loading={isPending}
      empty={!operators?.length && <>No operators</>}
    >
      <ListStyle data-testid="myOperatorsList">
        <SummaryCard />
        {operators?.map((operator) => (
          <OperatorCard
            key={`${operator.module}-${operator.nodeOperatorId}`}
            operator={operator}
          />
        ))}
        {check('CAN_CREATE') && <CreateOperatorTile />}
      </ListStyle>
    </WhenLoaded>
  );
};
