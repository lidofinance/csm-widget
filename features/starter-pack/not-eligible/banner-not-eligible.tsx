import { Text } from '@lidofinance/lido-ui';
import { LIDO_OPERATOR_PORTAL_BASE } from 'consts';
import { FC } from 'react';
import { Banner, MatomoLink, Stack } from 'shared/components';
import { FailIcon } from 'shared/transaction-modal/tx-stages-basic/icons-styles';
import { Disconnect } from 'shared/wallet';

export const BannerNotEligible: FC = () => {
  return (
    <Banner
      data-testid="notEligibleSection"
      center
      title={
        <Stack direction="column" center gap="lg">
          <FailIcon />
          <Text size="lg" weight={700}>
            You’re not eligible to create a Node Operator
          </Text>
        </Stack>
      }
    >
      <Stack direction="column" gap="xl">
        <div>
          Creating a Node Operator is currently not available for this address
          in any module. For eligibility details, follow the{' '}
          <MatomoLink $inline href={LIDO_OPERATOR_PORTAL_BASE}>
            link
          </MatomoLink>
          .
        </div>
        <Disconnect color="error" variant="outlined" />
      </Stack>
    </Banner>
  );
};
