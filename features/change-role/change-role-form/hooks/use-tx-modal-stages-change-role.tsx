import { type NodeOperatorShortInfo, ROLES } from '@lidofinance/lido-csm-sdk';
import { ROLES_METADATA } from 'consts/roles';
import { buildAcceptInviteStages } from 'features/accept-invite/accept-invite-form/hooks/use-tx-modal-stages-accept-invite';
import { type ChangeRoleMode, useChangeRoleMode } from 'shared/hooks';
import {
  AfterAddressProposed,
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  useTxStages,
} from 'shared/transaction-modal';
import { zeroAddress } from 'viem';
import { TxAddressDescription } from '../../shared/tx-address-description';
import {
  ChangeRoleFormInputType,
  ChangeRoleFormNetworkData,
} from '../context/types';

const getTexts = (
  input: ChangeRoleFormInputType,
  data: ChangeRoleFormNetworkData,
  mode: ChangeRoleMode,
) => {
  const address =
    input.intent === 'revoke' ? zeroAddress : (input.address ?? zeroAddress);
  const roleTitle = ROLES_METADATA[data.role].capitalizedTitle;

  if (mode === 'managerReset' || mode === 'rewardsChange') {
    const description = (
      <TxAddressDescription
        label={`New ${roleTitle} Address is`}
        address={address}
      />
    );

    return {
      sign: { title: `You are changing ${roleTitle} Address`, description },
      success: { title: `${roleTitle} Address has been changed`, description },
    };
  }

  if (input.intent === 'revoke') {
    const description = (
      <TxAddressDescription
        label="Address stays"
        address={data.currentAddress}
      />
    );

    return {
      sign: {
        title: `You are canceling request for ${roleTitle} Address change`,
        description,
      },
      success: {
        title: `Proposed request for ${roleTitle} Address has been canceled`,
        description,
      },
    };
  }

  return {
    sign: {
      title: `You are proposing ${roleTitle} Address change`,
      description: (
        <TxAddressDescription label="Proposed address" address={address} />
      ),
    },
    success: {
      title: `New ${roleTitle} Address has been proposed`,
      description: <AfterAddressProposed address={address} />,
    },
  };
};

export const useTxModalStagesChangeRole = (role: ROLES) => {
  const mode = useChangeRoleMode(role);

  return useTxStages<
    ChangeRoleFormInputType,
    ChangeRoleFormNetworkData,
    NodeOperatorShortInfo
  >(
    (transitStage, input, data) => {
      if (input.intent === 'accept') {
        return buildAcceptInviteStages(transitStage, {
          invite: { nodeOperatorId: data.nodeOperatorId, role: data.role },
          address: data.address,
        });
      }

      return {
        sign: () =>
          transitStage(<TxStageSign {...getTexts(input, data, mode).sign} />),
        pending: (txHash) =>
          transitStage(
            <TxStagePending
              {...getTexts(input, data, mode).sign}
              txHash={txHash}
            />,
          ),
        success: (_result: NodeOperatorShortInfo, txHash) =>
          transitStage(
            <TxStageSuccess
              txHash={txHash}
              {...getTexts(input, data, mode).success}
            />,
          ),
      };
    },
    [mode],
  );
};
