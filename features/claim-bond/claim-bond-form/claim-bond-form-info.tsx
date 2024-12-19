import { Zero } from '@ethersproject/constants';
import { DataTable, DataTableRow } from '@lidofinance/lido-ui';
import { TOKENS } from 'consts/tokens';
import { useWatch } from 'react-hook-form';
import { FormatToken } from 'shared/formatters';
import styled from 'styled-components';
import { ClaimBondFormInputType, useClaimBondFormData } from './context';
import { useBondReceiveAmount } from './hooks/use-bond-receive-amount';
import { Address } from 'shared/components';
import {
  AddressContainerStyle,
  AddressStyle,
} from 'shared/components/address/styles';

export const ClaimBondFormInfo = () => {
  const { rewardsAddress } = useClaimBondFormData();
  const [token, amount, claimRewards] = useWatch<
    ClaimBondFormInputType,
    ['token', 'amount', 'claimRewards']
  >({
    name: ['token', 'amount', 'claimRewards'],
  });

  const bondReceive = useBondReceiveAmount();

  return (
    <DataTable>
      <DataTableRow
        title={
          <AddressStyled>
            Rewards Address (
            <Address address={rewardsAddress} />) will receive
          </AddressStyled>
        }
      >
        <FormatToken amount={amount ?? Zero} token={token} />
      </DataTableRow>
      {claimRewards && (
        <DataTableRow title="Bond balance will increase by">
          <FormatToken amount={bondReceive} token={TOKENS.STETH} />
        </DataTableRow>
      )}
    </DataTable>
  );
};

const AddressStyled = styled.div`
  ${AddressContainerStyle} {
    display: inline-flex;
  }
  ${AddressStyle} {
    font-weight: bold;
  }
`;
