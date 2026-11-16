import { Button, Stack } from '@lidofinance/lido-app-ui';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { useAvailableOperators, useNodeOperator } from 'modules/web3';
import { useCreateRows } from 'shared/node-operator';
import { HeroCard, HeroText } from './hero-card';

export const SelectOperatorHero: FC = () => {
  const { requestSelection } = useNodeOperator();
  const { data: list } = useAvailableOperators();
  const { hasRows: canCreate } = useCreateRows();
  const count = list?.length ?? 0;
  const create = canCreate ? ', or create a new one' : '';

  return (
    <HeroCard
      variant="fill"
      title="Choose a Node Operator"
      text={
        <HeroText>
          {count === 1
            ? `Your wallet manages a Node Operator. Choose it to open its dashboard${create}.`
            : `Your wallet manages ${count} Node Operators. Choose one to open its dashboard${create}.`}
        </HeroText>
      }
      actions={
        <Stack direction="row" gap={12} wrap>
          <Button
            variant="primary"
            size="big"
            onClick={requestSelection}
            data-testid="heroChooseOperatorBtn"
          >
            Choose Node Operator
          </Button>
          {canCreate && (
            <Button
              href={PATH.CREATE}
              variant="outline"
              size="big"
              data-testid="heroCreateOperatorBtn"
            >
              Create new operator
            </Button>
          )}
        </Stack>
      }
    />
  );
};
