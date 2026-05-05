import { Button, Text } from '@lidofinance/lido-ui';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { LocalLink } from 'shared/navigate';
import { OptionCard, OptionsWrap, TypeBadge } from './styles';

export const TypeOptions: FC = () => (
  <OptionsWrap>
    <OptionCard>
      <Stack direction="column" gap="md">
        <Stack direction="row">
          <TypeBadge $variant="ICS">ICS</TypeBadge>
        </Stack>
        <Stack direction="column" gap="xs">
          <Text as="h3" size="sm" weight={700}>
            Identified Community Staker
          </Text>
          <Text size="xxs" color="secondary">
            Obtain enhanced validation parameters by becoming recognized as an
            independent Community Staker. Please note that the verification
            process takes time and requires the submission of specific
            supporting proofs.
          </Text>
        </Stack>
      </Stack>
      <LocalLink href={PATH.TYPE_ICS_APPLY}>
        <Button fullwidth variant="translucent">
          Apply for ICS
        </Button>
      </LocalLink>
    </OptionCard>

    <OptionCard>
      <Stack direction="column" gap="md">
        <Stack direction="row">
          <TypeBadge $variant="IDVTC">IDVTC</TypeBadge>
        </Stack>
        <Stack direction="column" gap="xs">
          <Text as="h3" size="sm" weight={700}>
            Identified DVT Cluster
          </Text>
          <Text size="xxs" color="secondary">
            Unlock a more resilient and capital-efficient validation path by
            creating a verified DVT cluster of independent Community Stakers.
            Approval requires meeting criteria and completing verification.
          </Text>
        </Stack>
      </Stack>
      <LocalLink href={PATH.TYPE_DVT_APPLY}>
        <Button fullwidth variant="translucent">
          Apply for IDVTS
        </Button>
      </LocalLink>
    </OptionCard>
  </OptionsWrap>
);
