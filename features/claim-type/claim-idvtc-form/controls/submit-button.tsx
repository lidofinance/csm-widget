import { Button } from '@lidofinance/lido-ui';
import { PATH } from 'consts';
import { useWatch } from 'react-hook-form';
import { SubmitButtonHookForm } from 'shared/hook-form/controls';
import { LocalLink } from 'shared/navigate';
import {
  useClaimIdvtcFormData,
  type ClaimIdvtcFormInputType,
} from '../context';

export const SubmitButton = () => {
  const { isCurrentIcs } = useClaimIdvtcFormData();
  const mode = useWatch<ClaimIdvtcFormInputType, 'mode'>({ name: 'mode' });

  if (mode === 'create') {
    return (
      <LocalLink href={PATH.CREATE}>
        <Button fullwidth>Create IDVTC operator</Button>
      </LocalLink>
    );
  }

  return (
    <SubmitButtonHookForm>
      {isCurrentIcs ? 'Upgrade ICS to IDVTC' : 'Claim operator type'}
    </SubmitButtonHookForm>
  );
};
