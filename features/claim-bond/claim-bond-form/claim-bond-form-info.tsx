import { Zero } from '@ethersproject/constants';
import { DataTable, DataTableRow } from '@lidofinance/lido-ui';
import { TOKENS } from 'consts/tokens';
import { useWatch } from 'react-hook-form';
import { FormatToken } from 'shared/formatters';
import styled from 'styled-components';
import { ClaimBondFormInputType, useClaimBondFormData } from './context';
import { Address } from 'shared/components';
import {
  AddressContainerStyle,
  AddressStyle,
} from 'shared/components/address/styles';
import { useBondWillReceive } from 'shared/hooks';

export const ClaimBondFormInfo = () => {
  const { rewardsAddress, rewards } = useClaimBondFormData();
  const [token, amount, claimRewards] = useWatch<
    ClaimBondFormInputType,
    ['token', 'amount', 'claimRewards']
  >({
    name: ['token', 'amount', 'claimRewards'],
  });

  const [bondReceive] = useBondWillReceive(
    token,
    amount,
    claimRewards ? rewards?.available : undefined,
  );

  return (
    <DataTable>
      <DataTableRow
        title={
          <AddressStyled>
            Rewards Address (
            <Address address={rewardsAddress} />) will receive
          </AddressStyled>
        }
        help="The recipient of the claim is the Rewards address. You can change the Rewards address on the Roles tab"
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
  display: inline;

  ${AddressContainerStyle} {
    display: inline-flex;
  }
  ${AddressStyle} {
    font-weight: bold;
  }
`;
