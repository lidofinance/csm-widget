import { Tag, Typography } from '@lidofinance/lido-app-ui';
import { useDappStatus } from 'modules/web3';
import { FC } from 'react';
import { SubmitButton } from 'shared/form-page';
import { isAddressEqual } from 'viem';
import { RoleAddress } from '../../shared/role-address';
import { RoleCard } from '../../shared/role-card';
import { CLAIMER_TOOLTIP } from '../claimer-state';
import { useClaimerFormData } from '../context';

export const CurrentClaimerCard: FC = () => {
  const { address } = useDappStatus();
  const { currentClaimerAddress, canEdit } = useClaimerFormData(true);

  return (
    <RoleCard
      data-testid="currentClaimerInfo"
      title="Current Rewards claimer"
      tooltip={CLAIMER_TOOLTIP}
    >
      {currentClaimerAddress ? (
        <RoleAddress
          address={currentClaimerAddress}
          data-testid="currentClaimerAddress"
          tags={
            <>
              {address && isAddressEqual(currentClaimerAddress, address) && (
                <Tag variant="neutral">You</Tag>
              )}
              {canEdit && (
                <SubmitButton
                  intent="unset"
                  variant="outline"
                  size="small"
                  fullWidth={false}
                  ignoreErrors
                  data-testid="unsetClaimerButton"
                >
                  Unset
                </SubmitButton>
              )}
            </>
          }
        />
      ) : (
        <Typography variant="body" as="p">
          Not set
        </Typography>
      )}
    </RoleCard>
  );
};
