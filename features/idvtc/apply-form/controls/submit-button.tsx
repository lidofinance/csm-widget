import { FC } from 'react';
import { useWatch } from 'react-hook-form';
import { SubmitButtonHookForm } from 'shared/hook-form/controls';
import { CLUSTER_SIZE, type IdvtcApplyFormInputType } from '../context';

export const SubmitButton: FC = () => {
  const confirmed = useWatch<IdvtcApplyFormInputType, 'confirmed'>({
    name: 'confirmed',
  });
  const discordLink = useWatch<IdvtcApplyFormInputType, 'discordLink'>({
    name: 'discordLink',
  });
  const clusterMembers = useWatch<IdvtcApplyFormInputType, 'clusterMembers'>({
    name: 'clusterMembers',
  });

  const isComplete =
    !!confirmed &&
    !!discordLink &&
    (clusterMembers?.length ?? 0) >= CLUSTER_SIZE &&
    clusterMembers
      .slice(0, CLUSTER_SIZE)
      .every((m) => !!m?.address && !!m?.signature);

  return (
    <SubmitButtonHookForm data-testid="submitBtn" disabled={!isComplete}>
      Submit application
    </SubmitButtonHookForm>
  );
};
