import { BOND_PATH } from 'consts/urls';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { FC } from 'react';
import { SectionBlock, Stack } from 'shared/components';
import { useNodeOperatorBalance } from 'shared/hooks';
import { Row, RowBody, RowHeader, RowTitle, SignStyle } from './styles';
import { TOKENS } from 'consts/tokens';
import { FormatToken } from 'shared/formatters';
import { Balance } from './balance';
import { Text } from '@lidofinance/lido-ui';

export const BondSection: FC = () => {
  const id = useNodeOperatorId();

  const { data: balance } = useNodeOperatorBalance(id);

  return (
    <SectionBlock title="Bond & Rewards" href={BOND_PATH}>
      {balance && (
        <Stack direction="column" gap="sm">
          <Row>
            <RowHeader>
              <RowTitle>Bond balance</RowTitle>
              <Balance big>
                <FormatToken amount={balance.current} symbol={TOKENS.STETH} />
                <Text size={'xxs'} color={'secondary'}>
                  <FormatToken
                    amount={balance.required}
                    symbol={TOKENS.STETH}
                    approx={true}
                  />
                </Text>
              </Balance>
            </RowHeader>
            <RowBody>
              <Balance title="Required bond">
                <FormatToken amount={balance.current} symbol={TOKENS.STETH} />
                <Text size={'xxs'} color={'secondary'}>
                  <FormatToken
                    amount={balance.required}
                    symbol={TOKENS.STETH}
                    approx={true}
                  />
                </Text>
              </Balance>
              <Sign />
              <Balance title="Excess bond">
                <FormatToken amount={balance.current} symbol={TOKENS.STETH} />
                <Text size={'xxs'} color={'secondary'}>
                  <FormatToken
                    amount={balance.required}
                    symbol={TOKENS.STETH}
                    approx={true}
                  />
                </Text>
              </Balance>
            </RowBody>
          </Row>
        </Stack>
      )}
    </SectionBlock>
  );
};

import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';
import { ReactComponent as MinusIcon } from 'assets/icons/minus.svg';

export const Sign: FC<{ minus?: boolean }> = ({ minus }) => (
  <SignStyle>{minus ? <MinusIcon /> : <PlusIcon />}</SignStyle>
);
