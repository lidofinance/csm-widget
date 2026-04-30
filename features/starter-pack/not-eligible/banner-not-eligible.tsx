import { Text } from '@lidofinance/lido-ui';
import { LIDO_OPERATOR_PORTAL_CM } from 'consts';
import { FC } from 'react';
import { Banner, MatomoLink, Stack } from 'shared/components';
import { FailIcon } from 'shared/transaction-modal/tx-stages-basic/icons-styles';
import { Disconnect } from 'shared/wallet';

export const BannerNotEligible: FC = () => {
  return (
    <Banner
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
          The Curated Module v2 consists of allow-listed independent
          professional staking organizations and Ethereum client teams, which
          operate validators using the protocol. For a detailed description of
          the module, follow{' '}
          <MatomoLink $inline href={LIDO_OPERATOR_PORTAL_CM}>
            the link
          </MatomoLink>
          .
        </div>
        <Disconnect color="error" variant="outlined" />
      </Stack>
    </Banner>
  );
};
