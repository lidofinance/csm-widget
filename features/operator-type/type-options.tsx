import { AddressProof } from '@lidofinance/lido-csm-sdk';
import { Button, Check, Text } from '@lidofinance/lido-ui';
import { PATH } from 'consts/urls';
import { useIcsProof, useIdvtcProof } from 'modules/web3';
import { FC } from 'react';
import { Stack, StatusChip } from 'shared/components';
import { LocalLink } from 'shared/navigate';
import { OptionCard, OptionsWrap, TypeBadge } from './styles';

type ProofStatus = 'NONE' | 'ISSUED' | 'CLAIMED';

const getProofStatus = (proof: AddressProof | undefined): ProofStatus => {
  if (proof?.isConsumed) return 'CLAIMED';
  if (proof?.proof) return 'ISSUED';
  return 'NONE';
};

type TypeOptionProps = {
  variant: 'ICS' | 'IDVTC';
  title: string;
  description: string;
  applyPath: PATH;
  claimPath: PATH;
  status: ProofStatus;
};

const StatusBadge: FC<{ status: ProofStatus }> = ({ status }) => {
  if (status === 'ISSUED')
    return (
      <StatusChip variant="success" pale>
        <Check />
        Issued
      </StatusChip>
    );
  if (status === 'CLAIMED')
    return (
      <StatusChip variant="default" pale>
        <Check />
        Claimed
      </StatusChip>
    );
  return null;
};

const TypeOption: FC<TypeOptionProps> = ({
  variant,
  title,
  description,
  applyPath,
  claimPath,
  status,
}) => (
  <OptionCard>
    <Stack direction="column" gap="md">
      <Stack direction="row" justify="space-between" align="center">
        <TypeBadge $variant={variant}>{variant}</TypeBadge>
        <StatusBadge status={status} />
      </Stack>
      <Stack direction="column" gap="xs">
        <Text as="h3" size="sm" weight={700}>
          {title}
        </Text>
        <Text size="xxs" color="secondary">
          {description}
        </Text>
      </Stack>
    </Stack>
    {status === 'CLAIMED' && (
      <LocalLink href={applyPath}>
        <Button fullwidth variant="translucent">
          All set! Look, don&apos;t touch
        </Button>
      </LocalLink>
    )}
    {status === 'ISSUED' && (
      <LocalLink href={claimPath}>
        <Button fullwidth>Claim {variant} type</Button>
      </LocalLink>
    )}
    {status === 'NONE' && (
      <LocalLink href={applyPath}>
        <Button fullwidth variant="translucent">
          Apply for {variant}
        </Button>
      </LocalLink>
    )}
  </OptionCard>
);

export const TypeOptions: FC = () => {
  const { data: icsProof } = useIcsProof();
  const { data: idvtcProof } = useIdvtcProof();

  return (
    <OptionsWrap>
      <TypeOption
        variant="ICS"
        title="Identified Community Staker"
        description="Obtain enhanced validation parameters by becoming recognized as an independent Community Staker. Please note that the verification process takes time and requires the submission of specific supporting proofs."
        applyPath={PATH.TYPE_ICS_APPLY}
        claimPath={PATH.TYPE_ICS_CLAIM}
        status={getProofStatus(icsProof)}
      />
      <TypeOption
        variant="IDVTC"
        title="Identified DVT Cluster"
        description="Unlock a more resilient and capital-efficient validation path by creating a verified DVT cluster of independent Community Stakers. Approval requires meeting criteria and completing verification."
        applyPath={PATH.TYPE_DVT_APPLY}
        claimPath={PATH.TYPE_DVT_CLAIM}
        status={getProofStatus(idvtcProof)}
      />
    </OptionsWrap>
  );
};
